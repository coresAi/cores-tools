import { useState } from 'react'
import { Link } from 'react-router-dom'

function JsonFormatTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [options, setOptions] = useState({ indent: 2, sortKeys: false })

  const format = () => {
    try {
      let parsed = JSON.parse(input)
      if (options.sortKeys) {
        parsed = sortKeys(parsed)
      }
      setOutput(JSON.stringify(parsed, null, options.indent))
      setError('')
    } catch (e) {
      setError('JSON格式错误：' + e.message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError('JSON格式错误：' + e.message)
      setOutput('')
    }
  }

  const sortKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sortKeys)
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).sort().reduce((result, key) => {
        result[key] = sortKeys(obj[key])
        return result
      }, {})
    }
    return obj
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← 返回工具首页</Link>
      
      <div className="tool-page">
        <div className="tool-header">
          <h1>📄 JSON 格式化工具</h1>
        </div>

        <div className="tool-content">
          <div className="options-bar">
            <label>
              缩进：
              <select value={options.indent} onChange={(e) => setOptions({...options, indent: Number(e.target.value)})}>
                <option value={2}>2 空格</option>
                <option value={4}>4 空格</option>
                <option value={0}>无缩进</option>
              </select>
            </label>
            <label>
              <input type="checkbox" checked={options.sortKeys} onChange={(e) => setOptions({...options, sortKeys: e.target.checked})} />
              排序键名
            </label>
          </div>

          <div className="two-column">
            <div className="column-box">
              <div className="column-header">输入 JSON</div>
              <div className="column-content">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="粘贴 JSON 到这里..."
                />
              </div>
            </div>

            <div className="column-box">
              <div className="column-header">格式化结果</div>
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
            <button onClick={format}>格式化</button>
            <button onClick={minify}>压缩</button>
            <button className="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>清空</button>
            {output && <button className="secondary" onClick={() => copyToClipboard(output)}>复制结果</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonFormatTool
