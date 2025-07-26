import React, { useState } from 'react';
import './Ludo.css';

const Ludo = () => {
  const players = ['red', 'blue', 'green', 'yellow'];
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameState, setGameState] = useState(initializeGame());

  function initializeGame() {
    return players.map((color) => ({
      color,
      pawns: Array(4).fill().map((_, i) => ({
        id: i,
        position: 'home',
        trackPosition: -1
      })),
      finishedPawns: 0
    }));
  }

  const rollDice = () => {
    if (gameOver) return;
    
    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValue(value);
    
    const currentColor = players[currentPlayer];
    const playerState = gameState.find(p => p.color === currentColor);
    const canMove = playerState.pawns.some(pawn => 
      canPawnMove(pawn, value, playerState)
    );
    
    if (!canMove) {
      setTimeout(() => {
        setDiceValue(0);
        setCurrentPlayer((currentPlayer + 1) % players.length);
      }, 1000);
    }
  };

  const canPawnMove = (pawn, diceRoll, playerState) => {
    if (pawn.position === 'home') {
      return diceRoll === 6;
    } else if (pawn.position === 'track') {
      const newPosition = pawn.trackPosition + diceRoll;
      return newPosition <= 56;
    }
    return false;
  };

  const movePawn = (playerIndex, pawnIndex) => {
    if (diceValue === 0 || gameOver) return;
    
    const currentColor = players[currentPlayer];
    if (gameState[playerIndex].color !== currentColor) return;
    
    const pawn = gameState[playerIndex].pawns[pawnIndex];
    
    if (!canPawnMove(pawn, diceValue, gameState[playerIndex])) {
      return;
    }
    
    setGameState(prev => {
      const newState = [...prev];
      const playerState = { ...newState[playerIndex] };
      const pawns = [...playerState.pawns];
      const pawnToMove = { ...pawns[pawnIndex] };
      
      if (pawnToMove.position === 'home' && diceValue === 6) {
        pawnToMove.position = 'track';
        pawnToMove.trackPosition = 0;
      } else if (pawnToMove.position === 'track') {
        pawnToMove.trackPosition += diceValue;
        
        if (pawnToMove.trackPosition >= 56) {
          pawnToMove.position = 'finish';
          pawnToMove.trackPosition = -1;
          playerState.finishedPawns += 1;
          
          if (playerState.finishedPawns === 4) {
            setWinner(currentColor);
            setGameOver(true);
          }
        }
      }
      
      pawns[pawnIndex] = pawnToMove;
      playerState.pawns = pawns;
      newState[playerIndex] = playerState;
      
      return newState;
    });
    
    if (diceValue !== 6) {
      setCurrentPlayer((currentPlayer + 1) % players.length);
    }
    setDiceValue(0);
  };

  const startGame = () => {
    setGameState(initializeGame());
    setCurrentPlayer(0);
    setDiceValue(0);
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="ludo">
      <h2>Ludo</h2>
      
      {!gameStarted ? (
        <div className="game-start">
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
          <div className="instructions">
            <p>Take turns rolling the dice and move your pawns around the board.</p>
            <p>Roll a 6 to move a pawn out of home. First to get all pawns to finish wins!</p>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-info">
            <p>Current Player: <span className={`player-${players[currentPlayer]}`}>
              {players[currentPlayer]}
            </span></p>
            <p>Dice: {diceValue || 'Roll!'}</p>
            {diceValue === 0 && !gameOver && (
              <button onClick={rollDice} className="roll-button">
                Roll Dice
              </button>
            )}
          </div>
          
          <div className="ludo-board">
            {gameState.map((player, playerIndex) => (
              <div key={player.color} className={`player-zone ${player.color}`}>
                <h3>{player.color}</h3>
                <div className="pawns">
                  {player.pawns.map((pawn, pawnIndex) => (
                    <div
                      key={pawn.id}
                      className={`pawn ${player.color} ${pawn.position}`}
                      onClick={() => movePawn(playerIndex, pawnIndex)}
                    >
                      {pawn.position === 'track' && pawn.trackPosition >= 0 && (
                        <span className="pawn-number">{pawn.trackPosition}</span>
                      )}
                    </div>
                  ))}
                </div>
                <p>Finished: {player.finishedPawns}/4</p>
              </div>
            ))}
          </div>
          
          {gameOver && (
            <div className="game-over">
              <h3>Game Over!</h3>
              <p><span className={`player-${winner}`}>{winner}</span> wins!</p>
              <button onClick={startGame} className="play-again-button">
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ludo;