import { useState } from 'react'

function App() {
  const [gameCode, setGameCode] = useState('')
  const [screen, setScreen] = useState('login') // 'login' | 'puzzle' | 'victory'
  const [puzzleInput, setPuzzleInput] = useState('')

  const handleJoin = () => {
    if (gameCode.toUpperCase() === 'AGENT007') {
      setScreen('puzzle')
    } else if (gameCode.length > 0) {
      alert(`Codul ${gameCode} este valid, dar pentru demo folosește AGENT007`)
      setScreen('puzzle')
    } else {
      alert('Te rugăm să introduci un cod valid.')
    }
  }

  const handleSolve = () => {
    if (puzzleInput === '32') {
      setScreen('victory')
    } else {
      alert('Cod incorect! Mai încearcă. Hint: Puterile lui 2.')
    }
  }

  if (screen === 'victory') {
    return (
      <div className="card victory-card">
        <h1>Misiune <span className="accent-text">Împlinită</span></h1>
        <p>Ai evadat cu succes din prima cameră!</p>
        <div style={{ marginTop: '30px' }}>
          <button className="btn-primary" onClick={() => setScreen('login')}>
            Joacă din nou
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'puzzle') {
    return (
      <div className="card puzzle-card">
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
