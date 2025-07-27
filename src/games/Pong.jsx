import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Pong.css';

const Pong = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  
  const gameStateRef = useRef({
    playerPaddle: { x: 0, y: 0, width: 15, height: 100 },
    computerPaddle: { x: 0, y: 0, width: 15, height: 100 },
    ball: { x: 0, y: 0, radius: 10, dx: 4, dy: 4 }
  });

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    gameStateRef.current = {
      playerPaddle: {
        x: 10,
        y: canvas.height / 2 - 50,
        width: 15,
        height: 100
      },
      computerPaddle: {
        x: canvas.width - 25,
        y: canvas.height / 2 - 50,
        width: 15,
        height: 100
      },
      ball: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 4,
        dy: 4
      }
    };
    setGameStarted(true);
    setGameOver(false);
    setPlayerScore(0);
    setComputerScore(0);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { playerPaddle, computerPaddle, ball } = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
    
    // Draw center line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#0095DD';
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
    
    // Draw scores
    ctx.font = '32px Arial';
    ctx.fillText(playerScore.toString(), canvas.width / 4, 50);
    ctx.fillText(computerScore.toString(), (3 * canvas.width) / 4, 50);
  }, [playerScore, computerScore]);

  const updateGameState = useCallback(() => {
    const canvas = canvasRef.current;
    const { ball, playerPaddle, computerPaddle } = gameStateRef.current;
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top/bottom)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (
      ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
      ball.x - ball.radius > playerPaddle.x &&
      ball.y > playerPaddle.y &&
      ball.y < playerPaddle.y + playerPaddle.height
    ) {
      ball.dx = Math.abs(ball.dx);
      const hitPosition = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
      ball.dy = hitPosition * 5;
    }
    
    if (
      ball.x + ball.radius > computerPaddle.x &&
      ball.x + ball.radius < computerPaddle.x + computerPaddle.width &&
      ball.y > computerPaddle.y &&
      ball.y < computerPaddle.y + computerPaddle.height
    ) {
      ball.dx = -Math.abs(ball.dx);
      const hitPosition = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
      ball.dy = hitPosition * 5;
    }
    
    // Scoring
    if (ball.x + ball.radius > canvas.width) {
      setPlayerScore(prev => prev + 1);
      if (playerScore >= 10) {
        setGameOver(true);
      } else {
        resetBall();
      }
    } else if (ball.x - ball.radius < 0) {
      setComputerScore(prev => prev + 1);
      if (computerScore >= 10) {
        setGameOver(true);
      } else {
        resetBall();
      }
    }
    
    // Computer AI
    const computerPaddleCenter = computerPaddle.y + computerPaddle.height / 2;
    const speed = 5;
    if (computerPaddleCenter < ball.y - 10) {
      computerPaddle.y = Math.min(computerPaddle.y + speed, canvas.height - computerPaddle.height);
    } else if (computerPaddleCenter > ball.y + 10) {
      computerPaddle.y = Math.max(computerPaddle.y - speed, 0);
    }
  }, [playerScore, computerScore]);

  const resetBall = useCallback(() => {
    const canvas = canvasRef.current;
    gameStateRef.current.ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: 4 * (Math.random() > 0.5 ? 1 : -1)
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
      const relativeY = e.clientY - rect.top;
      if (relativeY > 0 && relativeY < canvas.height) {
        gameStateRef.current.playerPaddle.y = relativeY - gameStateRef.current.playerPaddle.height / 2;
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
    <div className="pong">
      <h2>Pong</h2>
      <div className="game-controls">
        {!gameStarted && (
          <button onClick={initializeGame} className="start-button">
            Start Game
          </button>
        )}
        {(gameOver || !gameStarted) && (
          <div className="instructions">
            <p>Move your paddle with the mouse. First to 11 points wins!</p>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="game-canvas" />
      
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>
            {playerScore > computerScore ? 'You win!' : 'Computer wins!'} 
            ({playerScore}-{computerScore})
          </p>
          <button onClick={initializeGame} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Pong;