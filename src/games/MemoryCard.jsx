import React, { useState, useEffect } from 'react';
import './MemoryCard.css';

const MemoryCard = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cardPairs = [...symbols, ...symbols];
    const shuffledCards = shuffleArray(cardPairs).map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      solved: false
    }));
    
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
    setDisabled(false);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (id) => {
    if (disabled || solved.includes(id) || flipped.includes(id) || flipped.length === 2) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setDisabled(true);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (flippedCards) => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(card => card.id === firstId);
    const secondCard = cards.find(card => card.id === secondId);

    if (firstCard.symbol === secondCard.symbol) {
      setSolved([...solved, ...flippedCards]);
      setFlipped([]);
      setDisabled(false);
      
      if (solved.length + 2 === cards.length) {
        setGameComplete(true);
      }
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="memory-card">
      <h2>Memory Card Game</h2>
      <div className="game-info">
        <p>Moves: {moves}</p>
        <button onClick={initializeGame} className="reset-button">
          Reset Game
        </button>
      </div>
      
      {gameComplete ? (
        <div className="game-complete">
          <h3>Congratulations!</h3>
          <p>You completed the game in {moves} moves!</p>
          <button onClick={initializeGame} className="play-again-button">
            Play Again
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-inner">
                <div className="card-front">{card.symbol}</div>
                <div className="card-back">?</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryCard;