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
