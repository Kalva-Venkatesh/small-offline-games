import React, { useState, useEffect } from 'react';
import './DiceRoll.css';

const DiceRoll = () => {
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(10);
  const [guess, setGuess] = useState('');
  const [diceValue, setDiceValue] = useState(0);
  const [result, setResult] = useState('');
  const [rolling, setRolling] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  const handleBetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= balance) {
      setBet(value);
    }
  };

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
  };

  const rollDice = () => {
    if (rolling || !guess || bet < 1 || bet > balance) return;

    setRolling(true);
    setResult('Rolling...');
    
    // Animate dice rolling
    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(rollInterval);
        finishRoll();
      }
    }, 100);
  };

  const finishRoll = () => {
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newDiceValue);
    setRolling(false);

    const win = (
      (guess === 'low' && newDiceValue <= 3) ||
      (guess === 'high' && newDiceValue >= 4) ||
      (guess === 'even' && newDiceValue % 2 === 0) ||
      (guess === 'odd' && newDiceValue % 2 !== 0)
    );

    let newBalance = balance;
    let amountWon = 0;

    if (win) {
      const multiplier = guess === 'low' || guess === 'high' ? 1 : 2;
      amountWon = bet * multiplier;
      newBalance = balance + amountWon;
      setResult(`You won ${amountWon}! Dice showed ${newDiceValue}`);
    } else {
      amountWon = -bet;
      newBalance = balance - bet;
      setResult(`You lost ${bet}! Dice showed ${newDiceValue}`);
    }

    setBalance(newBalance);
    setGameHistory([...gameHistory, { 
      guess, 
      diceValue: newDiceValue, 
      result: win ? 'Win' : 'Lose', 
      amount: amountWon 
    }]);
  };

  const resetGame = () => {
    setBalance(100);
    setBet(10);
    setGuess('');
    setDiceValue(0);
    setResult('');
    setGameHistory([]);
  };

  return (
    <div className="dice-roll">
      <h2>Dice Roll Game</h2>
      <div className="game-container">
        <div className="balance">Balance: ${balance}</div>
        
        <div className="bet-controls">
          <label>
            Bet Amount:
            <input
              type="number"
              min="1"
              max={balance}
              value={bet}
              onChange={handleBetChange}
              disabled={rolling}
            />
          </label>
          <button 
            onClick={() => setBet(Math.min(bet + 5, balance))} 
            disabled={rolling || bet >= balance}
          >
            +5
          </button>
          <button 
            onClick={() => setBet(Math.max(bet - 5, 1))} 
            disabled={rolling || bet <= 1}
          >
            -5
          </button>
        </div>

        <div className="guess-options">
          <p>Guess the outcome:</p>
          <div className="guess-buttons">
            <button
              className={guess === 'low' ? 'active' : ''}
              onClick={() => setGuess('low')}
              disabled={rolling}
            >
              Low (1-3)
            </button>
            <button
              className={guess === 'high' ? 'active' : ''}
              onClick={() => setGuess('high')}
              disabled={rolling}
            >
              High (4-6)
            </button>
            <button
              className={guess === 'even' ? 'active' : ''}
              onClick={() => setGuess('even')}
              disabled={rolling}
            >
              Even (2x)
            </button>
            <button
              className={guess === 'odd' ? 'active' : ''}
              onClick={() => setGuess('odd')}
              disabled={rolling}
            >
              Odd (2x)
            </button>
          </div>
        </div>

        <div className="dice-container">
          <div className={`dice ${rolling ? 'rolling' : ''}`}>
            {diceValue > 0 && (
              <div className={`dice-face face-${diceValue}`}>
                {Array.from({ length: diceValue }).map((_, i) => (
                  <span key={i} className="dot"></span>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={rollDice} 
            className="roll-button"
            disabled={rolling || !guess || bet < 1 || bet > balance}
          >
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>

        {result && (
          <div className={`result ${result.includes('won') ? 'win' : 'lose'}`}>
            {result}
          </div>
        )}

        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>

        {gameHistory.length > 0 && (
          <div className="history">
            <h3>Game History</h3>
            <div className="history-list">
              {gameHistory.slice().reverse().map((game, index) => (
                <div key={index} className={`history-item ${game.result.toLowerCase()}`}>
                  <span>Guess: {game.guess}</span>
                  <span>Dice: {game.diceValue}</span>
                  <span>Result: {game.result} ({game.amount > 0 ? '+' : ''}{game.amount})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoll;