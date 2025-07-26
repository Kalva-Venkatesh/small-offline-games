import React, { useState, useEffect, useRef } from 'react';
import './Pong.css';

const Pong = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  
  const [playerPaddle, setPlayerPaddle] = useState({
    x: 0,
    y: 0,
    width: 15,
    height: 100
  });
  
  const [computerPaddle, setComputerPaddle] = useState({
    x: 0,
    y: 0,
    width: 15,
    height: 100
  });
  
  const [ball, setBall] = useState({
    x: 0,
    y: 0,
    radius: 10,
    dx: 4,
    dy: 4
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    setPlayerPaddle({
      x: 10,
      y: canvas.height / 2 - 50,
      width: 15,
      height: 100
    });
    
    setComputerPaddle({
      x: canvas.width - 25,
      y: canvas.height / 2 - 50,
      width: 15,
      height: 100
    });
    
    setBall({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      dx: 4,
      dy: 4
    });
    
    const handleMouseMove = (e) => {
      if (!gameStarted || gameOver) return;
      
      const rect = canvas.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      if (relativeY > 0 && relativeY < canvas.height) {
        setPlayerPaddle(prev => ({
          ...prev,
          y: relativeY - prev.height / 2
        }));
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
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
    };
    
    draw();
  }, [ball, computerPaddle, gameStarted, playerPaddle, playerScore, computerScore]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    const gameLoop = setInterval(() => {
      setBall(prev => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;
        
        // Wall collision (top/bottom)
        if (newY + prev.radius > canvas.height || newY - prev.radius < 0) {
          newDy = -newDy;
        }
        
        // Paddle collision
        if (
          newX - prev.radius < playerPaddle.x + playerPaddle.width &&
          newX - prev.radius > playerPaddle.x &&
          newY > playerPaddle.y &&
          newY < playerPaddle.y + playerPaddle.height
        ) {
          newDx = Math.abs(newDx);
          const hitPosition = (newY - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
          newDy = hitPosition * 5;
        }
        
        if (
          newX + prev.radius > computerPaddle.x &&
          newX + prev.radius < computerPaddle.x + computerPaddle.width &&
          newY > computerPaddle.y &&
          newY < computerPaddle.y + computerPaddle.height
        ) {
          newDx = -Math.abs(newDx);
          const hitPosition = (newY - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
          newDy = hitPosition * 5;
        }
        
        // Scoring
        if (newX + prev.radius > canvas.width) {
          setPlayerScore(prev => prev + 1);
          if (playerScore >= 10) {
            setGameOver(true);
          } else {
            newX = canvas.width / 2;
            newY = canvas.height / 2;
            newDx = -4;
            newDy = 4;
          }
        } else if (newX - prev.radius < 0) {
          setComputerScore(prev => prev + 1);
          if (computerScore >= 10) {
            setGameOver(true);
          } else {
            newX = canvas.width / 2;
            newY = canvas.height / 2;
            newDx = 4;
            newDy = 4;
          }
        }
        
        return { ...prev, x: newX, y: newY, dx: newDx, dy: newDy };
      });
      
      // Computer AI
      setComputerPaddle(prev => {
        const computerPaddleCenter = prev.y + prev.height / 2;
        const speed = 5;
        let newY = prev.y;
        
        if (computerPaddleCenter < ball.y - 10) {
          newY = Math.min(prev.y + speed, canvas.height - prev.height);
        } else if (computerPaddleCenter > ball.y + 10) {
          newY = Math.max(prev.y - speed, 0);
        }
        
        return { ...prev, y: newY };
      });
    }, 16);
    
    return () => clearInterval(gameLoop);
  }, [ball.radius, computerPaddle.height, computerPaddle.width, computerPaddle.x, computerPaddle.y, computerScore, gameOver, gameStarted, playerPaddle.height, playerPaddle.width, playerPaddle.x, playerPaddle.y, playerScore]);

  const startGame = () => {
    const canvas = canvasRef.current;
    setGameStarted(true);
    setGameOver(false);
    setPlayerScore(0);
    setComputerScore(0);
    setBall({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      dx: 4,
      dy: 4
    });
  };

  return (
    <div className="pong">
      <h2>Pong</h2>
      <div className="game-controls">
        {!gameStarted && (
          <button onClick={startGame} className="start-button">
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
          <button onClick={startGame} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Pong;