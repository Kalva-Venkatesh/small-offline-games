import React, { useEffect, useRef, useState } from 'react';

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 600;

    let birdY = 250;
    let birdX = 80;
    let gravity = 0.6;
    let velocity = 0;
    let jump = -10;
    let pipeWidth = 60;
    let pipeGap = 150;
    let pipes = [];
    let animationFrameId;

    const resetGame = () => {
      birdY = 250;
      velocity = 0;
      setScore(0);
      setIsGameOver(false);
      pipes = [];
    };

    const spawnPipe = () => {
      const topHeight = Math.floor(Math.random() * 200) + 50;
      pipes.push({
        x: canvas.width,
        topHeight,
        bottomY: topHeight + pipeGap,
      });
    };

    const drawBird = () => {
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(birdX, birdY, 15, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPipes = () => {
      ctx.fillStyle = '#4caf50';
      pipes.forEach((pipe) => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height);
      });
    };

    const checkCollision = () => {
      for (let pipe of pipes) {
        const hitPipe =
          birdX + 15 > pipe.x &&
          birdX - 15 < pipe.x + pipeWidth &&
          (birdY - 15 < pipe.topHeight || birdY + 15 > pipe.bottomY);

        const hitGround = birdY + 15 > canvas.height;

        if (hitPipe || hitGround) {
          setIsGameOver(true);
          cancelAnimationFrame(animationFrameId);
        }
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update bird
      velocity += gravity;
      birdY += velocity;

      drawBird();

      // Update pipes
      pipes.forEach((pipe) => {
        pipe.x -= 2;
      });

      // Remove pipes off-screen and update score
      if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        setScore((prev) => prev + 1);
      }

      // Spawn new pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
        spawnPipe();
      }

      drawPipes();
      checkCollision();

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);

      animationFrameId = requestAnimationFrame(update);
    };

    const handleJump = () => {
      if (isGameOver) {
        resetGame();
        update();
      } else {
        velocity = jump;
      }
    };

    window.addEventListener('keydown', handleJump);
    window.addEventListener('mousedown', handleJump);

    update();

    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('mousedown', handleJump);
      cancelAnimationFrame(animationFrameId);
    };
  }, [score, isGameOver]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Flappy Bird</h2>
      <canvas ref={canvasRef} style={styles.canvas} />
      {isGameOver && (
        <div style={styles.overlay}>
          <h3>Game Over</h3>
          <p>Score: {score}</p>
          <p>Press Space or Click to Restart</p>
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
    marginTop: '20px',
    backgroundColor: '#000000aa',
    padding: '10px',
    borderRadius: '8px',
    display: 'inline-block',
  },
};

export default FlappyBird;
