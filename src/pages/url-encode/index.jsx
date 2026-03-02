import { useState } from 'react'
import { Link } from 'react-router-dom'

function UrlEncodeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode')

  const process = () => {
    if (mode === 'encode') {
      setOutput(encodeURIComponent(input))
    } else {
      try {
        setOutput(decodeURIComponent(input))
      } catch (e) {
        setOutput('解码失败：' + e.message)
      }
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
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
          <h1>🔗 URL 编解码工具</h1>
        </div>

        <div className="tool-content">
          <div className="tabs">
            <button className={mode === 'encode' ? 'active' : ''} onClick={() => { setMode('encode'); }}>编码</button>
            <button className={mode === 'decode' ? 'active' : ''} onClick={() => { setMode('decode'); }}>解码</button>
          </div>

          <div className="two-column">
            <div className="column-box">
              <div className="column-header">{mode === 'encode' ? '输入原文' : '输入 URL 编码'}</div>
              <div className="column-content">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? '输入要 URL 编码的文本...' : '输入 URL 编码字符串...'}
                />
              </div>
            </div>

            <div className="column-box">
              <div className="column-header">{mode === 'encode' ? '编码结果' : '解码结果'}</div>
              <div className="column-content">
                <textarea
                  value={output}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="action-row" style={{ marginTop: '24px' }}>
            <button onClick={process}>{mode === 'encode' ? '编码' : '解码'}</button>
            <button className="secondary" onClick={swap}>↑↓ 交换</button>
            <button className="secondary" onClick={() => { setInput(''); setOutput(''); }}>清空</button>
            {output && <button className="secondary" onClick={() => copyToClipboard(output)}>复制结果</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UrlEncodeTool
