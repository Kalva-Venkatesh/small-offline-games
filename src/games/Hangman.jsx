import React, { useState, useEffect, useCallback } from 'react';
import './Hangman.css';

const WORDS = ['REACT', 'JAVASCRIPT', 'DEVELOPER', 'PROGRAMMING', 'HANGMAN'];
const MAX_WRONG = 6;

const Hangman = () => {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing/won/lost
  const [usedLetters, setUsedLetters] = useState([]);

  const getRandomWord = useCallback(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, []);

  const resetGame = useCallback(() => {
    setWord(getRandomWord());
    setGuessed([]);
    setWrong(0);
    setGameStatus('playing');
    setUsedLetters([]);
  }, [getRandomWord]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const guessedWord = useCallback(() => {
    return word.split('').map(letter => (guessed.includes(letter) ? letter : '_'));
  }, [word, guessed]);

  const handleGuess = useCallback((letter) => {
    if (gameStatus !== 'playing' || usedLetters.includes(letter)) return;

    setUsedLetters(prev => [...prev, letter]);
    
    if (word.includes(letter)) {
      setGuessed(prev => [...prev, letter]);
      if (word.split('').every(l => [...guessed, letter].includes(l))) {
        setGameStatus('won');
      }
    } else {
      setWrong(prev => {
        const newWrong = prev + 1;
        if (newWrong >= MAX_WRONG) setGameStatus('lost');
        return newWrong;
      });
    }
  }, [word, guessed, gameStatus, usedLetters]);

  const handleKeyPress = useCallback((e) => {
    if (/^[a-z]$/i.test(e.key)) {
      handleGuess(e.key.toUpperCase());
    }
  }, [handleGuess]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="hangman">
      <h2>Hangman</h2>
      
      <div className="game-status">
        {gameStatus === 'won' && <div className="win-message">You Won! 🎉</div>}
        {gameStatus === 'lost' && (
          <div className="lose-message">Game Over! The word was: {word}</div>
        )}
      </div>
      
      <div className="hangman-display">
        <div className={`hangman-figure wrong-${wrong}`}>
          {/* Hangman parts rendered via CSS */}
        </div>
        <div className="word-display">{guessedWord().join(' ')}</div>
      </div>
      
      <div className="alphabet">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={usedLetters.includes(letter) || gameStatus !== 'playing'}
            className={`letter-btn 
              ${usedLetters.includes(letter) ? 'used' : ''}
              ${usedLetters.includes(letter) && !word.includes(letter) ? 'wrong' : ''}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <button onClick={resetGame} className="reset-btn">
        New Game
      </button>
    </div>
  );
};

export default Hangman;