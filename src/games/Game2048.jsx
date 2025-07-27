import React, { useState, useEffect, useCallback } from 'react';
import './Game2048.css';

const Game2048 = () => {
  const [grid, setGrid] = useState(() => Array(4).fill().map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initializeGame = useCallback(() => {
    const newGrid = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  const addRandomTile = useCallback((grid) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }, []);

  const moveTiles = useCallback((direction) => {
    if (gameOver) return;
    
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    const rotate = (grid, times) => {
      let rotated = [...grid];
      for (let t = 0; t < times; t++) {
        rotated = rotated[0].map((_, i) => rotated.map(row => row[3 - i]));
      }
      return rotated;
    };

    let rotatedGrid = newGrid;
    let rotateTimes = 0;
    
    if (direction === 'up') rotateTimes = 1;
    else if (direction === 'right') rotateTimes = 2;
    else if (direction === 'down') rotateTimes = 3;
    
    rotatedGrid = rotate(newGrid, rotateTimes);

    // Process movement to the left
    for (let i = 0; i < 4; i++) {
      let row = rotatedGrid[i].filter(val => val !== 0);
      
      // Merge tiles
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          if (row[j] === 2048) setWon(true);
          row[j + 1] = 0;
        }
      }
      
      row = row.filter(val => val !== 0);
      while (row.length < 4) {
        row.push(0);
      }
      
      if (JSON.stringify(rotatedGrid[i]) !== JSON.stringify(row)) {
        moved = true;
        rotatedGrid[i] = row;
      }
    }

    rotatedGrid = rotate(rotatedGrid, (4 - rotateTimes) % 4);

    if (moved) {
      addRandomTile(rotatedGrid);
      setScore(newScore);
      setGrid(rotatedGrid);
      
      if (isGameOver(rotatedGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, score, gameOver, addRandomTile]);

  const isGameOver = useCallback((grid) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (j < 3 && grid[i][j] === grid[i][j + 1]) ||
          (i < 3 && grid[i][j] === grid[i + 1][j])
        ) {
          return false;
        }
      }
    }
    
    return true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        moveTiles(e.key.replace('Arrow', '').toLowerCase());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveTiles]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="game-2048">
      <h2>2048</h2>
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <button onClick={initializeGame} className="new-game-btn">
          New Game
        </button>
      </div>
      
      {gameOver && (
        <div className="game-over">
          Game Over!
        </div>
      )}
      
      {won && (
        <div className="game-won">
          You Reached 2048!
        </div>
      )}
      
      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div 
                key={`${i}-${j}`} 
                className={`cell ${cell ? `value-${cell}` : ''}`}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="controls">
        <button onClick={() => moveTiles('up')}>↑</button>
        <div>
          <button onClick={() => moveTiles('left')}>←</button>
          <button onClick={() => moveTiles('down')}>↓</button>
          <button onClick={() => moveTiles('right')}>→</button>
        </div>
      </div>
      
      <div className="instructions">
        <p>Use arrow keys or buttons to move tiles</p>
        <p>Combine tiles with the same number to reach 2048!</p>
      </div>
    </div>
  );
};

export default Game2048;