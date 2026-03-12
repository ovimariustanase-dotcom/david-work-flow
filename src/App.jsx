import { useState } from 'react'

function App() {
  const [gameCode, setGameCode] = useState('')

  const handleJoin = () => {
    if (gameCode.length > 0) {
      alert(`Te alături jocului: ${gameCode}`)
    } else {
      alert('Te rugăm să introduci un cod valid.')
    }
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
