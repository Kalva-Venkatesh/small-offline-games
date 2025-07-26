import React from 'react';
import Button from '../components/Button';
import './GameSelector.css';

const GameSelector = ({ games, onSelect }) => {
  return (
    <div className="game-selector">
      <h2>Select a Game</h2>
      <div className="game-grid">
        {games.map((game) => (
          <Button
            key={game.id}
            onClick={() => onSelect(game.id)}
            className="game-button"
          >
            {game.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;