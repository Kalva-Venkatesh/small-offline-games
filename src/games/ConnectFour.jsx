import React, { useState } from 'react';
import './ConnectFour.css';

const ROWS = 6;
const COLS = 7;
const PLAYERS = {
  RED: 'red',
  YELLOW: 'yellow'
};

const ConnectFour = () => {
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.RED);
  const [winner, setWinner] = useState(null);

  const makeMove = (col) => {
    if (winner) return;
    
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        
        if (checkWin(newBoard, row, col)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(
            currentPlayer === PLAYERS.RED ? PLAYERS.YELLOW : PLAYERS.RED
          );
        }
        return;
      }
    }
  };

  const checkWin = (board, row, col) => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1]   // diagonal down-left
    ];
    
    const player = board[row][col];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      
      if (count >= 4) return true;
    }
    
    return false;
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
    setCurrentPlayer(PLAYERS.RED);
    setWinner(null);
  };

  return (
    <div className="connect-four">
      <h2>Connect Four</h2>
      <div className="game-info">
        <div className={`player-turn ${currentPlayer}`}>
          {winner ? (
            <span className="winner">{winner.toUpperCase()} WINS!</span>
          ) : (
            `${currentPlayer.toUpperCase()}'s Turn`
          )}
        </div>
        <button onClick={resetGame} className="reset-btn">
          Reset Game
        </button>
      </div>
      <div className="board">
        {Array(COLS).fill().map((_, col) => (
          <div 
            key={col} 
            className="column" 
            onClick={() => makeMove(col)}
          >
            {Array(ROWS).fill().map((_, row) => (
              <div 
                key={`${row}-${col}`} 
                className={`cell ${board[row][col] || 'empty'}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectFour;