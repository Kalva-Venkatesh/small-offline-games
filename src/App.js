import React, { useState } from 'react';
import GameSelector from './components/GameSelector';
import TicTacToe from './games/TicTacToe';
import RockPaperScissors from './games/RockPaperScissors';
import NumberGuessing from './games/NumberGuessing';
import MemoryCard from './games/MemoryCard';
import Snake from './games/Snake';
import BrickBreaker from './games/BrickBreaker';
import Pong from './games/Pong';
import Ludo from './games/Ludo';
import './App.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', component: <TicTacToe /> },
    { id: 'rock-paper-scissors', name: 'Rock Paper Scissors', component: <RockPaperScissors /> },
    { id: 'number-guessing', name: 'Number Guessing', component: <NumberGuessing /> },
    { id: 'memory-card', name: 'Memory Card', component: <MemoryCard /> },
    { id: 'snake', name: 'Snake', component: <Snake /> },
    { id: 'brick-breaker', name: 'Brick Breaker', component: <BrickBreaker /> },
    { id: 'pong', name: 'Pong', component: <Pong /> },
    { id: 'ludo', name: 'Ludo', component: <Ludo /> },
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  return (
    <div className="app">
      <h1>Offline Small Games</h1>
      {!selectedGame ? (
        <GameSelector games={games} onSelect={handleGameSelect} />
      ) : (
        <div className="game-container">
          <button onClick={handleBackToMenu} className="back-button">
            Back to Menu
          </button>
          {games.find(game => game.id === selectedGame).component}
        </div>
      )}
    </div>
  );
}

export default App;