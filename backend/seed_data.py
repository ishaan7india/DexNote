import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.dexnote

# Complete course data
courses_data = [
    {
        "id": "react-basics",
        "title": "React Basics",
        "description": "Learn the fundamentals of React including components, props, state, and hooks. Perfect for beginners looking to start their journey in modern web development.",
        "difficulty": "Beginner",
        "duration": "4 weeks",
        "instructor": "Sarah Johnson",
        "rating": 4.8,
        "enrolled": 1250,
        "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        "modules": [
            {"id": "m1", "title": "Introduction to React", "duration": "45 min", "completed": False},
            {"id": "m2", "title": "Components and Props", "duration": "60 min", "completed": False},
            {"id": "m3", "title": "State and Lifecycle", "duration": "75 min", "completed": False},
            {"id": "m4", "title": "React Hooks", "duration": "90 min", "completed": False}
        ],
        "tags": ["React", "JavaScript", "Frontend", "Web Development"]
    },
    {
        "id": "python-advanced",
        "title": "Advanced Python",
        "description": "Master advanced Python concepts including decorators, generators, async programming, and design patterns. Take your Python skills to the next level.",
        "difficulty": "Advanced",
        "duration": "6 weeks",
        "instructor": "Dr. Michael Chen",
        "rating": 4.9,
        "enrolled": 850,
        "image": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
        "modules": [
            {"id": "m1", "title": "Decorators and Metaclasses", "duration": "90 min", "completed": False},
            {"id": "m2", "title": "Generators and Iterators", "duration": "75 min", "completed": False},
            {"id": "m3", "title": "Async Programming", "duration": "120 min", "completed": False},
            {"id": "m4", "title": "Design Patterns in Python", "duration": "100 min", "completed": False}
        ],
        "tags": ["Python", "Programming", "Backend", "Advanced"]
    },
    {
        "id": "web-design",
        "title": "Web Design Fundamentals",
        "description": "Learn the principles of modern web design including typography, color theory, layout, and responsive design. Create beautiful and user-friendly websites.",
        "difficulty": "Beginner",
        "duration": "5 weeks",
        "instructor": "Emily Rodriguez",
        "rating": 4.7,
        "enrolled": 1100,
        "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
        "modules": [
            {"id": "m1", "title": "Design Principles", "duration": "50 min", "completed": False},
            {"id": "m2", "title": "Typography and Color", "duration": "65 min", "completed": False},
            {"id": "m3", "title": "Layout and Grid Systems", "duration": "80 min", "completed": False},
            {"id": "m4", "title": "Responsive Design", "duration": "90 min", "completed": False}
        ],
        "tags": ["Design", "UI/UX", "Web", "Creative"]
    },
    {
        "id": "data-science",
        "title": "Data Science with Python",
        "description": "Dive into data science with Python. Learn data analysis, visualization, machine learning basics, and work with real-world datasets.",
        "difficulty": "Intermediate",
        "duration": "8 weeks",
        "instructor": "Prof. David Kim",
        "rating": 4.9,
        "enrolled": 2100,
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "modules": [
            {"id": "m1", "title": "NumPy and Pandas Basics", "duration": "100 min", "completed": False},
            {"id": "m2", "title": "Data Visualization", "duration": "85 min", "completed": False},
            {"id": "m3", "title": "Statistical Analysis", "duration": "95 min", "completed": False},
            {"id": "m4", "title": "Machine Learning Introduction", "duration": "120 min", "completed": False}
        ],
        "tags": ["Data Science", "Python", "Machine Learning", "Analytics"]
    },
    {
        "id": "nodejs-backend",
        "title": "Node.js Backend Development",
        "description": "Build scalable backend applications with Node.js and Express. Learn REST APIs, authentication, database integration, and deployment strategies.",
        "difficulty": "Intermediate",
        "duration": "7 weeks",
        "instructor": "James Wilson",
        "rating": 4.8,
        "enrolled": 1600,
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        "modules": [
            {"id": "m1", "title": "Node.js Fundamentals", "duration": "80 min", "completed": False},
            {"id": "m2", "title": "Express.js and REST APIs", "duration": "95 min", "completed": False},
            {"id": "m3", "title": "Database Integration", "duration": "110 min", "completed": False},
            {"id": "m4", "title": "Authentication and Security", "duration": "100 min", "completed": False}
        ],
        "tags": ["Node.js", "Backend", "API", "JavaScript"]
    },
    {
        "id": "mobile-dev",
        "title": "Mobile App Development",
        "description": "Create cross-platform mobile applications using React Native. Build apps for both iOS and Android with a single codebase.",
        "difficulty": "Intermediate",
        "duration": "10 weeks",
        "instructor": "Lisa Martinez",
        "rating": 4.7,
        "enrolled": 950,
        "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        "modules": [
            {"id": "m1", "title": "React Native Basics", "duration": "90 min", "completed": False},
            {"id": "m2", "title": "Navigation and Routing", "duration": "85 min", "completed": False},
            {"id": "m3", "title": "State Management", "duration": "100 min", "completed": False},
            {"id": "m4", "title": "Native Features", "duration": "120 min", "completed": False}
        ],
        "tags": ["Mobile", "React Native", "iOS", "Android"]
    },
    {
        "id": "cloud-computing",
        "title": "Cloud Computing Essentials",
        "description": "Learn cloud computing fundamentals with AWS. Understand services, deployment, scaling, and best practices for cloud architecture.",
        "difficulty": "Intermediate",
        "duration": "6 weeks",
        "instructor": "Robert Taylor",
        "rating": 4.8,
        "enrolled": 1400,
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        "modules": [
            {"id": "m1", "title": "Cloud Computing Overview", "duration": "70 min", "completed": False},
            {"id": "m2", "title": "AWS Services Introduction", "duration": "90 min", "completed": False},
            {"id": "m3", "title": "Deployment and Scaling", "duration": "105 min", "completed": False},
            {"id": "m4", "title": "Security and Best Practices", "duration": "95 min", "completed": False}
        ],
        "tags": ["Cloud", "AWS", "DevOps", "Infrastructure"]
    },
    {
        "id": "machine-learning",
        "title": "Machine Learning Fundamentals",
        "description": "Master machine learning algorithms and techniques. Learn supervised and unsupervised learning, neural networks, and model evaluation.",
        "difficulty": "Advanced",
        "duration": "12 weeks",
        "instructor": "Dr. Amanda Chen",
        "rating": 4.9,
        "enrolled": 1800,
        "image": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
        "modules": [
            {"id": "m1", "title": "Supervised Learning", "duration": "120 min", "completed": False},
            {"id": "m2", "title": "Unsupervised Learning", "duration": "110 min", "completed": False},
            {"id": "m3", "title": "Neural Networks", "duration": "130 min", "completed": False},
            {"id": "m4", "title": "Model Evaluation", "duration": "100 min", "completed": False}
        ],
        "tags": ["AI", "Machine Learning", "Python", "Deep Learning"]
    }
]

async def seed_database():
    """Populate the database with course data"""
    try:
        # Clear existing courses
        await db.courses.delete_many({})
        print("Cleared existing courses")
        
        # Insert new courses
        result = await db.courses.insert_many(courses_data)
        print(f"Inserted {len(result.inserted_ids)} courses")
        
        # Verify insertion
        count = await db.courses.count_documents({})
        print(f"Total courses in database: {count}")
        
        return True
    except Exception as e:
        print(f"Error seeding database: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(seed_database())
    print("Database seeding completed!")
