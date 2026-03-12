import { useState, useEffect } from 'react'

function App() {
  const [gameCode, setGameCode] = useState('')
  const [screen, setScreen] = useState('login') // 'login' | 'puzzle' | 'victory'
  const [currentLevel, setCurrentLevel] = useState(0)
  const [puzzleInput, setPuzzleInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  const levels = [
    {
      id: 1,
      title: 'Nivel 1: Secvența Binara',
      description: 'Descifrează codul de acces la baza de date:',
      question: '1, 3, 7, 15, 31, ?',
      answer: '63',
      hint: 'Formula: (n * 2) + 1'
    },
    {
      id: 2,
      title: 'Nivel 2: Misterul Familiei',
      description: 'Analizează raportul de filaj:',
      question: 'Un spion are 4 frați. Fiecare frate are o soră. Câți copii sunt în total?',
      answer: '6',
      hint: 'Gândește-te la sora lor comună.'
    },
    {
      id: 3,
      title: 'Nivel 3: Codul Alpha',
      description: 'Decodifică mesajul interceptat:',
      question: 'Dacă A=1, B=2, C=3... care este suma literelor din cuvântul "SPY"?',
      answer: '60',
      hint: 'S(19) + P(16) + Y(25) = ?'
    }
  ]

  const handleJoin = () => {
    const normalizedCode = gameCode.trim().toUpperCase()
    if (normalizedCode === 'AGENT007') {
      setScreen('puzzle')
      setCurrentLevel(0)
      setScore(0)
      setTimeLeft(60)
      setPuzzleInput('')
    } else if (normalizedCode.length > 0) {
      alert(`Codul ${normalizedCode} este valid, dar pentru demo folosește AGENT007`)
      setScreen('puzzle')
      setCurrentLevel(0)
      setScore(0)
      setTimeLeft(60)
      setPuzzleInput('')
    } else {
      alert('Te rugăm să introduci un cod valid (ex: AGENT007).')
    }
  }

  const handleSolve = () => {
    if (puzzleInput.trim() === levels[currentLevel].answer) {
      const bonus = timeLeft * 10
      setScore(prev => prev + bonus)
      
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(prev => prev + 1)
        setPuzzleInput('')
        setTimeLeft(60)
      } else {
        setScreen('victory')
      }
    } else {
      alert(`Cod incorect! Indiciu: ${levels[currentLevel].hint}`)
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
    const level = levels[currentLevel]
    return (
      <div className="card puzzle-card">
        <div className="game-status">
          <div className="stat">⏳ {timeLeft}s</div>
          <div className="stat">⭐ {score}</div>
        </div>
        <div className="header">
          <span className="badge">{level.title}</span>
          <h1>Escape <span className="accent-text">Room</span></h1>
          <p>{level.description}</p>
        </div>

        <div className="puzzle-box">
          <p className="riddle">{level.question}</p>
          {currentLevel === 0 && <div className="sequence">1, 3, 7, 15, 31, <span className="neon-text">?</span></div>}
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Introdu răspunsul" 
            value={puzzleInput}
            onChange={(e) => setPuzzleInput(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSolve}>
            Verifică Codul
          </button>
        </div>

        <div style={{ marginTop: '15px', fontSize: '0.8rem', opacity: 0.5 }}>
          Progres: {currentLevel + 1} / {levels.length}
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
