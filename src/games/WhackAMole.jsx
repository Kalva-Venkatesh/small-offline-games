import React, { useState, useEffect } from 'react';

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [activeMole, setActiveMole] = useState(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let moleTimer, countdownTimer;

    if (gameRunning) {
      moleTimer = setInterval(() => {
        setActiveMole(Math.floor(Math.random() * 9));
      }, 800);

      countdownTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(moleTimer);
            clearInterval(countdownTimer);
            setGameRunning(false);
            setActiveMole(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(moleTimer);
      clearInterval(countdownTimer);
    };
  }, [gameRunning]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(30);
    setGameRunning(true);
  };

  const handleClick = (index) => {
    if (index === activeMole && gameRunning) {
      setScore((prev) => prev + 1);
      setActiveMole(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Whack-a-Mole</h2>
      <p style={styles.info}>Time Left: {timeLeft}s | Score: {score}</p>
      {!gameRunning && (
        <button onClick={handleStart} style={styles.button}>Start Game</button>
      )}
      <div style={styles.grid}>
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              ...styles.hole,
              backgroundColor: idx === activeMole ? '#f44336' : '#333',
              cursor: gameRunning ? 'pointer' : 'default'
            }}
            onClick={() => handleClick(idx)}
          >
            {idx === activeMole && <span style={styles.mole}>🐹</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    minHeight: '100vh',
    backgroundColor: '#1b1b1b',
    color: '#fff',
    paddingTop: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  info: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 100px)',
    gap: '15px',
    justifyContent: 'center',
    padding: '20px',
  },
  hole: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    userSelect: 'none',
  },
  mole: {
    fontSize: '32px',
  },
};

export default WhackAMole;
