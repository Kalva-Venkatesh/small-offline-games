import React, { useState, useEffect, useRef } from 'react';
import './BrickBreaker.css';

const BrickBreaker = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [paddle, setPaddle] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 15
  });
  
  const [ball, setBall] = useState({
    x: 0,
    y: 0,
    radius: 10,
    dx: 4,
    dy: -4
  });
  
  const [bricks, setBricks] = useState([]);
  const brickRowCount = 5;
  const brickColumnCount = 9;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 60;
  const brickOffsetLeft = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    setPaddle({
      x: canvas.width / 2 - 50,
      y: canvas.height - 30,
      width: 100,
      height: 15
    });
    
    setBall({
      x: canvas.width / 2,
      y: canvas.height - 50,
      radius: 10,
      dx: 4,
      dy: -4
    });
    
    const newBricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      newBricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        newBricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    setBricks(newBricks);
    
    const handleMouseMove = (e) => {
      if (!gameStarted || gameOver) return;
      
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        setPaddle(prev => ({
          ...prev,
          x: relativeX - prev.width / 2
        }));
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      
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
    };
    
    draw();
  }, [ball, bricks, gameStarted, lives, paddle, score]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const brick = bricks[c][r];
          if (brick.status === 1) {
            if (
              ball.x > brick.x &&
              ball.x < brick.x + brickWidth &&
              ball.y > brick.y &&
              ball.y < brick.y + brickHeight
            ) {
              setBall(prev => ({ ...prev, dy: -prev.dy }));
              const newBricks = [...bricks];
              newBricks[c][r].status = 0;
              setBricks(newBricks);
              setScore(prev => prev + 10);
              
              if (newBricks.flat().every(brick => brick.status === 0)) {
                setGameOver(true);
              }
            }
          }
        }
      }
    };
    
    const gameLoop = setInterval(() => {
      setBall(prev => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;
        
        // Wall collision
        if (newX + prev.radius > canvas.width || newX - prev.radius < 0) {
          newDx = -newDx;
        }
        if (newY - prev.radius < 0) {
          newDy = -newDy;
        }
        
        // Paddle collision
        if (
          newY + prev.radius > paddle.y &&
          newY - prev.radius < paddle.y + paddle.height &&
          newX > paddle.x &&
          newX < paddle.x + paddle.width
        ) {
          newDy = -Math.abs(newDy);
          const hitPosition = (newX - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          newDx = hitPosition * 5;
        }
        
        // Bottom collision
        if (newY + prev.radius > canvas.height) {
          setLives(prev => prev - 1);
          
          if (lives <= 1) {
            setGameOver(true);
          } else {
            newX = canvas.width / 2;
            newY = canvas.height - 50;
            newDx = 4;
            newDy = -4;
          }
        }
        
        return { ...prev, x: newX, y: newY, dx: newDx, dy: newDy };
      });
      
      collisionDetection();
    }, 10);
    
    return () => clearInterval(gameLoop);
  }, [ball.dx, ball.dy, ball.radius, bricks, gameOver, gameStarted, lives, paddle.height, paddle.width, paddle.x, paddle.y, score]);

  const startGame = () => {
    const canvas = canvasRef.current;
    const newBricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      newBricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        newBricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setBricks(newBricks);
    setPaddle({
      x: canvas.width / 2 - 50,
      y: canvas.height - 30,
      width: 100,
      height: 15
    });
    setBall({
      x: canvas.width / 2,
      y: canvas.height - 50,
      radius: 10,
      dx: 4,
      dy: -4
    });
  };

  return (
    <div className="brick-breaker">
      <h2>Brick Breaker</h2>
      <div className="game-controls">
        {!gameStarted && (
          <button onClick={startGame} className="start-button">
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
          <button onClick={startGame} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BrickBreaker;