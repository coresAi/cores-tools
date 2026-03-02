import { useState } from 'react'
import { Link } from 'react-router-dom'

function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode')
  const [error, setError] = useState('')

  const process = () => {
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch (e) {
      setError(mode === 'decode' ? 'Base64 解码失败，请检查输入是否正确' : '编码失败')
      setOutput('')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
    setError('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← 返回工具首页</Link>
      
      <div className="tool-page">
        <div className="tool-header">
          <h1>🔐 Base64 编解码工具</h1>
        </div>

        <div className="tool-content">
          <div className="tabs">
            <button className={mode === 'encode' ? 'active' : ''} onClick={() => { setMode('encode'); setError(''); }}>编码</button>
            <button className={mode === 'decode' ? 'active' : ''} onClick={() => { setMode('decode'); setError(''); }}>解码</button>
          </div>

          <div className="two-column">
            <div className="column-box">
              <div className="column-header">{mode === 'encode' ? '输入原文' : '输入 Base64'}</div>
              <div className="column-content">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'}
                />
              </div>
            </div>

            <div className="column-box">
              <div className="column-header">{mode === 'encode' ? '编码结果' : '解码结果'}</div>
              <div className="column-content">
                <textarea
                  value={error || output}
                  readOnly
                  style={error ? { color: '#ef4444' } : {}}
                />
              </div>
            </div>
          </div>

          <div className="action-row" style={{ marginTop: '24px' }}>
            <button onClick={process}>{mode === 'encode' ? '编码' : '解码'}</button>
            <button className="secondary" onClick={swap}>↑↓ 交换</button>
            <button className="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>清空</button>
            {output && <button className="secondary" onClick={() => copyToClipboard(output)}>复制结果</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Base64Tool
