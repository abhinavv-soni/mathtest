import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Brain, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
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

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('highScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

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

  // Update high scores
  const updateHighScores = (finalScore) => {
    const newHighScores = [...highScores, finalScore]
      .sort((a, b) => b - a)
      .slice(0, 5);
    setHighScores(newHighScores);
    localStorage.setItem('highScores', JSON.stringify(newHighScores));
  };

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
      updateHighScores(score);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary-400/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-8">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-display font-bold text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8"
            >
              Math Skills Challenge
            </motion.h1>
            
            <AnimatePresence mode="wait">
              {!gameActive && !gameOver && (
                <motion.div 
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="flex justify-center mb-8">
                    <Brain className="w-16 h-16 text-primary-500" />
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Challenge your math skills! Solve as many problems as you can in 60 seconds.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all flex items-center justify-center space-x-2 mx-auto"
                  >
                    <span>Start Challenge</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {gameActive && (
                <motion.div 
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-6 h-6 text-primary-500" />
                      <span className="text-xl font-semibold text-primary-700">{timeLeft}s</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-6 h-6 text-secondary-500" />
                      <span className="text-xl font-semibold text-secondary-700">{score}</span>
                    </div>
                  </div>

                  <motion.div 
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-inner mb-8"
                    animate={{ scale: [0.95, 1], opacity: [0, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-3xl text-center font-bold mb-6 text-gray-800">{currentQuestion?.question}</p>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="flex-1 p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Your answer..."
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all"
                      >
                        Submit
                      </motion.button>
                    </form>
                    <AnimatePresence>
                      {feedback.show && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className={`mt-4 p-4 rounded-xl flex items-center justify-center space-x-2 ${
                            feedback.correct 
                              ? 'bg-accent-100 text-accent-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {feedback.correct ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          <span className="font-medium">
                            {feedback.correct ? 'Correct!' : 'Try again!'}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              {gameOver && (
                <motion.div 
                  key="gameover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-6"
                >
                  <Trophy className="w-16 h-16 text-secondary-500 mx-auto" />
                  <h2 className="text-3xl font-bold text-gray-800">Challenge Complete!</h2>
                  <p className="text-2xl font-semibold text-primary-600">Final Score: {score}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-accent-500/30 hover:shadow-accent-500/40 transition-all inline-flex items-center space-x-2"
                  >
                    <span>Try Again</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="w-6 h-6 text-secondary-500" />
                <h2 className="text-2xl font-bold text-gray-800">High Scores</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                {highScores.length > 0 ? (
                  <ol className="space-y-3">
                    {highScores.map((score, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm"
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-lg font-medium text-gray-700">{score} points</span>
                      </motion.li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500 text-center py-4">No high scores yet. Be the first!</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;