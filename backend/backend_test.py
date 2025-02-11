import requests
import pytest
from datetime import datetime

BASE_URL = "http://localhost:55261"

def test_root_endpoint():
    """Test the root endpoint"""
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    assert response.json() == {"message": "Math Game API"}
    print("✅ Root endpoint test passed")

def test_add_score():
    """Test adding a new score"""
    score_data = {
        "score": 100,
        "timestamp": datetime.now().isoformat()
    }
    response = requests.post(f"{BASE_URL}/scores", json=score_data)
    assert response.status_code == 200
    assert response.json() == {"message": "Score added successfully"}
    print("✅ Add score test passed")

def test_get_scores():
    """Test retrieving high scores"""
    response = requests.get(f"{BASE_URL}/scores")
    assert response.status_code == 200
    scores = response.json().get("scores", [])
    assert isinstance(scores, list)
    # Should return at most 5 scores
    assert len(scores) <= 5
    # Scores should be in descending order
    if len(scores) > 1:
        assert all(scores[i] >= scores[i+1] for i in range(len(scores)-1))
    print("✅ Get scores test passed")

def test_multiple_scores():
    """Test adding multiple scores and verifying order"""
    # Add multiple scores
    test_scores = [
        {"score": 50, "timestamp": datetime.now().isoformat()},
        {"score": 75, "timestamp": datetime.now().isoformat()},
        {"score": 100, "timestamp": datetime.now().isoformat()},
        {"score": 25, "timestamp": datetime.now().isoformat()},
        {"score": 90, "timestamp": datetime.now().isoformat()},
        {"score": 85, "timestamp": datetime.now().isoformat()}
    ]
    
    for score in test_scores:
        response = requests.post(f"{BASE_URL}/scores", json=score)
        assert response.status_code == 200
    
    # Get scores and verify
    response = requests.get(f"{BASE_URL}/scores")
    assert response.status_code == 200
    scores = response.json().get("scores", [])
    
    # Should only return top 5 scores
    assert len(scores) <= 5
    # Should be in descending order
    assert all(scores[i] >= scores[i+1] for i in range(len(scores)-1))
    # Top score should be 100
    assert scores[0] == 100
    print("✅ Multiple scores test passed")

if __name__ == "__main__":
    print("\n🔵 Starting backend API tests...")
    try:
        test_root_endpoint()
        test_add_score()
        test_get_scores()
        test_multiple_scores()
        print("\n✅ All backend tests passed successfully!")
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")