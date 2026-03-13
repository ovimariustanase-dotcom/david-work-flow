import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const LEVELS_COUNT = 20
const CHALLENGES_PER_LEVEL = 10

const BADGES = [
  { id: 'recruit', name: 'Recrut 🕵️', minLevel: 1 },
  { id: 'apprentice', name: 'Ucenic 📜', minLevel: 3 },
  { id: 'specialist', name: 'Specialist 🔍', minLevel: 5 },
  { id: 'decoder', name: 'Decodor 🔓', minLevel: 7 },
  { id: 'tactician', name: 'Tactician 🧠', minLevel: 9 },
  { id: 'operative', name: 'Operativ 🎖️', minLevel: 12 },
  { id: 'elite', name: 'Agent Elită 👑', minLevel: 15 },
  { id: 'legend', name: 'Legendă 🏆', minLevel: 20 }
]

// Helper pentru a genera placeholder-e pentru restul de 200 de provocări
const generateGameData = () => {
  const baseLevels = [
    {
      id: 1,
      title: 'Baza de Date',
      challenges: [
        { q: '1, 3, 7, 15, 31, ?', a: '63', h: '(n*2)+1' },
        { q: 'Codul binar pentru 2?', a: '10', h: 'Calcul binar' },
        { q: 'A=1, B=2, C=? ', a: '3', h: 'Alfabet' },
        { q: '2+2*2=?', a: '6', h: 'Ordinea operațiilor' },
        { q: 'Câte bit-uri sunt într-un byte?', a: '8', h: 'Unități de măsură' },
        { q: 'Rădăcina pătrată din 144?', a: '12', h: 'Mate' },
        { q: '10, 20, 30, ?', a: '40', h: 'Secvență simplă' },
        { q: 'Primul număr prim?', a: '2', h: 'Mate' },
        { q: 'Dacă 5x = 25, x=?', a: '5', h: 'Algebră' },
        { q: 'Următorul în serie: 2, 4, 8, ?', a: '16', h: 'Puteri ale lui 2' }
      ]
    },
    // Restul nivelelor vor fi generate procedural pentru demo
  ]

  for (let i = 2; i <= LEVELS_COUNT; i++) {
    baseLevels.push({
      id: i,
      title: `Misiunea ${i}`,
      challenges: Array.from({ length: CHALLENGES_PER_LEVEL }, (_, idx) => ({
        q: `Provocarea ${idx + 1} de la Nivelul ${i}: Cât este ${i} + ${idx}?`,
        a: `${i + idx}`,
        h: 'Adunare simplă pentru demo'
      }))
    })
  }
  return baseLevels
}

const gameData = generateGameData()

