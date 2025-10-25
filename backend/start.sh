#!/bin/bash

# Start the FastAPI backend with uvicorn
cd backend
uvicorn server:app --host 0.0.0.0 --port ${PORT:-10000}
