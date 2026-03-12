import { useState, useEffect } from 'react'

function App() {
  const [gameCode, setGameCode] = useState('')
  const [screen, setScreen] = useState('login') // 'login' | 'puzzle' | 'victory'
  const [puzzleInput, setPuzzleInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 de secunde per nivel

  const handleJoin = () => {
    const normalizedCode = gameCode.trim().toUpperCase()
    if (normalizedCode === 'AGENT007') {
      setScreen('puzzle')
      setScore(0)
      setTimeLeft(60)
      setPuzzleInput('')
    } else if (normalizedCode.length > 0) {
      alert(`Codul ${normalizedCode} este valid, dar pentru demo folosește AGENT007`)
      setScreen('puzzle')
      setScore(0)
      setTimeLeft(60)
      setPuzzleInput('')
    } else {
      alert('Te rugăm să introduci un cod valid (ex: AGENT007).')
    }
  }

  const handleSolve = () => {
    if (puzzleInput.trim() === '32') {
      setScore(prev => prev + (timeLeft * 10))
      setScreen('victory')
    } else {
      alert('Cod incorect! Mai încearcă. Hint: 16 + 16 = ?')
    }
  }

  // Eliminăm handleCapture pentru că nu mai avem scavenger hunt


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
          <button className="btn-primary" onClick={() => {
            setScreen('login')
            setGameCode('')
            setPuzzleInput('')
          }}>
            Joacă din nou
          </button>
        </div>
      </div>
    )
  }

  // Nivelul hunt a fost eliminat la cererea utilizatorului

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
        <h1>Escape <span className="accent-text">Room</span></h1>
        <p>Introdu codul secret pentru a începe misiunea de evadare.</p>
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