function App() {
  const [screen, setScreen] = useState('accounts') // 'accounts' | 'map' | 'puzzle' | 'victory'
  const [accounts, setAccounts] = useState(() => JSON.parse(localStorage.getItem('escape_accounts') || '[]'))
  const [activeAccount, setActiveAccount] = useState(null)
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0)
  const [puzzleInput, setPuzzleInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(720)
  const [showAnswer, setShowAnswer] = useState(false)

  const [roomCode, setRoomCode] = useState('')
  const [activeRoom, setActiveRoom] = useState(null)
  const [notifications, setNotifications] = useState([])

  // Sincronizare Supabase pentru Multiplayer
  useEffect(() => {
    if (!activeRoom) return

    const channel = supabase
      .channel(`room-${activeRoom}`)
      .on('broadcast', { event: 'progress_update' }, ({ payload }) => {
        addNotification(`${payload.userName} a rezolvat L${payload.level} C${payload.challenge}!`)
        // Actualizăm progresul echipei dacă este cazul (colaborativ)
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [activeRoom])

  const addNotification = (msg) => {
    setNotifications(prev => [...prev.slice(-4), { id: Date.now(), msg }])
  }

  const broadcastProgress = (userName, level, challenge) => {
    if (!activeRoom) return
    supabase.channel(`room-${activeRoom}`).send({
      type: 'broadcast',
      event: 'progress_update',
      payload: { userName, level, challenge }
    })
  }

  useEffect(() => {
    localStorage.setItem('escape_accounts', JSON.stringify(accounts))
  }, [accounts])

  const createAccount = (name) => {
    if (!name) return
    const newAcc = { 
      name, 
      id: Date.now(), 
      unlockedLevel: 1, 
      unlockedChallenge: 1, 
      score: 0, 
      badges: [] 
    }
    setAccounts([...accounts, newAcc])
  }

  const selectAccount = (acc) => {
    setActiveAccount(acc)
    setScore(acc.score)
    setCurrentLevelIdx(acc.unlockedLevel - 1)
    setCurrentChallengeIdx(acc.unlockedChallenge - 1)
    setScreen('map')
  }

  const handleSolve = () => {
    const level = gameData[currentLevelIdx]
    const challenge = level.challenges[currentChallengeIdx]

    if (puzzleInput.trim() === challenge.a) {
      const bonus = timeLeft * 5
      const newScore = score + bonus
      setScore(newScore)
      
      let nextL = currentLevelIdx
      let nextC = currentChallengeIdx + 1

      if (nextC >= CHALLENGES_PER_LEVEL) {
        nextL++
        nextC = 0
      }

      if (nextL >= LEVELS_COUNT) {
        setScreen('victory')
      } else {
        broadcastProgress(activeAccount.name, currentLevelIdx + 1, currentChallengeIdx + 1)
        
        setCurrentLevelIdx(nextL)
        setCurrentChallengeIdx(nextC)
        setPuzzleInput('')
        setTimeLeft(720)
        setShowAnswer(false)

        // Badge check
        const earnedBadges = BADGES.filter(b => (nextL + 1) >= b.minLevel).map(b => b.name)

        // Update persistence
        const updatedAccs = accounts.map(a => a.id === activeAccount.id ? {
          ...a,
          score: newScore,
          badges: earnedBadges,
          unlockedLevel: Math.max(a.unlockedLevel, nextL + 1),
          unlockedChallenge: nextL + 1 > a.unlockedLevel ? nextC + 1 : Math.max(a.unlockedChallenge, nextC + 1)
        } : a)
        setAccounts(updatedAccs)
      }
    } else {
      alert('Cod incorect!')
    }
  }

  if (screen === 'accounts') {
    return (
      <div className="card">
        <h1>Selectează <span className="accent-text">Agentul</span></h1>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {accounts.map(acc => (
            <button key={acc.id} onClick={() => selectAccount(acc)} className="btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                <span style={{ fontWeight: 800 }}>{acc.name}</span>
                <span className="accent-text">Scor: {acc.score}</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {acc.badges?.map((b, i) => <span key={i} title={b} style={{ fontSize: '1.2rem' }}>{b.split(' ').pop()}</span>)}
              </div>
            </button>
          ))}
          <div className="input-group" style={{ marginTop: '20px' }}>
            <input 
              type="text" 
              placeholder="Nume Agent Nou" 
              id="new-agent-name"
              onKeyDown={(e) => e.key === 'Enter' && createAccount(e.target.value)}
            />
            <button className="btn-primary" onClick={() => createAccount(document.getElementById('new-agent-name').value)}>Adaugă</button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'map') {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <div className="header">
          <h1>Harta <span className="accent-text">Misiunilor</span></h1>
          <p>Agent: {activeAccount.name} | Scor: {score}</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Cod Cameră (Ex: BETA)" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', flex: 1 }}
            />
            <button onClick={() => setActiveRoom(roomCode)} className="btn-primary" style={{ padding: '8px 15px' }}>{activeRoom ? 'Conectat ✓' : 'Intră Online'}</button>
          </div>
          <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0, 243, 255, 0.1)', border: '1px solid var(--neon-blue)', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--neon-blue)', fontWeight: 800 }}>
              🎯 OBIECTIV CURENT: NIVEL {activeAccount.unlockedLevel} - PROVOCAREA {activeAccount.unlockedChallenge}/10
            </span>
          </div>
        </div>

        {/* Notifications Layer */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div key={n.id} style={{ background: 'rgba(57, 255, 20, 0.9)', color: 'black', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', animation: 'slideIn 0.3s ease-out' }}>
              {n.msg}
            </div>
          ))}
        </div>

        <div className="mission-map">
          {gameData.map((level, lIdx) => {
            const isLocked = lIdx + 1 > activeAccount.unlockedLevel
            return (
              <div 
                key={level.id} 
                className={`level-node ${isLocked ? 'locked' : ''} ${currentLevelIdx === lIdx ? 'active' : ''}`}
                onClick={() => !isLocked && setCurrentLevelIdx(lIdx)}
              >
                <div className="level-number">{level.id}</div>
                <div className="level-checkpoints">
                  {level.challenges.map((_, cIdx) => (
                    <div key={cIdx} className={`dot ${ (lIdx + 1 < activeAccount.unlockedLevel || (lIdx + 1 === activeAccount.unlockedLevel && cIdx + 1 < activeAccount.unlockedChallenge)) ? 'done' : ''}`} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <button className="btn-primary" style={{ marginTop: '30px' }} onClick={() => setScreen('puzzle')}>Continuă Misiunea</button>
        <button className="btn-secondary" style={{ marginTop: '10px' }} onClick={() => setScreen('accounts')}>Schimbă Agentul</button>
      </div>
    )
  }

  if (screen === 'puzzle') {
    const level = gameData[currentLevelIdx]
    const challenge = level.challenges[currentChallengeIdx]
    return (
      <div className="card puzzle-card">
        <div className="game-status">
          <div className="stat">⏳ {timeLeft}s</div>
          <div className="stat">⭐ {score}</div>
        </div>
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <span className="badge" style={{ fontSize: '1rem', padding: '8px 20px', background: 'var(--neon-blue)', color: 'black' }}>
               NIVEL {currentLevelIdx + 1} - PROVOCAREA {currentChallengeIdx + 1}/10
            </span>
          </div>
          <h1>Evasion <span className="accent-text">Mode</span></h1>
          <p style={{ fontWeight: 600, color: 'var(--neon-green)' }}>{level.title}</p>
          <p>Rezolvă puzzle-ul pentru a debloca următorul segment.</p>
        </div>

        <div className="puzzle-box">
          <p className="riddle">{challenge.q}</p>
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Introduceți răspunsul" 
            value={puzzleInput}
            onChange={(e) => setPuzzleInput(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSolve}>
            Decrypt
          </button>
        </div>

        <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={() => setScreen('map')}>Harta Misiunilor</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h1>Misiune <span className="accent-text">Finalizată</span></h1>
      <p>Felicitări, Agent {activeAccount.name}!</p>
      <div className="score-display">Scor Total: {score}</div>
      <button className="btn-primary" onClick={() => setScreen('accounts')}>Meniu Principal</button>
    </div>
  )
}

export default App
