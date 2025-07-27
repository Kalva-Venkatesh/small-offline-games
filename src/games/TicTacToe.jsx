import React, { useState } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const renderCell = (index) => (
    <div style={styles.cell} onClick={() => handleClick(index)}>
      {board[index]}
    </div>
  );

  const status = winner
    ? `Winner: ${winner}`
    : board.every(Boolean)
    ? "It's a Draw!"
    : `Next Player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tic-Tac-Toe</h2>
      <p style={styles.status}>{status}</p>
      <div style={styles.board}>
        {Array(9)
          .fill(null)
          .map((_, i) => renderCell(i))}
      </div>
      <button style={styles.button} onClick={handleReset}>
        Restart Game
      </button>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const styles = {
  container: {
    textAlign: 'center',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#fff',
    paddingTop: '40px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  status: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 80px)',
    gridTemplateRows: 'repeat(3, 80px)',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cell: {
    width: '80px',
    height: '80px',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default TicTacToe;
