import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

function TimestampTool() {
  const [searchParams] = useSearchParams()
  
  // 左侧：时间戳 → 日期
  const [tsInput, setTsInput] = useState('')
  const [tsResult, setTsResult] = useState(null)
  
  // 右侧：日期 → 时间戳
  const [dateInput, setDateInput] = useState('')
  const [dateResult, setDateResult] = useState(null)
  
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now()))

  // 支持URL参数快速填入（毫秒时间戳）
  useEffect(() => {
    const ts = searchParams.get('ts')
    if (ts) {
      setTsInput(ts)
    }
  }, [searchParams])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now()))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // 时间戳 → 日期
  const convertTsToDate = () => {
    let ts = parseInt(tsInput)
    if (isNaN(ts)) {
      setTsResult({ error: '请输入有效的数字' })
      return
    }
    // 统一按毫秒处理
    if (ts < 10000000000) {
      ts = ts * 1000
    }
    
    const date = new Date(ts)
    if (isNaN(date.getTime())) {
      setTsResult({ error: '无效的时间戳' })
      return
    }
    
    setTsResult({
      local: date.toLocaleString('zh-CN'),
      beijing: date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      utc: date.toUTCString(),
      unix: Math.floor(ts / 1000),
      unixMs: ts
    })
  }

  // 通过日期时间选择器转换
  const convertFromDatetime = (datetimeStr) => {
    const date = new Date(datetimeStr)
    if (!isNaN(date.getTime())) {
      const ts = date.getTime()
      setTsInput(String(ts))
      setTsResult({
        local: date.toLocaleString('zh-CN'),
        beijing: date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        utc: date.toUTCString(),
        unix: Math.floor(ts / 1000),
        unixMs: ts
      })
    }
  }

  // 自动转换（时间戳）
  useEffect(() => {
    if (tsInput) {
      convertTsToDate()
    }
  }, [tsInput])

  // 日期 → 时间戳
  const convertDateToTs = () => {
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) {
      setDateResult({ error: '请输入有效的日期格式' })
      return
    }
    setDateResult({
      unix: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      iso: date.toISOString()
    })
  }

  // 通过日期时间选择器转换
  const convertDateFromDatetime = (datetimeStr) => {
    const date = new Date(datetimeStr)
    if (!isNaN(date.getTime())) {
      setDateInput(datetimeStr)
      setDateResult({
        unix: Math.floor(date.getTime() / 1000),
        unixMs: date.getTime(),
        iso: date.toISOString()
      })
    }
  }

  // 自动转换（日期）
  useEffect(() => {
    if (dateInput) {
      convertDateToTs()
    }
  }, [dateInput])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(String(text))
  }

  const getNowDatetime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  // Refs for datetime inputs
  const tsDatetimeRef = useRef(null)
  const dateDatetimeRef = useRef(null)

  const openDatetimePicker = (ref) => {
    if (ref.current) {
      ref.current.showPicker?.() || ref.current.focus()
    }
  }

  return (
    <div className="container">
      <a href="#/" className="back-link">← 返回工具首页</a>
      
      <div className="tool-page">
        <div className="tool-header">
          <h1>🕐 时间戳转换工具</h1>
        </div>
        
        <div className="current-time-box">
          <span className="label">当前时间戳（毫秒）：</span>
          <span className="value">{currentTimestamp}</span>
          <button className="copy-btn" onClick={() => copyToClipboard(currentTimestamp)}>复制</button>
        </div>

        <div className="tool-content">
          <div className="ts-split-layout">
            {/* 左侧：时间戳 → 日期 */}
            <div className="ts-split-left">
              <div className="ts-split-title">时间戳 → 日期</div>
              <div className="ts-split-input-wrap">
                <input
                  type="text"
                  value={tsInput}
                  onChange={(e) => setTsInput(e.target.value)}
                  placeholder="输入毫秒时间戳，如：1698765432000"
                  className="ts-split-input"
                />
                <button className="ts-split-btn" onClick={() => setTsInput(String(currentTimestamp))}>当前时间</button>
                <button className="ts-split-btn ts-picker-btn" onClick={() => openDatetimePicker(tsDatetimeRef)}>选择时间</button>
                <input
                  type="datetime-local"
                  ref={tsDatetimeRef}
                  onChange={(e) => {
                    if (e.target.value) convertFromDatetime(e.target.value)
                  }}
                  className="ts-datetime-hidden"
                />
              </div>
              <div className="ts-split-result">
                {tsResult && (
                  <>
                    {tsResult.error ? (
                      <div className="ts-error">{tsResult.error}</div>
                    ) : (
                      <>
                        <div className="ts-result-item">
                          <span>本地时间</span>
                          <code>{tsResult.local}</code>
                          <button onClick={() => copyToClipboard(tsResult.local)}>复制</button>
                        </div>
                        <div className="ts-result-item">
                          <span>北京时间</span>
                          <code>{tsResult.beijing}</code>
                          <button onClick={() => copyToClipboard(tsResult.beijing)}>复制</button>
                        </div>
                        <div className="ts-result-item">
                          <span>UTC 时间</span>
                          <code>{tsResult.utc}</code>
                          <button onClick={() => copyToClipboard(tsResult.utc)}>复制</button>
                        </div>
                        <div className="ts-result-item">
                          <span>Unix 时间戳</span>
                          <code>{tsResult.unix}</code>
                          <button onClick={() => copyToClipboard(tsResult.unix)}>复制</button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 右侧：日期 → 时间戳 */}
            <div className="ts-split-right">
              <div className="ts-split-title">日期 → 时间戳</div>
              <div className="ts-split-input-wrap">
                <input
                  type="text"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  placeholder="输入日期，如：2024-01-01 12:00:00"
                  className="ts-split-input"
                />
                <button className="ts-split-btn" onClick={() => setDateInput(getNowDatetime())}>当前时间</button>
                <button className="ts-split-btn ts-picker-btn" onClick={() => openDatetimePicker(dateDatetimeRef)}>选择时间</button>
                <input
                  type="datetime-local"
                  ref={dateDatetimeRef}
                  onChange={(e) => {
                    if (e.target.value) convertDateFromDatetime(e.target.value)
                  }}
                  className="ts-datetime-hidden"
                />
              </div>
              <div className="ts-split-result">
                {dateResult && (
                  <>
                    {dateResult.error ? (
                      <div className="ts-error">{dateResult.error}</div>
                    ) : (
                      <>
                        <div className="ts-result-item">
                          <span>Unix 时间戳（秒）</span>
                          <code>{dateResult.unix}</code>
                          <button onClick={() => copyToClipboard(dateResult.unix)}>复制</button>
                        </div>
                        <div className="ts-result-item">
                          <span>Unix 时间戳（毫秒）</span>
                          <code>{dateResult.unixMs}</code>
                          <button onClick={() => copyToClipboard(dateResult.unixMs)}>复制</button>
                        </div>
                        <div className="ts-result-item">
                          <span>ISO8601</span>
                          <code>{dateResult.iso}</code>
                          <button onClick={() => copyToClipboard(dateResult.iso)}>复制</button>
                        </div>
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
