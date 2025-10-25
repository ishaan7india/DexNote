import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.dexnote

# Mathematics course data (real math courses, not AI-related)
courses_data = [
    {
        "id": "algebra-1",
        "title": "Algebra 1",
        "description": "Foundational algebra covering variables, linear equations and inequalities, functions, systems, and polynomials.",
        "difficulty": "Beginner",
        "duration": "8 weeks",
        "instructor": "Prof. Emily Carter",
        "rating": 4.8,
        "enrolled": 2200,
        "image": "https://images.unsplash.com/photo-1509223197845-458d87318791?w=800",
        "modules": [
            {"id": "m1", "title": "Expressions, Equations, and Inequalities", "duration": "60 min", "completed": False},
            {"id": "m2", "title": "Functions and Graphs", "duration": "75 min", "completed": False},
            {"id": "m3", "title": "Linear Equations and Systems", "duration": "90 min", "completed": False},
            {"id": "m4", "title": "Polynomials and Factoring", "duration": "85 min", "completed": False}
        ],
        "tags": ["Mathematics", "Algebra", "Functions", "Equations"]
    },
    {
        "id": "geometry",
        "title": "Geometry",
        "description": "Euclidean geometry with points, lines, planes, congruence, similarity, circles, area, and volume.",
        "difficulty": "Beginner",
        "duration": "8 weeks",
        "instructor": "Dr. Hannah Kim",
        "rating": 4.7,
        "enrolled": 1800,
        "image": "https://images.unsplash.com/photo-1520975682031-ae6f0b4c2b8f?w=800",
        "modules": [
            {"id": "m1", "title": "Foundations: Points, Lines, and Angles", "duration": "60 min", "completed": False},
            {"id": "m2", "title": "Triangles: Congruence and Similarity", "duration": "80 min", "completed": False},
            {"id": "m3", "title": "Quadrilaterals and Polygons", "duration": "75 min", "completed": False},
            {"id": "m4", "title": "Circles, Area, and Volume", "duration": "90 min", "completed": False}
        ],
        "tags": ["Mathematics", "Geometry", "Triangles", "Circles"]
    },
    {
        "id": "algebra-2-trig",
        "title": "Algebra 2 / Trigonometry",
        "description": "Advanced algebra including quadratics, exponentials, logarithms, complex numbers, sequences, and trigonometric functions.",
        "difficulty": "Intermediate",
        "duration": "10 weeks",
        "instructor": "Prof. David Nguyen",
        "rating": 4.8,
        "enrolled": 1600,
        "image": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800",
        "modules": [
            {"id": "m1", "title": "Quadratics, Complex Numbers", "duration": "80 min", "completed": False},
            {"id": "m2", "title": "Exponential and Logarithmic Functions", "duration": "85 min", "completed": False},
            {"id": "m3", "title": "Sequences and Series", "duration": "70 min", "completed": False},
            {"id": "m4", "title": "Trigonometric Functions and Identities", "duration": "95 min", "completed": False}
        ],
        "tags": ["Mathematics", "Algebra", "Trigonometry", "Logarithms"]
    },
    {
        "id": "precalculus",
        "title": "Pre-Calculus",
        "description": "Preparation for calculus: functions, polynomial/rational functions, trigonometry, analytic geometry, and limits introduction.",
        "difficulty": "Intermediate",
        "duration": "10 weeks",
        "instructor": "Dr. Laura Patel",
        "rating": 4.7,
        "enrolled": 1400,
        "image": "https://images.unsplash.com/photo-1528460033278-a6ba57020470?w=800",
        "modules": [
            {"id": "m1", "title": "Functions and Transformations", "duration": "75 min", "completed": False},
            {"id": "m2", "title": "Polynomial and Rational Functions", "duration": "85 min", "completed": False},
            {"id": "m3", "title": "Trigonometric Functions and Graphs", "duration": "90 min", "completed": False},
            {"id": "m4", "title": "Limits and Continuity (Intro)", "duration": "70 min", "completed": False}
        ],
        "tags": ["Mathematics", "Pre-Calculus", "Functions", "Limits"]
    },
    {
        "id": "calculus-ab",
        "title": "Calculus AB",
        "description": "AP-style single-variable differential and integral calculus: limits, derivatives, applications, and basic integration.",
        "difficulty": "Advanced",
        "duration": "12 weeks",
        "instructor": "Prof. Alan Rivers",
        "rating": 4.9,
        "enrolled": 2000,
        "image": "https://images.unsplash.com/photo-1523246198781-5eab3b8f3b8b?w=800",
        "modules": [
            {"id": "m1", "title": "Limits and Continuity", "duration": "80 min", "completed": False},
            {"id": "m2", "title": "Derivatives and Rules", "duration": "100 min", "completed": False},
            {"id": "m3", "title": "Applications of Derivatives", "duration": "95 min", "completed": False},
            {"id": "m4", "title": "Definite Integrals and FTC", "duration": "100 min", "completed": False}
        ],
        "tags": ["Mathematics", "Calculus", "Derivatives", "Integrals"]
    },
    {
        "id": "calculus-bc",
        "title": "Calculus BC",
        "description": "Continuation of single-variable calculus: advanced integration, infinite series, parametric, polar, and vector functions.",
        "difficulty": "Advanced",
        "duration": "12 weeks",
        "instructor": "Dr. Sophia Li",
        "rating": 4.9,
        "enrolled": 1500,
        "image": "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=800",
        "modules": [
            {"id": "m1", "title": "Techniques of Integration", "duration": "95 min", "completed": False},
            {"id": "m2", "title": "Sequences and Series (Taylor/Maclaurin)", "duration": "110 min", "completed": False},
            {"id": "m3", "title": "Parametric and Polar Functions", "duration": "85 min", "completed": False},
            {"id": "m4", "title": "Vector-Valued Motion", "duration": "75 min", "completed": False}
        ],
        "tags": ["Mathematics", "Calculus", "Series", "Integration"]
    },
    {
        "id": "statistics",
        "title": "Statistics",
        "description": "Descriptive statistics, probability, random variables, sampling distributions, confidence intervals, and hypothesis testing.",
        "difficulty": "Intermediate",
        "duration": "8 weeks",
        "instructor": "Prof. Maria Gomez",
        "rating": 4.7,
        "enrolled": 1700,
        "image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
        "modules": [
            {"id": "m1", "title": "Data, Graphs, and Summaries", "duration": "70 min", "completed": False},
            {"id": "m2", "title": "Probability and Random Variables", "duration": "85 min", "completed": False},
            {"id": "m3", "title": "Sampling and Confidence Intervals", "duration": "90 min", "completed": False},
            {"id": "m4", "title": "Hypothesis Testing and Inference", "duration": "100 min", "completed": False}
        ],
        "tags": ["Mathematics", "Statistics", "Probability", "Inference"]
    },
    {
        "id": "number-theory",
        "title": "Number Theory",
        "description": "Divisibility, primes, congruences, modular arithmetic, Diophantine equations, and arithmetic functions.",
        "difficulty": "Advanced",
        "duration": "8 weeks",
        "instructor": "Dr. Nathan Brooks",
        "rating": 4.8,
        "enrolled": 900,
        "image": "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800",
        "modules": [
            {"id": "m1", "title": "Integers, Divisibility, and Primes", "duration": "70 min", "completed": False},
            {"id": "m2", "title": "Congruences and Modular Arithmetic", "duration": "85 min", "completed": False},
            {"id": "m3", "title": "Quadratic Residues and Euler's Criterion", "duration": "90 min", "completed": False},
            {"id": "m4", "title": "Diophantine Equations", "duration": "80 min", "completed": False}
        ],
        "tags": ["Mathematics", "Number Theory", "Modular Arithmetic", "Primes"]
    },
    {
        "id": "discrete-math",
        "title": "Discrete Mathematics",
        "description": "Logic, sets, functions, combinatorics, graphs, relations, and proof techniques for computer science and mathematics.",
        "difficulty": "Intermediate",
        "duration": "9 weeks",
        "instructor": "Prof. Olivia Reed",
        "rating": 4.7,
        "enrolled": 1300,
        "image": "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800",
        "modules": [
            {"id": "m1", "title": "Logic and Proofs", "duration": "80 min", "completed": False},
            {"id": "m2", "title": "Sets, Functions, and Relations", "duration": "75 min", "completed": False},
            {"id": "m3", "title": "Counting and Combinatorics", "duration": "90 min", "completed": False},
            {"id": "m4", "title": "Graphs and Trees", "duration": "85 min", "completed": False}
        ],
        "tags": ["Mathematics", "Discrete Math", "Logic", "Graphs"]
    },
    {
        "id": "linear-algebra",
        "title": "Linear Algebra",
        "description": "Vectors, matrices, linear transformations, Gaussian elimination, eigenvalues, eigenvectors, and applications.",
        "difficulty": "Advanced",
        "duration": "10 weeks",
        "instructor": "Dr. Samuel Green",
        "rating": 4.9,
        "enrolled": 1900,
        "image": "https://images.unsplash.com/photo-1470081766425-a75c92adff0b?w=800",
        "modules": [
            {"id": "m1", "title": "Vectors and Matrix Algebra", "duration": "90 min", "completed": False},
            {"id": "m2", "title": "Solving Linear Systems and LU Factorization", "duration": "95 min", "completed": False},
            {"id": "m3", "title": "Vector Spaces and Bases", "duration": "85 min", "completed": False},
            {"id": "m4", "title": "Eigenvalues, Eigenvectors, and Diagonalization", "duration": "100 min", "completed": False}
        ],
        "tags": ["Mathematics", "Linear Algebra", "Matrices", "Eigenvalues"]
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
