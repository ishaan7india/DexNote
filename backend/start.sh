#!/bin/bash
# Start the FastAPI backend with uvicorn
cd "$(dirname "$0")"
uvicorn server:app --host 0.0.0.0 --port ${PORT:-10000}
