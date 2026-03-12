import { useState, useEffect } from 'react'

function App() {
  const [gameCode, setGameCode] = useState('')
  const [screen, setScreen] = useState('login') // 'login' | 'puzzle' | 'hunt' | 'victory'
  const [puzzleInput, setPuzzleInput] = useState('')
  const [huntFound, setHuntFound] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 de secunde per nivel

  const handleJoin = () => {
    if (gameCode.toUpperCase() === 'AGENT007') {
      setScreen('puzzle')
      setScore(0)
      setTimeLeft(60)
    } else if (gameCode.length > 0) {
      alert(`Codul ${gameCode} este valid, dar pentru demo folosește AGENT007`)
      setScreen('puzzle')
      setScore(0)
      setTimeLeft(60)
    } else {
      alert('Te rugăm să introduci un cod valid.')
    }
  }

  const handleSolve = () => {
    if (puzzleInput === '32') {
      setScore(prev => prev + (timeLeft * 10))
      setScreen('hunt')
      setTimeLeft(60) // Reset timer for next level
    } else {
      alert('Cod incorect! Mai încearcă. Hint: Puterile lui 2.')
    }
  }

  const handleCapture = () => {
    setHuntFound(true)
    setScore(prev => prev + (timeLeft * 15))
    setTimeout(() => {
      setScreen('victory')
    }, 1500)
  }

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (screen === 'victory') {
    return (
      <div className="card victory-card">
        <div className="victory-icon">🏆</div>
        <h1>Misiune <span className="accent-text">Împlinită</span></h1>
        <p>Ai finalizat toate nivelele cu succes!</p>
        <div className="score-display">Scorul tău final: <span className="neon-text">{score}</span></div>
        <div style={{ marginTop: '30px' }}>
          <button className="btn-primary" onClick={() => setScreen('login')}>
            Joacă din nou
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'hunt') {
    return (
      <div className="card hunt-card">
        <div className="game-status">
          <div className="stat">⏳ {timeLeft}s</div>
          <div className="stat">⭐ {score}</div>
        </div>
        <div className="header">
          <span className="badge">Nivel 2: Explorare</span>
          <h1>Vânătoarea <span className="accent-text">de Comori</span></h1>
          <p>Trebuie să găsești un obiect din lumea reală!</p>
        </div>

        <div className="puzzle-box">
          <p className="riddle">Obiectul de găsit:</p>
          <div className="clue-text">"Ceva <span className="neon-text">ROȘU</span> care poate să zboare."</div>
          <p style={{ marginTop: '10px', fontSize: '0.8rem' }}>(Ex: O jucărie, o poză cu o pasăre, un fruct)</p>
        </div>

        <div className="capture-area">
          {!huntFound ? (
            <button className="btn-primary camera-btn" onClick={handleCapture}>
              📸 Fă o Poză
            </button>
          ) : (
            <div className="success-msg">
              <span style={{ fontSize: '2rem' }}>🎯</span>
              <p>Poză analizată cu succes! Perfect.</p>
            </div>
          )}
        </div>

        <button className="btn-secondary" onClick={() => setScreen('login')} style={{ marginTop: '20px', background: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}>
          &larr; Abandonează Misiunea
        </button>
      </div>
    )
  }

  if (screen === 'puzzle') {
    return (
      <div className="card puzzle-card">
        <div className="game-status">
          <div className="stat">⏳ {timeLeft}s</div>
          <div className="stat">⭐ {score}</div>
        </div>
        <div className="header">
          <span className="badge">Nivel 1: Criptografie</span>
          <h1>Escape <span className="accent-text">Room</span></h1>
          <p>Descifrează codul pentru a debloca ușa digitală:</p>
        </div>

        <div className="puzzle-box">
          <p className="riddle">Care este următorul număr în șirul spionilor?</p>
          <div className="sequence">2, 4, 8, 16, <span className="neon-text">?</span></div>
        </div>

        <div className="input-group">
          <input 
            type="number" 
            placeholder="Introdu codul de 2 cifre" 
            value={puzzleInput}
            onChange={(e) => setPuzzleInput(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSolve}>
            Verifică Codul
          </button>
        </div>

        <button className="btn-secondary" onClick={() => setScreen('login')} style={{ marginTop: '20px', background: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}>
          &larr; Înapoi la meniu
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="header">
        <h1>Scavenger <span className="accent-text">Hunt</span></h1>
        <p>Introdu codul secret pentru a începe misiunea.</p>
      </div>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Codul Jocului (ex: AGENT007)" 
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <button className="btn-primary" onClick={handleJoin}>
          Începe Misiunea
        </button>
      </div>

      <div className="footer-link">
        Ești Organizator? <span>Găzduiește un joc</span>
      </div>
    </div>
  )
}

export default App
