import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BrickBreaker.css';

const BrickBreaker = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const gameStateRef = useRef({
    paddle: { x: 0, y: 0, width: 100, height: 15 },
    ball: { x: 0, y: 0, radius: 10, dx: 4, dy: -4 },
    bricks: []
  });

  const BRICK_ROW_COUNT = 5;
  const BRICK_COLUMN_COUNT = 9;
  const BRICK_WIDTH = 75;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 60;
  const BRICK_OFFSET_LEFT = 30;

  const initializeBricks = useCallback(() => {
    const bricks = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      bricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    return bricks;
  }, []);

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    gameStateRef.current = {
      paddle: {
        x: canvas.width / 2 - 50,
        y: canvas.height - 30,
        width: 100,
        height: 15
      },
      ball: {
        x: canvas.width / 2,
        y: canvas.height - 50,
        radius: 10,
        dx: 4,
        dy: -4
      },
      bricks: initializeBricks()
    };
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
  }, [initializeBricks]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { paddle, ball, bricks } = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bricks
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          
          ctx.beginPath();
          ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = '#0095DD';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    
    // Draw paddle
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
    
    // Draw score
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20);
    
    // Draw lives
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
  }, [score, lives]);

  const updateGameState = useCallback(() => {
    const canvas = canvasRef.current;
    const { ball, paddle, bricks } = gameStateRef.current;
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (left/right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }
    
    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -Math.abs(ball.dy);
      const hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dx = hitPosition * 5;
    }
    
    // Brick collision
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + BRICK_WIDTH &&
            ball.y > brick.y &&
            ball.y < brick.y + BRICK_HEIGHT
          ) {
            ball.dy = -ball.dy;
            bricks[c][r].status = 0;
            setScore(prev => prev + 10);
            
            // Check if all bricks are destroyed
            if (bricks.flat().every(b => b.status === 0)) {
              setGameOver(true);
            }
          }
        }
      }
    }
    
    // Bottom collision (lose life)
    if (ball.y + ball.radius > canvas.height) {
      setLives(prev => prev - 1);
      
      if (lives <= 1) {
        setGameOver(true);
      } else {
        resetBall();
      }
    }
  }, [lives]);

  const resetBall = useCallback(() => {
    const canvas = canvasRef.current;
    gameStateRef.current.ball = {
      x: canvas.width / 2,
      y: canvas.height - 50,
      radius: 10,
      dx: 4,
      dy: -4
    };
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;
    
    updateGameState();
    draw();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, updateGameState, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    
    const handleMouseMove = (e) => {
      if (!gameStarted || gameOver) return;
      
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        gameStateRef.current.paddle.x = relativeX - gameStateRef.current.paddle.width / 2;
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    gameLoop();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameLoop]);

  return (
    <div className="brick-breaker">
      <h2>Brick Breaker</h2>
      <div className="game-controls">
        {!gameStarted && (
          <button onClick={initializeGame} className="start-button">
            Start Game
          </button>
        )}
        {(gameOver || !gameStarted) && (
          <div className="instructions">
            <p>Move the paddle with your mouse to bounce the ball and break bricks.</p>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="game-canvas" />
      
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Your score: {score}</p>
          <button onClick={initializeGame} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BrickBreaker;