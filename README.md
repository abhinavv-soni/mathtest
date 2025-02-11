# Math Skills Testing App

A React-based math skills testing application that challenges users to solve arithmetic problems within a 60-second time limit.

## Features

- 60-second timed math challenge
- Random arithmetic question generation
- Real-time score tracking
- High scores leaderboard
- Visual feedback for answers
- Modern, animated UI

## Tech Stack

- Frontend: React, Tailwind CSS, Framer Motion
- Backend: FastAPI, MongoDB
- Testing: Playwright, pytest

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   pip install -r requirements.txt
   ```
3. Start the services:
   ```bash
   # Frontend
   npm start

   # Backend
   python server.py
   ```

## Architecture

- Frontend runs on port 55124
- Backend API runs on port 55261
- MongoDB runs on port 55335

## Testing

Run the tests using:
```bash
python -m pytest
```