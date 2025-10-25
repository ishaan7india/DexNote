"""Seed database with sample courses and modules"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / 'backend' / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Clear existing data
    await db.courses.delete_many({})
    await db.modules.delete_many({})
    
    print("Seeding courses and modules...")
    
    courses = [
        {
            "id": "course-1",
            "title": "Python for Beginners",
            "description": "Learn Python programming from scratch. Master the fundamentals of Python including variables, data types, loops, functions, and object-oriented programming. Perfect for absolute beginners.",
            "category": "coding",
            "difficulty": "beginner",
            "duration": "6 weeks",
            "modules_count": 8,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-2",
            "title": "JavaScript Masterclass",
            "description": "Comprehensive JavaScript course covering ES6+, async programming, DOM manipulation, and modern web development practices. Build real-world projects and master JavaScript.",
            "category": "coding",
            "difficulty": "intermediate",
            "duration": "8 weeks",
            "modules_count": 10,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-3",
            "title": "React Development",
            "description": "Master React.js and build modern, interactive user interfaces. Learn hooks, context API, state management, routing, and best practices for building scalable React applications.",
            "category": "coding",
            "difficulty": "intermediate",
            "duration": "10 weeks",
            "modules_count": 12,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-4",
            "title": "Data Structures & Algorithms",
            "description": "Master essential data structures and algorithms. Learn arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming. Prepare for technical interviews.",
            "category": "coding",
            "difficulty": "advanced",
            "duration": "12 weeks",
            "modules_count": 15,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-5",
            "title": "Introduction to AI Tools",
            "description": "Discover the world of AI tools and how they're transforming workflows. Learn about ChatGPT, image generators, code assistants, and how to integrate AI into your daily work.",
            "category": "ai-tools",
            "difficulty": "beginner",
            "duration": "4 weeks",
            "modules_count": 6,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-6",
            "title": "Mastering ChatGPT",
            "description": "Learn advanced prompt engineering techniques, use cases, and best practices for getting the most out of ChatGPT in coding, writing, research, and creative projects.",
            "category": "ai-tools",
            "difficulty": "intermediate",
            "duration": "5 weeks",
            "modules_count": 7,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-7",
            "title": "AI Image Generation",
            "description": "Master AI image generation tools like DALL-E and Midjourney. Learn prompt crafting, style control, and how to create professional-quality images for your projects.",
            "category": "ai-tools",
            "difficulty": "beginner",
            "duration": "4 weeks",
            "modules_count": 5,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-8",
            "title": "Full Stack Web Development",
            "description": "Become a full-stack developer. Learn frontend (React), backend (Node.js), databases (MongoDB), APIs, authentication, deployment, and build complete web applications.",
            "category": "coding",
            "difficulty": "advanced",
            "duration": "16 weeks",
            "modules_count": 20,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-9",
            "title": "AI-Powered Coding",
            "description": "Learn how to leverage AI coding assistants like GitHub Copilot and ChatGPT to write better code faster. Understand best practices and limitations of AI in development.",
            "category": "ai-tools",
            "difficulty": "intermediate",
            "duration": "6 weeks",
            "modules_count": 8,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-10",
            "title": "Mathematics for Programming",
            "description": "Build a strong mathematical foundation for programming. Learn algebra, calculus, discrete mathematics, linear algebra, and probability theory essential for computer science.",
            "category": "mathematics",
            "difficulty": "intermediate",
            "duration": "10 weeks",
            "modules_count": 12,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-11",
            "title": "Statistics & Probability",
            "description": "Master statistical concepts and probability theory. Learn descriptive statistics, inferential statistics, hypothesis testing, and data analysis techniques for data science.",
            "category": "mathematics",
            "difficulty": "intermediate",
            "duration": "8 weeks",
            "modules_count": 10,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-12",
            "title": "Linear Algebra for Machine Learning",
            "description": "Understand the mathematical foundations of machine learning. Master vectors, matrices, eigenvalues, transformations, and their applications in AI and data science.",
            "category": "mathematics",
            "difficulty": "advanced",
            "duration": "6 weeks",
            "modules_count": 8,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-13",
            "title": "AI Generalist: Complete AI Tools Mastery",
            "description": "Become an AI power user with this comprehensive course. Master Emergent, Replit, WisprFlow, Suno, Gemini Gems, and many other cutting-edge AI tools. Learn to integrate multiple AI platforms into powerful workflows for coding, content creation, automation, and productivity.",
            "category": "ai-tools",
            "difficulty": "intermediate",
            "duration": "12 weeks",
            "modules_count": 15,
            "thumbnail": "",
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "course-14",
            "title": "Cybersecurity & Ethical Hacking",
            "description": "Learn cybersecurity fundamentals and ethical hacking techniques. Master network security, penetration testing, vulnerability assessment, and defensive security practices. This course is for educational purposes only and requires agreement to use knowledge ethically and legally.",
            "category": "coding",
            "difficulty": "advanced",
            "duration": "14 weeks",
            "modules_count": 18,
            "thumbnail": "",
            "requires_terms": True,
            "created_at": "2025-01-01T00:00:00Z"
        }
    ]
    
    await db.courses.insert_many(courses)
    print(f"✓ Inserted {len(courses)} courses")
    
    # Sample modules for Python course
    python_modules = [
        {
            "id": "module-1-1",
            "course_id": "course-1",
            "title": "Introduction to Python",
            "content": "Welcome to Python programming! In this module, you'll learn:\n\n• What is Python and why it's popular\n• Setting up your development environment\n• Installing Python and your first IDE\n• Running your first Python program\n• Understanding Python syntax basics\n\nPython is one of the most beginner-friendly programming languages, used in web development, data science, AI, automation, and more.",
            "order": 1,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-2",
            "course_id": "course-1",
            "title": "Variables and Data Types",
            "content": "Learn about storing and manipulating data in Python:\n\n• Variables and naming conventions\n• Basic data types: int, float, string, boolean\n• Type conversion and casting\n• Input and output operations\n• String operations and formatting\n\nPractice exercises:\n- Create variables of different types\n- Perform arithmetic operations\n- Get user input and display output\n- Work with strings and numbers",
            "order": 2,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-3",
            "course_id": "course-1",
            "title": "Control Flow - If Statements",
            "content": "Master decision-making in your programs:\n\n• If, elif, and else statements\n• Comparison operators (==, !=, <, >, <=, >=)\n• Logical operators (and, or, not)\n• Nested conditionals\n• Practical examples and use cases\n\nYou'll build programs that make decisions based on conditions, a fundamental skill in programming.",
            "order": 3,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-4",
            "course_id": "course-1",
            "title": "Loops and Iteration",
            "content": "Learn to repeat actions efficiently:\n\n• For loops and range() function\n• While loops\n• Break and continue statements\n• Nested loops\n• Loop patterns and common use cases\n\nProjects:\n- Build a multiplication table generator\n- Create pattern printing programs\n- Process lists of data",
            "order": 4,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-5",
            "course_id": "course-1",
            "title": "Lists and Tuples",
            "content": "Work with collections of data:\n\n• Creating and accessing lists\n• List methods (append, remove, sort, etc.)\n• List slicing and indexing\n• Tuples and their immutability\n• When to use lists vs tuples\n\nPractical exercises with real-world data manipulation scenarios.",
            "order": 5,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-6",
            "course_id": "course-1",
            "title": "Dictionaries and Sets",
            "content": "Master key-value data structures:\n\n• Creating and using dictionaries\n• Dictionary methods and operations\n• Nested dictionaries\n• Sets and set operations\n• Choosing the right data structure\n\nBuild a simple contact management system using dictionaries.",
            "order": 6,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-7",
            "course_id": "course-1",
            "title": "Functions",
            "content": "Write reusable and organized code:\n\n• Defining functions with def\n• Parameters and arguments\n• Return values\n• Scope and lifetime of variables\n• Lambda functions\n• Function documentation\n\nCreate a library of utility functions for your programs.",
            "order": 7,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-1-8",
            "course_id": "course-1",
            "title": "Final Project",
            "content": "Put everything together in a capstone project:\n\n• Project: Build a Student Grade Management System\n• Use variables, functions, loops, and dictionaries\n• Implement CRUD operations (Create, Read, Update, Delete)\n• Handle user input and validation\n• Display formatted output\n\nThis project demonstrates your Python fundamentals mastery!",
            "order": 8,
            "created_at": "2025-01-01T00:00:00Z"
        }
    ]
    
    # Sample modules for AI Tools Introduction
    ai_modules = [
        {
            "id": "module-5-1",
            "course_id": "course-5",
            "title": "What are AI Tools?",
            "content": "Introduction to the AI revolution:\n\n• Understanding artificial intelligence basics\n• Types of AI tools available today\n• How AI is transforming different industries\n• Ethical considerations and limitations\n• Overview of popular AI platforms\n\nDiscover how AI can enhance your productivity and creativity.",
            "order": 1,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-5-2",
            "course_id": "course-5",
            "title": "ChatGPT Basics",
            "content": "Get started with conversational AI:\n\n• Creating an OpenAI account\n• Understanding how ChatGPT works\n• Basic prompting techniques\n• Use cases: writing, coding, research\n• Tips for better responses\n\nPractical exercises to get comfortable with AI chat interfaces.",
            "order": 2,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-5-3",
            "course_id": "course-5",
            "title": "AI Image Generation",
            "content": "Create stunning visuals with AI:\n\n• Introduction to DALL-E and Midjourney\n• Writing effective image prompts\n• Understanding styles and parameters\n• Use cases for AI-generated images\n• Copyright and usage considerations\n\nGenerate your first AI images!",
            "order": 3,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-5-4",
            "course_id": "course-5",
            "title": "AI Coding Assistants",
            "content": "Code faster with AI help:\n\n• GitHub Copilot overview\n• Setting up AI coding assistants\n• Writing code comments for better suggestions\n• Reviewing and validating AI-generated code\n• Best practices and limitations\n\nBoost your coding productivity with AI.",
            "order": 4,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-5-5",
            "course_id": "course-5",
            "title": "Content Creation with AI",
            "content": "Enhance your content workflow:\n\n• AI writing assistants (Jasper, Copy.ai)\n• Generating blog posts and articles\n• Social media content creation\n• Video script writing\n• Maintaining your unique voice\n\nCreate high-quality content efficiently with AI tools.",
            "order": 5,
            "created_at": "2025-01-01T00:00:00Z"
        },
        {
            "id": "module-5-6",
            "course_id": "course-5",
            "title": "Building Your AI Workflow",
            "content": "Integrate AI into your daily work:\n\n• Identifying tasks that benefit from AI\n• Creating an AI tool stack\n• Combining multiple AI tools\n• Measuring productivity improvements\n• Staying updated with new AI tools\n\nDesign a personalized AI-powered workflow for your needs.",
            "order": 6,
            "created_at": "2025-01-01T00:00:00Z"
        }
    ]
    
    all_modules = python_modules + ai_modules
    await db.modules.insert_many(all_modules)
    print(f"✓ Inserted {len(all_modules)} modules")
    
    print("\n✅ Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
