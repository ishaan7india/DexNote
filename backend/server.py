from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dexnote-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ============= MODELS =============

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    streak_count: int = 0
    last_login_date: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserResponse(BaseModel):
    user: User
    token: str

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # "coding" or "ai-tools" or "mathematics"
    difficulty: str  # "beginner", "intermediate", "advanced"
    duration: str  # "4 weeks", "8 weeks", etc.
    modules_count: int
    thumbnail: str = ""
    requires_terms: bool = False  # For courses requiring T&C acceptance
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Module(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    title: str
    content: str
    order: int
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Enrollment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    course_id: str
    progress: float = 0.0  # percentage 0-100
    enrolled_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Progress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module_id: str
    course_id: str
    completed: bool = False
    completed_at: Optional[str] = None

class EnrollmentRequest(BaseModel):
    course_id: str
    terms_accepted: bool = False  # For courses requiring T&C

class ProgressUpdate(BaseModel):
    module_id: str
    course_id: str
    completed: bool

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

# ============= HELPER FUNCTIONS =============

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= AUTH ROUTES =============

@api_router.post("/auth/signup", response_model=UserResponse)
async def signup(user_data: UserSignup):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await db.users.find_one({"username": user_data.username}, {"_id": 0})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email
    )
    
    user_dict = user.model_dump()
    user_dict["password_hash"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"sub": user.id})
    
    return UserResponse(user=user, token=token)

@api_router.post("/auth/login", response_model=UserResponse)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_obj = User(**user)
    token = create_access_token({"sub": user_obj.id})
    
    return UserResponse(user=user_obj, token=token)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============= COURSE ROUTES =============

@api_router.get("/courses", response_model=List[Course])
async def get_courses(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    
    courses = await db.courses.find(query, {"_id": 0}).to_list(1000)
    return courses

@api_router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@api_router.get("/courses/{course_id}/modules", response_model=List[Module])
async def get_course_modules(course_id: str):
    modules = await db.modules.find({"course_id": course_id}, {"_id": 0}).sort("order", 1).to_list(1000)
    return modules

# ============= ENROLLMENT ROUTES =============

@api_router.post("/enrollments", response_model=Enrollment)
async def enroll_course(enrollment_data: EnrollmentRequest, current_user: User = Depends(get_current_user)):
    # Check if already enrolled
    existing = await db.enrollments.find_one({
        "user_id": current_user.id,
        "course_id": enrollment_data.course_id
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    # Check if course exists
    course = await db.courses.find_one({"id": enrollment_data.course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if course requires terms acceptance
    if course.get("requires_terms", False) and not enrollment_data.terms_accepted:
        raise HTTPException(status_code=400, detail="Terms and conditions must be accepted for this course")
    
    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=enrollment_data.course_id
    )
    
    await db.enrollments.insert_one(enrollment.model_dump())
    return enrollment

@api_router.get("/enrollments/my", response_model=List[dict])
async def get_my_enrollments(current_user: User = Depends(get_current_user)):
    enrollments = await db.enrollments.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    # Fetch course details for each enrollment
    result = []
    for enrollment in enrollments:
        course = await db.courses.find_one({"id": enrollment["course_id"]}, {"_id": 0})
        if course:
            result.append({
                **enrollment,
                "course": course
            })
    
    return result

# ============= PROGRESS ROUTES =============

@api_router.put("/progress")
async def update_progress(progress_data: ProgressUpdate, current_user: User = Depends(get_current_user)):
    # Find or create progress record
    existing = await db.progress.find_one({
        "user_id": current_user.id,
        "module_id": progress_data.module_id
    }, {"_id": 0})
    
    if existing:
        update_data = {
            "completed": progress_data.completed,
            "completed_at": datetime.now(timezone.utc).isoformat() if progress_data.completed else None
        }
        await db.progress.update_one(
            {"user_id": current_user.id, "module_id": progress_data.module_id},
            {"$set": update_data}
        )
    else:
        progress = Progress(
            user_id=current_user.id,
            module_id=progress_data.module_id,
            course_id=progress_data.course_id,
            completed=progress_data.completed,
            completed_at=datetime.now(timezone.utc).isoformat() if progress_data.completed else None
        )
        await db.progress.insert_one(progress.model_dump())
    
    # Update enrollment progress
    total_modules = await db.modules.count_documents({"course_id": progress_data.course_id})
    completed_modules = await db.progress.count_documents({
        "user_id": current_user.id,
        "course_id": progress_data.course_id,
        "completed": True
    })
    
    progress_percentage = (completed_modules / total_modules * 100) if total_modules > 0 else 0
    
    await db.enrollments.update_one(
        {"user_id": current_user.id, "course_id": progress_data.course_id},
        {"$set": {"progress": progress_percentage}}
    )
    
    return {"message": "Progress updated", "progress": progress_percentage}

@api_router.get("/progress/course/{course_id}")
async def get_course_progress(course_id: str, current_user: User = Depends(get_current_user)):
    progress_records = await db.progress.find({
        "user_id": current_user.id,
        "course_id": course_id
    }, {"_id": 0}).to_list(1000)
    
    return progress_records

# ============= PROFILE ROUTES =============

@api_router.get("/profile", response_model=User)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

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
