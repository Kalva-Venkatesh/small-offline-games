import React, { useState } from 'react';
import './RockPaperScissors.css';

const RockPaperScissors = () => {
  const choices = ['🪨', '📃', '✂️'];
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw';
    if (
      (player === '🪨' && computer === '✂️') ||
      (player === '📃' && computer === '🪨') ||
      (player === '✂️' && computer === '📃')
    ) {
      return 'player';
    }
    return 'computer';
  };

  const handleChoice = (choice) => {
    const computer = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computer);
    
    const winner = determineWinner(choice, computer);
    setResult(winner);
    
    if (winner === 'player') {
      setScore({ ...score, player: score.player + 1 });
    } else if (winner === 'computer') {
      setScore({ ...score, computer: score.computer + 1 });
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ player: 0, computer: 0 });
  };

  return (
    <div className="rock-paper-scissors">
      <h2>Rock Paper Scissors</h2>
      <div className="score">
        Player: {score.player} - Computer: {score.computer}
      </div>
      <div className="choices">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            className="choice"
          >
            {choice}
          </button>
        ))}
      </div>
      {playerChoice && computerChoice && (
        <div className="results">
          <p>You chose: {playerChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <p className="result">
            {result === 'draw'
              ? "It's a draw!"
              : result === 'player'
              ? 'You win!'
              : 'Computer wins!'}
          </p>
        </div>
      )}
      <button onClick={resetGame} className="reset-button">
        Reset Game
      </button>
    </div>
  );
};

export default RockPaperScissors;
