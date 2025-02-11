
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameActive, setGameActive] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, correct: false });

  // Generate a random arithmetic question
  const generateQuestion = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;
    
    switch(operation) {
      case '+':
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 100);
        break;
      case '-':
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * num1); // Ensure positive result
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12);
        num2 = Math.floor(Math.random() * 12);
        break;
      default:
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 100);
    }

    return {
      question: `${num1} ${operation} ${num2}`,
      answer: eval(`${num1} ${operation} ${num2}`)
    };
  };

  // Start new game
  const startGame = () => {
    setTimeLeft(60);
    setScore(0);
    setGameActive(true);
    setGameOver(false);
    setCurrentQuestion(generateQuestion());
  };

  // Fetch high scores
  const fetchHighScores = async () => {
    try {
      const response = await fetch('http://localhost:55261/scores');
      const data = await response.json();
      setHighScores(data.scores);
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  };

  // Save score to backend
  const saveScore = async (finalScore) => {
    try {
      await fetch('http://localhost:55261/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: finalScore,
          timestamp: new Date().toISOString(),
        }),
      });
      fetchHighScores();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Handle answer submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameActive) return;

    const userNum = Number(userAnswer);
    const isCorrect = userNum === currentQuestion.answer;
    
    setFeedback({ show: true, correct: isCorrect });
    setTimeout(() => setFeedback({ show: false, correct: false }), 1000);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
  };

  // Timer effect
  // Load high scores on mount
  useEffect(() => {
    fetchHighScores();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
      saveScore(score);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Math Skills Test</h1>
          
          {!gameActive && !gameOver && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">Test your math skills! You have 60 seconds to solve as many problems as you can.</p>
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {gameActive && (
            <div>
              <div className="flex justify-between mb-6">
                <div className="text-lg font-semibold">Time: {timeLeft}s</div>
                <div className="text-lg font-semibold">Score: {score}</div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <p className="text-2xl text-center font-bold mb-4">{currentQuestion?.question}</p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Enter your answer"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Submit
                  </button>
                </form>
                {feedback.show && (
                  <div className={`mt-4 p-2 text-center rounded ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.correct ? 'Correct!' : 'Wrong answer, try again!'}
                  </div>
                )}
              </div>
            </div>
          )}

          {gameOver && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-6">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">High Scores</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              {highScores.length > 0 ? (
                <ol className="list-decimal list-inside">
                  {highScores.map((score, index) => (
                    <li key={index} className="text-lg mb-2">
                      {score} points
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-600 text-center">No high scores yet!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
