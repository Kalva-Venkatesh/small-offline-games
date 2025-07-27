import React, { useState } from 'react';
import GameSelector from './components/GameSelector';
import RockPaperScissors from './games/RockPaperScissors';
import NumberGuessing from './games/NumberGuessing';
import MemoryCard from './games/MemoryCard';
import Snake from './games/Snake';
import BrickBreaker from './games/BrickBreaker';
import Pong from './games/Pong';
import DiceRoll from './games/DiceRoll';
import TicTacToe from './games/TicTacToe';
import FlappyBird from './games/Flappy-Bird';
import WhackAMole from './games/WhackAMole';
import Game2048 from './games/Game2048';
import ConnectFour from './games/ConnectFour';
import Hangman from './games/Hangman';

import './App.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    
    {
  id: 'tic-tac-toe',
  name: 'Tic-Tac-Toe',
  component: <TicTacToe />,
  icon: '❌⭕',
  color: '#FF6B6B'
    },
    {
  id: 'flappy-bird',
  name: 'Flappy Bird',
  component: <FlappyBird />,
  icon: '🐤',
  color: '#F9C74F'
    },
  {
  id: 'whack-a-mole',
  name: 'Whack-a-Mole',
  component: <WhackAMole />,
  icon: '🔨🐹',
  color: '#F94144'
    },

    {
      id: 'rock-paper-scissors',
      name: 'Rock Paper Scissors',
      component: <RockPaperScissors />,
      icon: '✊✋✌️',
      color: '#4ECDC4'
    },
    {
      id: 'number-guessing',
      name: 'Number Guessing',
      component: <NumberGuessing />,
      icon: '🔢',
      color: '#FFD166'
    },
    {
      id: 'memory-card',
      name: 'Memory Card',
      component: <MemoryCard />,
      icon: '🧠',
      color: '#06D6A0'
    },
    {
  id: 'hangman',
  name: 'Hangman',
  component: <Hangman />,
  icon: '🪢',
  color: '#8E44AD'
}
,
    {
      id: 'snake',
      name: 'Snake',
      component: <Snake />,
      icon: '🐍',
      color: '#118AB2'
    },
    {
      id: 'brick-breaker',
      name: 'Brick Breaker',
      component: <BrickBreaker />,
      icon: '🧱',
      color: '#073B4C'
    },
    {
      id: 'pong',
      name: 'Pong',
      component: <Pong />,
      icon: '🏓',
      color: '#EF476F'
    },
    {
      id: 'dice-roll',
      name: 'Dice Roll',
      component: <DiceRoll />,
      icon: '🎲',
      color: '#7209B7'
    },
    
    
    {
      id: '2048',
      name: '2048',
      component: <Game2048 />,
      icon: '🧮',
      color: '#4895EF'
    },
    {
      id: 'connect-four',
      name: 'Connect Four',
      component: <ConnectFour />,
      icon: '🔴🟡',
      color: '#3F37C9'
    }
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Offline Small Games</h1>
        {selectedGame && (
          <button onClick={handleBackToMenu} className="back-button">
            ← Back to Menu
          </button>
        )}
      </header>
      
      <main className="app-main">
        {!selectedGame ? (
          <GameSelector games={games} onSelect={handleGameSelect} />
        ) : (
          <div className="game-container">
            {games.find(game => game.id === selectedGame).component}
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Offline Small Games</p>
      </footer>
    </div>
  );
}

export default App;