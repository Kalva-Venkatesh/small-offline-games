import React, { useState, useEffect, useCallback } from 'react';

// --- SVG component for the Hangman Figure ---
const HangmanFigure = ({ wrongGuesses }) => {
  const parts = [
    // Base
    <line key="base-1" x1="60" y1="280" x2="140" y2="280" stroke="#fff" strokeWidth="4" />,
    <line key="base-2" x1="100" y1="280" x2="100" y2="100" stroke="#fff" strokeWidth="4" />,
    <line key="base-3" x1="100" y1="100" x2="200" y2="100" stroke="#fff" strokeWidth="4" />,
    <line key="rope" x1="200" y1="100" x2="200" y2="140" stroke="#fff" strokeWidth="4" />,
    // Head
    <circle key="head" cx="200" cy="160" r="20" stroke="#ffeb3b" strokeWidth="4" fill="none" />,
    // Body
    <line key="body" x1="200" y1="180" x2="200" y2="230" stroke="#ffeb3b" strokeWidth="4" />,
    // Arms
    <line key="arm-left" x1="200" y1="200" x2="170" y2="220" stroke="#ffeb3b" strokeWidth="4" />,
    <line key="arm-right" x1="200" y1="200" x2="230" y2="220" stroke="#ffeb3b" strokeWidth="4" />,
    // Legs
    <line key="leg-left" x1="200" y1="230" x2="170" y2="260" stroke="#ffeb3b" strokeWidth="4" />,
    <line key="leg-right" x1="200" y1="230" x2="230" y2="260" stroke="#ffeb3b" strokeWidth="4" />,
  ];

  return (
    <svg height="300" width="300" viewBox="0 0 300 300" style={styles.figureContainer}>
      {parts.slice(0, wrongGuesses)}
    </svg>
  );
};


// --- Main App Component ---
const App = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const wrongGuesses = guessedLetters.filter(letter => !word.includes(letter)).length;
  const maxWrongGuesses = 10; // Corresponds to the number of hangman parts

  const isWinner = word && word.split('').every(letter => guessedLetters.includes(letter));
  const isLoser = wrongGuesses >= maxWrongGuesses;
  const isGameOver = isWinner || isLoser;

  // Function to fetch a new word
  const fetchWord = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setGuessedLetters([]);
    // Using a free, no-key-required API for random words
    fetch('https://random-word-api.herokuapp.com/word?number=1')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setWord(data[0].toLowerCase());
        } else {
          throw new Error('No word received from API');
        }
      })
      .catch(err => {
        console.error("API Error:", err);
        setError('Could not fetch a word. Please try again.');
        setWord('react'); // Fallback word
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Fetch a word on initial component mount
  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  // Handler for letter guesses
  const handleGuess = useCallback((letter) => {
    if (!guessedLetters.includes(letter) && !isGameOver) {
      setGuessedLetters(prevLetters => [...prevLetters, letter]);
    }
  }, [guessedLetters, isGameOver]);

  // Keyboard event handler
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (key.match(/^[a-z]$/)) {
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handleGuess]);


  // --- Render Logic ---

  const renderWord = () => {
    if (isLoading) return <p style={styles.loadingText}>Finding a good word...</p>;
    if (error) return <p style={styles.errorText}>{error}</p>;

    return (
      <div style={styles.wordContainer}>
        {word.split('').map((letter, index) => (
          <span key={index} style={styles.letter}>
            {guessedLetters.includes(letter) || isLoser ? letter : '_'}
          </span>
        ))}
      </div>
    );
  };

  const renderKeyboard = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return (
      <div style={styles.keyboard}>
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || isGameOver}
            style={styles.key}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  const renderStatus = () => {
    if (!isGameOver) return null;
    const message = isWinner ? 'You Won!' : 'You Lost!';
    const wordReveal = `The word was: ${word}`;
    return (
      <div style={styles.statusOverlay}>
        <div style={styles.statusBox}>
          <h2>{message}</h2>
          <p>{wordReveal}</p>
          <button style={styles.playAgainButton} onClick={fetchWord}>Play Again</button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>React Hangman</h1>
      <p style={styles.subtitle}>Can you guess the word?</p>
      
      <div style={styles.gameArea}>
        <div style={styles.figureAndWord}>
           <HangmanFigure wrongGuesses={wrongGuesses} />
           {renderWord()}
        </div>
        
        <div style={styles.controls}>
          <div style={styles.guesses}>
            Incorrect Guesses: {wrongGuesses} / {maxWrongGuesses}
          </div>
          {renderKeyboard()}
        </div>
      </div>

      {renderStatus()}
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#1a202c', // Dark blue-gray
    color: '#e2e8f0', // Light gray
    minHeight: '100vh',
    padding: '20px',
  },
  title: {
    fontSize: '3rem',
    color: '#a0aec0', // Medium gray
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#718096', // Gray
    marginBottom: '2rem',
  },
  gameArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  figureAndWord: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  figureContainer: {
    maxWidth: '300px',
  },
  wordContainer: {
    display: 'flex',
    gap: '10px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    minHeight: '50px', // Prevent layout shift
  },
  letter: {
    width: '40px',
    textAlign: 'center',
    borderBottom: '4px solid #4a5568', // Darker gray
    textTransform: 'uppercase',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    maxWidth: '600px',
  },
  guesses: {
    fontSize: '1.2rem',
    color: '#a0aec0',
  },
  keyboard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  key: {
    width: '40px',
    height: '40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#e2e8f0',
    backgroundColor: '#2d3748', // Darker blue-gray
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
    textTransform: 'uppercase',
  },
  statusOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBox: {
    backgroundColor: '#2d3748',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '2px solid #4a5568',
  },
  playAgainButton: {
    marginTop: '20px',
    padding: '12px 24px',
    fontSize: '1.2rem',
    color: '#1a202c',
    backgroundColor: '#63b3ed', // Blue
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  loadingText: {
      fontSize: '1.5rem',
      color: '#a0aec0',
  },
  errorText: {
      fontSize: '1.5rem',
      color: '#f56565', // Red
  }
};

export default App;
