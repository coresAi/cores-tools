import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [inputValue, setInputValue] = useState('')
  const [output, setOutput] = useState(null)
  const [mode, setMode] = useState('timestampToDate') // 'timestampToDate' or 'dateToTimestamp'

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const convert = () => {
    if (mode === 'timestampToDate') {
      // Try to parse as timestamp (seconds or milliseconds)
      let ts = parseInt(inputValue)
      if (isNaN(ts)) {
        setOutput({ error: '请输入有效的数字' })
        return
      }
      // Detect if milliseconds (13 digits) or seconds (10 digits)
      if (ts > 9999999999) {
        ts = Math.floor(ts / 1000)
      }
      
      const date = new Date(ts * 1000)
      setOutput({
        date: date.toLocaleString('zh-CN'),
        iso: date.toISOString(),
        relative: date.toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'full' }),
        unix: ts,
        utc: date.toUTCString()
      })
    } else {
      // Date to timestamp
      const date = new Date(inputValue)
      if (isNaN(date.getTime())) {
        setOutput({ error: '请输入有效的日期格式，如: 2024-01-01 或 2024-01-01 12:00:00' })
        return
      }
      setOutput({
        unix: Math.floor(date.getTime() / 1000),
        unixMs: date.getTime(),
        iso: date.toISOString()
      })
    }
  }

  return (
    <div className="container">
      <h1>🕐 时间戳转换工具</h1>
      
      <div className="current-time">
        <span className="label">当前时间戳:</span>
        <span className="value">{currentTimestamp}</span>
      </div>

      <div className="converter">
        <div className="tabs">
          <button 
            className={mode === 'timestampToDate' ? 'active' : ''} 
            onClick={() => { setMode('timestampToDate'); setInputValue(''); setOutput(null); }}
          >
            时间戳 → 日期
          </button>
          <button 
            className={mode === 'dateToTimestamp' ? 'active' : ''} 
            onClick={() => { setMode('dateToTimestamp'); setInputValue(''); setOutput(null); }}
          >
            日期 → 时间戳
          </button>
        </div>

        <div className="input-group">
          <label>
            {mode === 'timestampToDate' ? '输入时间戳 (秒/毫秒):' : '输入日期时间:'}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={mode === 'timestampToDate' ? '例如: 1704067200 或 1704067200000' : '例如: 2024-01-01 12:00:00'}
          />
          <button onClick={convert}>转换</button>
        </div>

        {output && (
          <div className="result">
            {output.error ? (
              <div className="error">{output.error}</div>
            ) : (
              <>
                {output.date && <div className="result-item"><span>本地时间:</span><code>{output.date}</code></div>}
                {output.iso && <div className="result-item"><span>ISO:</span><code>{output.iso}</code></div>}
                {output.relative && <div className="result-item"><span>完整格式:</span><code>{output.relative}</code></div>}
                {output.unix !== undefined && <div className="result-item"><span>Unix时间戳(秒):</span><code>{output.unix}</code></div>}
                {output.unixMs && <div className="result-item"><span>Unix时间戳(毫秒):</span><code>{output.unixMs}</code></div>}
                {output.utc && <div className="result-item"><span>UTC:</span><code>{output.utc}</code></div>}
              </>
            )}
          </div>
        )}
      </div>

      <div className="quick-convert">
        <h3>常用快捷转换</h3>
        <div className="quick-buttons">
          <button onClick={() => { setInputValue(String(Math.floor(Date.now() / 1000))); setMode('timestampToDate'); }}>当前时间戳</button>
          <button onClick={() => { setInputValue(new Date().toISOString()); setMode('dateToTimestamp'); }}>当前日期时间</button>
        </div>
      </div>
    </div>
  )
}

export default App
