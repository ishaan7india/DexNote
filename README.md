# DexNote
An interactive learning platform with courses, AI tools, and progress tracking.

## Features
- **User Authentication**: Secure signup and login with JWT tokens
- **Course Management**: Browse and enroll in coding and AI courses
- **Progress Tracking**: Track your learning journey with module completion
- **Streak System**: Daily login streaks to maintain motivation
- **AI Tools Integration**: Access to various AI-powered learning tools
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- FastAPI (Python web framework)
- MongoDB (Database)
- JWT Authentication
- Motor (Async MongoDB driver)

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

## Quick Start Guide

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB (local or cloud)
- Git

### Environment Setup

Both the frontend and backend require environment variables to function properly. We've provided example files to help you get started:

#### Backend Environment Variables
1. Navigate to the `backend/` directory
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and update the following variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `DB_NAME`: Your database name (default: `dexnote_db`)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `CORS_ORIGINS`: Allowed origins for CORS (include your frontend URL)

#### Frontend Environment Variables
1. Navigate to the `frontend/` directory
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and update:
   - `REACT_APP_BACKEND_URL`: URL where your backend API is running

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file as described above
5. Start the development server:
   ```bash
   uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file as described above
4. Start the development server:
   ```bash
   npm start
   ```

### Login Flow Setup

#### For Local Development:
1. Ensure MongoDB is running (local or cloud)
2. Start the backend server first (it will create the database collections automatically)
3. Start the frontend server
4. Navigate to `http://localhost:3000` in your browser
5. Create a new account or use the login feature

#### Authentication Flow:
- **Sign Up**: Users can create new accounts with username/email and password
- **Login**: Users authenticate with their credentials and receive a JWT token
- **Protected Routes**: The frontend automatically includes the JWT token in API requests
- **Token Storage**: JWT tokens are stored in localStorage for persistence
- **Logout**: Tokens are cleared from localStorage on logout

## Deployment Guide

### Prerequisites
- GitHub account
- Render account (for backend)
- MongoDB Atlas account (recommended for production)

### Backend Deployment on Render

#### Step 1: Prepare MongoDB
1. Set up MongoDB Atlas or ensure your MongoDB instance is accessible
2. Get your connection string (should look like `mongodb+srv://...`)
3. Create a database named `dexnote_db` (or update `DB_NAME` in your environment)

#### Step 2: Deploy to Render
1. Fork this repository to your GitHub account
2. Go to [Render](https://render.com) and sign in
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Choose the repository: `your-username/DexNote`
6. Configure the service:
   - **Name**: `dexnote-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

#### Step 3: Configure Environment Variables
In your Render service settings, add these environment variables:

| Variable | Description | Example |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | Database name | `dexnote_db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secure-random-secret-key` |
| `CORS_ORIGINS` | Allowed origins for CORS | `https://yourusername.github.io,http://localhost:3000` |
| `PORT` | Port number | `10000` (default for Render) |

#### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your backend URL (e.g., `https://dexnote-backend.onrender.com`)

### Frontend Deployment on GitHub Pages

#### Step 1: Configure Backend URL
1. In your forked repository, go to `frontend/.env`
2. Update `REACT_APP_BACKEND_URL` with your Render backend URL:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-name.onrender.com
   ```
3. Commit and push this change

#### Step 2: Update GitHub Pages Settings
1. Go to your repository settings
2. Scroll to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The workflow file in `.github/workflows/` will automatically deploy your frontend

#### Step 3: Build and Deploy
1. The GitHub Action will automatically trigger on push to `main`
2. Monitor the "Actions" tab for deployment progress
3. Once complete, your site will be available at `https://yourusername.github.io/DexNote`

#### Step 4: Verify Deployment
1. Visit your GitHub Pages URL
2. Test the login/signup functionality
3. Verify that the frontend can communicate with your backend

### Troubleshooting

#### CORS Errors
- Ensure your frontend URL is included in the `CORS_ORIGINS` environment variable on Render
- Check that the backend URL in your frontend `.env` matches your Render deployment

#### Backend Connection Issues
- Verify your `REACT_APP_BACKEND_URL` is correct and includes `https://`
- Check Render logs for backend errors
- Ensure environment variables are properly set on Render

#### MongoDB Connection Issues
- Verify your `MONGO_URI` is correct
- Ensure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` or Render's IP ranges
- Check that your database user has read/write permissions

#### Build Failures
- Check the GitHub Actions logs for specific error messages
- Ensure all dependencies are properly listed in `package.json`
- Verify that your `.env` file has the correct backend URL

## Project Structure
```
DexNote/
├── backend/
│   ├── .env.example      # Example backend environment variables
│   ├── server.py         # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   ├── seed_data.py      # Database seeding script
│   └── start.sh          # Startup script
├── frontend/
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── App.js        # Main React component
│   │   ├── pages/        # Page components
│   │   └── components/   # Reusable components
│   ├── .env.example      # Example frontend environment variables
│   └── package.json      # Node dependencies
└── render.yaml           # Render deployment configuration
```

### Environment Variables Reference

#### Backend (.env.example)
Refer to `backend/.env.example` for the complete list with descriptions:
- `MONGO_URI`: MongoDB connection string
- `DB_NAME`: Database name
- `JWT_SECRET`: JWT token secret key
- `CORS_ORIGINS`: Comma-separated list of allowed origins

#### Frontend (.env.example)
Refer to `frontend/.env.example` for the complete list with descriptions:
- `REACT_APP_BACKEND_URL`: Backend API URL

### Additional Notes
- **Free Tier Limitations**: Render's free tier spins down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.
- **Database Seeding**: Run `python backend/seed_data.py` to populate your database with sample courses.
- **Security**: Always use strong, unique values for `JWT_SECRET` in production.
- **HTTPS**: Render automatically provides HTTPS. Ensure your frontend uses `https://` for the backend URL.

## Contributing
Feel free to submit issues and pull requests to improve the project.

## License
This project is open source and available under the MIT License.
