import React, { useState, useEffect, useRef } from 'react';
import './Snake.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const Snake = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef();

  // Generate random food position
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Make sure food doesn't appear on snake
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) return generateFood();
    return newFood;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        
        // Move head based on direction
        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
          default:
            break;
        }
        
        // Check for collisions
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }
        
        const newSnake = [head, ...prevSnake];
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
          setScore(prev => prev + 10);
          
          // Increase speed every 50 points
          if (score > 0 && score % 50 === 0) {
            setSpeed(prev => Math.max(prev - 10, 50));
          }
        } else {
          // Remove tail if no food eaten
          newSnake.pop();
        }
        
        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [direction, food, gameOver, isPaused, score, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  return (
    <div className="snake-game">
      <h2>Snake Game</h2>
      <div className="game-info">
        <p>Score: {score}</p>
        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
        <button onClick={() => setIsPaused(prev => !prev)} className="pause-button">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      
      <div 
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {/* Food */}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE
          }}
        />
        
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          />
        ))}
      </div>
      
      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Your score: {score}</p>
          <button onClick={resetGame} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
      
      <div className="instructions">
        <p>Use arrow keys to move. Space to pause.</p>
      </div>
    </div>
  );
};

export default Snake;