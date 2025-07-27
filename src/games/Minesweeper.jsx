import React, { useState, useEffect, useCallback } from 'react';
import './Minesweeper.css';

const BOARD_SIZE = 10;
const MINE_COUNT = 15;

const Minesweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flags, setFlags] = useState([]);
  const [firstClick, setFirstClick] = useState(true);

  const initializeBoard = useCallback((safeX, safeY) => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => 
      Array(BOARD_SIZE).fill({ revealed: false, mine: false, adjacentMines: 0 })
    );
    
    // Place mines randomly, ensuring the first click is safe
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      
      // Don't place mine on safe cell or where mines already exist
      if ((x !== safeX || y !== safeY) && !newBoard[x][y].mine) {
        newBoard[x][y] = { ...newBoard[x][y], mine: true };
        minesPlaced++;
      }
    }
    
    // Calculate adjacent mines
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (!newBoard[x][y].mine) {
          let count = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && newBoard[nx][ny].mine) {
                count++;
              }
            }
          }
          newBoard[x][y] = { ...newBoard[x][y], adjacentMines: count };
        }
      }
    }
    
    setBoard(newBoard);
  }, []);

  useEffect(() => {
    if (firstClick) return;
    initializeBoard();
  }, [firstClick, initializeBoard]);

  const revealCells = useCallback((x, y, newBoard) => {
    if (
      x < 0 || x >= BOARD_SIZE || 
      y < 0 || y >= BOARD_SIZE || 
      newBoard[x][y].revealed ||
      flags.some(f => f.x === x && f.y === y)
    ) return;
    
    newBoard[x][y] = { ...newBoard[x][y], revealed: true };
    
    if (newBoard[x][y].adjacentMines === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          revealCells(x + dx, y + dy, newBoard);
        }
      }
    }
  }, [flags]);

  const handleCellClick = useCallback((x, y) => {
    if (gameOver || win) return;
    
    if (firstClick) {
      setFirstClick(false);
      initializeBoard(x, y);
      return;
    }

    const newBoard = [...board];
    if (newBoard[x][y].mine) {
      // Game over - reveal all mines
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (newBoard[i][j].mine) {
            newBoard[i][j] = { ...newBoard[i][j], revealed: true };
          }
        }
      }
      setBoard(newBoard);
      setGameOver(true);
      return;
    }
    
    revealCells(x, y, newBoard);
    setBoard(newBoard);
    
    // Check win condition
    let unrevealedSafeCells = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!newBoard[i][j].mine && !newBoard[i][j].revealed) {
          unrevealedSafeCells++;
        }
      }
    }
    if (unrevealedSafeCells === 0) {
      setWin(true);
    }
  }, [board, firstClick, gameOver, initializeBoard, revealCells, win]);

  const handleRightClick = useCallback((e, x, y) => {
    e.preventDefault();
    if (board[x][y].revealed || gameOver || win) return;
    
    const flagIndex = flags.findIndex(f => f.x === x && f.y === y);
    if (flagIndex >= 0) {
      setFlags(flags.filter((_, i) => i !== flagIndex));
    } else if (flags.length < MINE_COUNT) {
      setFlags([...flags, { x, y }]);
    }
  }, [board, flags, gameOver, win]);

  const resetGame = useCallback(() => {
    setFirstClick(true);
    setGameOver(false);
    setWin(false);
    setFlags([]);
  }, []);

  return (
    <div className="minesweeper">
      <h2>Minesweeper</h2>
      <div className="game-info">
        <div className="status">
          {gameOver && <div className="game-over">Game Over!</div>}
          {win && <div className="win">You Win! 🎉</div>}
          <div className="flags">Flags: {flags.length}/{MINE_COUNT}</div>
        </div>
        <button onClick={resetGame} className="new-game-btn">
          New Game
        </button>
      </div>
      <div className="board">
        {board.map((row, x) => (
          <div key={x} className="row">
            {row.map((cell, y) => (
              <div
                key={`${x}-${y}`}
                className={`
                  cell 
                  ${cell.revealed ? 'revealed' : ''}
                  ${cell.mine && cell.revealed ? 'mine' : ''}
                `}
                onClick={() => handleCellClick(x, y)}
                onContextMenu={(e) => handleRightClick(e, x, y)}
              >
                {cell.revealed ? (
                  cell.mine ? (
                    '💣'
                  ) : (
                    cell.adjacentMines > 0 ? cell.adjacentMines : ''
                  )
                ) : flags.some(f => f.x === x && f.y === y) ? (
                  '🚩'
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minesweeper;