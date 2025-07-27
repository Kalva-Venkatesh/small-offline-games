import React, { useEffect, useRef, useState } from 'react';

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Use a ref to hold the isGameOver state. This allows event listeners
  // to access the latest value without needing to be re-created.
  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;

  // FIX: useEffect now has an empty dependency array [].
  // This ensures the game setup logic runs only ONCE.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    let birdY = 250;
    const birdX = 80;
    const birdRadius = 15;
    let gravity = 0.6;
    let velocity = 0;
    const jump = -10;
    const pipeWidth = 60;
    const pipeGap = 150;
    let pipes = [];
    let animationFrameId;
    // FIX: Use a local variable for score within the game loop to avoid stale state.
    let localScore = 0;

    const resetGame = () => {
      birdY = 250;
      velocity = 0;
      pipes = [];
      localScore = 0;
      setScore(0); // Update React state for the UI
      setIsGameOver(false);
      // Start the animation loop again
      animationFrameId = requestAnimationFrame(update);
    };

    const spawnPipe = () => {
      const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
      pipes.push({
        x: canvas.width,
        topHeight,
        bottomY: topHeight + pipeGap,
        passed: false, // FIX: Add 'passed' property for accurate scoring
      });
    };

    const drawBird = () => {
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPipes = () => {
      ctx.fillStyle = '#4caf50';
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
      });
    };

    const gameOver = () => {
        setIsGameOver(true);
        cancelAnimationFrame(animationFrameId);
    };

    const checkCollision = () => {
      // Ground collision
      if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
        gameOver();
        return;
      }
      // Pipe collision
      for (const pipe of pipes) {
        if (
          birdX + birdRadius > pipe.x &&
          birdX - birdRadius < pipe.x + pipeWidth &&
          (birdY - birdRadius < pipe.topHeight || birdY + birdRadius > pipe.bottomY)
        ) {
          gameOver();
          return;
        }
      }
    };

    const update = () => {
      if (isGameOverRef.current) return; // Stop the loop if game is over

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bird physics
      velocity += gravity;
      birdY += velocity;
      drawBird();

      // Move pipes
      pipes.forEach((pipe) => {
        pipe.x -= 2;
      });
      drawPipes();

      // FIX: Improved scoring logic
      pipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + pipeWidth < birdX) {
          pipe.passed = true;
          localScore++;
          setScore(localScore); // Update React state for UI display
        }
      });

      // Remove pipes that are off-screen
      pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);

      // Spawn new pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 220) {
        spawnPipe();
      }

      checkCollision();

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      // FIX: Draw the localScore, not the stale state variable
      ctx.fillText(`Score: ${localScore}`, 10, 30);

      animationFrameId = requestAnimationFrame(update);
    };

    const handleAction = (e) => {
      // Prevent spacebar from scrolling the page
      if (e.code === 'Space') e.preventDefault();
      
      // FIX: Check the .current property of the ref to get the latest state
      if (isGameOverRef.current) {
        resetGame();
      } else {
        velocity = jump;
      }
    };

    window.addEventListener('keydown', handleAction);
    window.addEventListener('mousedown', handleAction);

    // Start the game
    resetGame();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('keydown', handleAction);
      window.removeEventListener('mousedown', handleAction);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // <-- FIX: Empty dependency array

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Flappy Bird</h2>
      <canvas ref={canvasRef} style={styles.canvas} />
      {isGameOver && (
        <div style={styles.overlay}>
          <h3>Game Over</h3>
          <p>Score: {score}</p>
          <p>Press any Key or Click to Restart</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    backgroundColor: '#222',
    color: '#fff',
    minHeight: '100vh',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  canvas: {
    border: '2px solid #fff',
    backgroundColor: '#87ceeb',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: '20px 40px',
    borderRadius: '8px',
    border: '2px solid #fff',
  },
};

export default FlappyBird;