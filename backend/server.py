import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
import jwt
from openai import OpenAI

# MongoDB setup
client = AsyncIOMotorClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017'))
db = client.dexnote

app = FastAPI(title="DexNote API")
api_router = APIRouter(prefix="/api")

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')

# OpenAI setup
openai_client = None
if os.environ.get('OPENAI_API_KEY'):
    openai_client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# ============= MODELS =============
class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class Course(BaseModel):
    id: str
    title: str
    description: str
    instructor: str
    duration: str
    level: str
    thumbnail: str

class EnrollmentCreate(BaseModel):
    course_id: str

class ProgressUpdate(BaseModel):
    course_id: str
    progress: int = Field(..., ge=0, le=100)

class MathProblem(BaseModel):
    expression: str

# ============= HELPER FUNCTIONS =============
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# ============= AUTH ROUTES =============
@api_router.post("/auth/register")
async def register(user: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"$or": [{"username": user.username}, {"email": user.email}]}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    user_doc = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    token = create_access_token({"sub": user_id})
    
    return {
        "token": token,
        "user": User(id=user_id, username=user.username, email=user.email, full_name=user.full_name)
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    token = create_access_token({"sub": user["id"]})
    return {
        "token": token,
        "user": User(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            full_name=user.get("full_name")
        )
    }

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============= COURSES ROUTES =============
@api_router.get("/courses")
async def get_courses(current_user: User = Depends(get_current_user)):
    courses = await db.courses.find({}, {"_id": 0}).to_list(length=100)
    return courses

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str, current_user: User = Depends(get_current_user)):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# ============= ENROLLMENTS ROUTES =============
@api_router.post("/enrollments")
async def enroll_course(enrollment: EnrollmentCreate, current_user: User = Depends(get_current_user)):
    # Check if course exists
    course = await db.courses.find_one({"id": enrollment.course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already enrolled
    existing = await db.enrollments.find_one({
        "user_id": current_user.id,
        "course_id": enrollment.course_id
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    enrollment_doc = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "course_id": enrollment.course_id,
        "enrolled_at": datetime.utcnow(),
        "progress": 0
    }
    
    await db.enrollments.insert_one(enrollment_doc)
    return {"message": "Enrolled successfully", "enrollment": enrollment_doc}

@api_router.get("/enrollments")
async def get_enrollments(current_user: User = Depends(get_current_user)):
    enrollments = await db.enrollments.find({"user_id": current_user.id}, {"_id": 0}).to_list(length=100)
    
    # Populate course details
    for enrollment in enrollments:
        course = await db.courses.find_one({"id": enrollment["course_id"]}, {"_id": 0})
        enrollment["course"] = course
    
    return enrollments

# ============= PROGRESS ROUTES =============
@api_router.put("/progress")
async def update_progress(progress_data: ProgressUpdate, current_user: User = Depends(get_current_user)):
    enrollment = await db.enrollments.find_one({
        "user_id": current_user.id,
        "course_id": progress_data.course_id
    }, {"_id": 0})
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    await db.enrollments.update_one(
        {"user_id": current_user.id, "course_id": progress_data.course_id},
        {"$set": {"progress": progress_data.progress}}
    )
    
    return {"message": "Progress updated", "progress": progress_data.progress}

# ============= PROFILE ROUTES =============
@api_router.put("/profile", response_model=User)
async def update_profile(profile_data: ProfileUpdate, current_user: User = Depends(get_current_user)):
    update_fields = {}
    if profile_data.username:
        # Check if username is taken
        existing = await db.users.find_one({
            "username": profile_data.username,
            "id": {"$ne": current_user.id}
        }, {"_id": 0})
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        update_fields["username"] = profile_data.username
    if profile_data.email:
        # Check if email is taken
        existing = await db.users.find_one({
            "email": profile_data.email,
            "id": {"$ne": current_user.id}
        }, {"_id": 0})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        update_fields["email"] = profile_data.email
    if update_fields:
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": update_fields}
        )
    updated_user = await db.users.find_one({"id": current_user.id}, {"_id": 0})
    return User(**updated_user)

# ============= AI ROUTES =============
@api_router.post("/ai/solve-math")
async def solve_math(problem: MathProblem, current_user: User = Depends(get_current_user)):
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured on server")
    try:
        prompt = (
            "Solve the following math expression and show steps briefly: "
            f"{problem.expression}. Provide the final simplified answer."
        )
        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a precise math solver."},
                {"role": "user", "content": prompt}
            ]
        )
        answer = completion.choices[0].message.content
        return {"solution": answer}
    except Exception as e:
        logging.exception("Math solver error")
        raise HTTPException(status_code=500, detail=str(e))

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
