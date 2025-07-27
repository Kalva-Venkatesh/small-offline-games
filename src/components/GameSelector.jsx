import React from 'react';
import './GameSelector.css';

const GameSelector = ({ games, onSelect }) => {
  return (
    <div className="game-selector">
      <h2>Select a Game</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div 
            key={game.id}
            className="game-card"
            onClick={() => onSelect(game.id)}
            style={{ backgroundColor: game.color }}
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-name">{game.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;