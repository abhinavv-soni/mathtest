
from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent

load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', "mongodb://localhost:55335")
client = AsyncIOMotorClient(mongo_url)
db = client.math_game_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Score(BaseModel):
    score: int
    timestamp: str

@app.get("/")
async def root():
    return {"message": "Math Game API"}

@app.post("/scores")
async def add_score(score: Score):
    await db.scores.insert_one(score.dict())
    return {"message": "Score added successfully"}

@app.get("/scores")
async def get_scores():
    cursor = db.scores.find().sort("score", -1).limit(5)
    scores = await cursor.to_list(length=5)
    return {"scores": [score["score"] for score in scores]}

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=55261)
