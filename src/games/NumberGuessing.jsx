import React, { useState, useEffect } from 'react';
import './NumberGuessing.css';

const NumberGuessing = () => {
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
    setAttempts(0);
    setGameStarted(true);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    const numGuess = parseInt(guess, 10);
    
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100');
      return;
    }
    
    setAttempts(attempts + 1);
    
    if (numGuess === targetNumber) {
      setMessage(`Congratulations! You guessed the number in ${attempts + 1} attempts.`);
      setGameStarted(false);
    } else if (numGuess < targetNumber) {
      setMessage('Too low! Try a higher number.');
    } else {
      setMessage('Too high! Try a lower number.');
    }
    
    setGuess('');
  };

  return (
    <div className="number-guessing">
      <h2>Number Guessing Game</h2>
      <p>Guess a number between 1 and 100</p>
      
      {!gameStarted && attempts > 0 ? (
        <div className="game-over">
          <p>{message}</p>
          <button onClick={startNewGame} className="play-again-button">
            Play Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleGuess} className="guess-form">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            min="1"
            max="100"
            className="guess-input"
          />
          <button type="submit" className="submit-button">
            Submit Guess
          </button>
        </form>
      )}
      
      {message && <p className="message">{message}</p>}
      <p className="attempts">Attempts: {attempts}</p>
    </div>
  );
};

export default NumberGuessing;