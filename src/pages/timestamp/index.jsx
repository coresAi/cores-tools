import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function TimestampTool() {
  const [searchParams] = useSearchParams()
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [inputValue, setInputValue] = useState('')
  const [output, setOutput] = useState(null)
  const [mode, setMode] = useState('timestampToDate')

  // 支持URL参数快速填入
  useEffect(() => {
    const ts = searchParams.get('ts')
    if (ts) {
      setInputValue(ts)
    }
    const date = searchParams.get('date')
    if (date) {
      setInputValue(date)
      setMode('dateToTimestamp')
    }
  }, [searchParams])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const convert = () => {
    if (mode === 'timestampToDate') {
      let ts = parseInt(inputValue)
      if (isNaN(ts)) {
        setOutput({ error: '请输入有效的数字' })
        return
      }
      if (ts > 9999999999) {
        ts = Math.floor(ts / 1000)
      }
      
      const date = new Date(ts * 1000)
      setOutput({
        date: date.toLocaleString('zh-CN'),
        iso: date.toISOString(),
        relative: date.toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'full' }),
        unix: ts,
        utc: date.toUTCString(),
        cn: date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      })
    } else {
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(String(text))
  }

  // 自动转换（当URL有参数时）
  useEffect(() => {
    if (inputValue) {
      convert()
    }
  }, [inputValue, mode])

  return (
    <div className="container">
      <a href="#/" className="back-link">← 返回工具首页</a>
      
      <div className="tool-page">
        <div className="tool-header">
          <h1>🕐 时间戳转换工具</h1>
        </div>
        
        <div className="current-time-box">
          <span className="label">当前时间戳：</span>
          <span className="value">{currentTimestamp}</span>
          <button className="copy-btn" onClick={() => copyToClipboard(currentTimestamp)}>复制</button>
        </div>

        <div className="tool-content">
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

          <div className="two-column">
            <div className="column-box">
              <div className="column-header">{mode === 'timestampToDate' ? '输入时间戳' : '输入日期时间'}</div>
              <div className="column-content">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={mode === 'timestampToDate' ? '例如：1704067200 或 1704067200000' : '例如：2024-01-01 12:00:00'}
                />
                <div className="quick-buttons" style={{ marginTop: '12px' }}>
                  <button onClick={() => { setInputValue(String(Math.floor(Date.now() / 1000))); setMode('timestampToDate'); }}>
                    当前时间戳
                  </button>
                  <button onClick={() => { setInputValue(new Date().toLocaleString('zh-CN')); setMode('dateToTimestamp'); }}>
                    当前日期时间
                  </button>
                </div>
              </div>
            </div>

            <div className="column-box">
              <div className="column-header">转换结果</div>
              <div className="column-content result-column">
                {output && (
                  <>
                    {output.error ? (
                      <div className="error">{output.error}</div>
                    ) : (
                      <>
                        {output.date && (
                          <div className="result-item">
                            <span>本地时间</span>
                            <code>{output.date}</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(output.date)}>复制</button>
                          </div>
                        )}
                        {output.cn && (
                          <div className="result-item">
                            <span>格式化</span>
                            <code>{output.cn}</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(output.cn)}>复制</button>
                          </div>
                        )}
                        {output.iso && (
                          <div className="result-item">
                            <span>ISO 格式</span>
                            <code>{output.iso}</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(output.iso)}>复制</button>
                          </div>
                        )}
                        {output.unix !== undefined && (
                          <div className="result-item">
                            <span>Unix 时间戳（秒）</span>
                            <code>{output.unix}</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(output.unix)}>复制</button>
                          </div>
                        )}
                        {output.unixMs && (
                          <div className="result-item">
                            <span>Unix 时间戳（毫秒）</span>
                            <code>{output.unixMs}</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(output.unixMs)}>复制</button>
                          </div>
                        )}
                        {output.utc && (
                          <div className="result-item">
                            <span>UTC 时间</span>
                            <code>{output.utc}</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(output.utc)}>复制</button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimestampTool
