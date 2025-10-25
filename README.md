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

## Deployment Guide

### Prerequisites

1. GitHub account
2. MongoDB Atlas account (free tier available)
3. Render account (for backend deployment)
4. GitHub Pages enabled on your repository (for frontend deployment)

### Backend Deployment on Render

#### Step 1: Prepare MongoDB

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your MongoDB connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### Step 2: Deploy to Render

1. Go to https://render.com and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration file
5. Or manually configure:
   - **Name**: dexnote-backend
   - **Environment**: Python
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `bash backend/start.sh`
   - **Branch**: main

#### Step 3: Configure Environment Variables

In your Render dashboard, add the following environment variables:

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dexnote
DB_NAME=dexnote
JWT_SECRET_KEY=your-secure-secret-key-here
CORS_ORIGINS=http://localhost:3000,https://yourusername.github.io
PORT=10000
```

**Important Notes:**
- Replace `MONGO_URL` with your actual MongoDB connection string
- Replace `yourusername` in `CORS_ORIGINS` with your actual GitHub username
- Generate a strong, unique `JWT_SECRET_KEY` (you can use: `openssl rand -hex 32`)
- The `CORS_ORIGINS` value should include your GitHub Pages URL where the frontend is deployed

#### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://dexnote-backend.onrender.com`
4. Save this URL - you'll need it for frontend configuration

### Frontend Deployment on GitHub Pages

#### Step 1: Configure Backend URL

1. Create a `.env` file in the `frontend` directory (use `.env.example` as template):

```bash
REACT_APP_BACKEND_URL=https://your-render-backend-url.onrender.com
```

2. Replace `your-render-backend-url` with the actual Render URL from Step 4 above

#### Step 2: Update GitHub Pages Settings

1. Go to your GitHub repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch you want to deploy (usually `main`)
4. Select the folder: `/ (root)` or `/docs` depending on your setup
5. Click "Save"

#### Step 3: Build and Deploy

1. The frontend should already be configured to deploy via GitHub Actions or manual build
2. If using GitHub Actions, push your changes to trigger automatic deployment
3. If deploying manually:

```bash
cd frontend
npm install
npm run build
# The build folder contents should be in the gh-pages branch or root
```

#### Step 4: Verify Deployment

1. Wait for deployment to complete (usually 1-2 minutes)
2. Your site will be available at: `https://yourusername.github.io/DexNote/`
3. Test the login/signup functionality to ensure backend connectivity

### Troubleshooting

#### CORS Errors

If you see CORS errors in the browser console:
1. Verify that your GitHub Pages URL is included in the `CORS_ORIGINS` environment variable on Render
2. Make sure there are no trailing slashes in the URLs
3. Check that the backend is running and accessible

#### Backend Connection Issues

1. Verify the `REACT_APP_BACKEND_URL` in your frontend `.env` file is correct
2. Check that the Render service is running (green status in Render dashboard)
3. Review the logs in Render dashboard for any errors

#### MongoDB Connection Issues

1. Verify your MongoDB connection string is correct
2. Ensure your MongoDB user has the correct permissions
3. Check that IP address 0.0.0.0/0 is whitelisted in MongoDB Atlas
4. Review the logs in Render dashboard for specific error messages

#### Build Failures

1. Check that all environment variables are set correctly in Render
2. Verify that `requirements.txt` includes all necessary dependencies
3. Review build logs in Render dashboard for specific errors

### Local Development

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create a .env file with:
# MONGO_URL=your-mongodb-url
# DB_NAME=dexnote
# JWT_SECRET_KEY=your-secret-key

uvicorn server:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install

# Create a .env file with:
# REACT_APP_BACKEND_URL=http://localhost:8000

npm start
```

The app will run on `http://localhost:3000`

### Project Structure

```
DexNote/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── start.sh          # Startup script for Render
│   └── seed_data.py      # Database seeding script
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── pages/        # Page components
│   │   └── components/   # Reusable components
│   ├── .env.example      # Example environment variables
│   └── package.json      # Node dependencies
└── render.yaml           # Render deployment configuration
```

### Environment Variables Reference

#### Backend (Render)

| Variable | Description | Required | Example |
|----------|-------------|----------|----------|
| MONGO_URL | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| DB_NAME | Database name | Yes | `dexnote` |
| JWT_SECRET_KEY | Secret key for JWT tokens | Yes | `your-random-secret-key` |
| CORS_ORIGINS | Allowed origins for CORS | Yes | `http://localhost:3000,https://yourusername.github.io` |
| PORT | Port number | No (default: 10000) | `10000` |

#### Frontend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|----------|
| REACT_APP_BACKEND_URL | Backend API URL | Yes | `https://dexnote-backend.onrender.com` |

### Additional Notes

- **Free Tier Limitations**: Render's free tier spins down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.
- **Database Seeding**: Run `python backend/seed_data.py` to populate your database with sample courses.
- **Security**: Always use strong, unique values for `JWT_SECRET_KEY` in production.
- **HTTPS**: Render automatically provides HTTPS. Ensure your frontend uses `https://` for the backend URL.

## Contributing

Feel free to submit issues and pull requests to improve the project.

## License

This project is open source and available under the MIT License.
