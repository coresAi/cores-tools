import { useState, useEffect, useRef, Link } from 'react'

function CodeDiffTool() {
  const [leftCode, setLeftCode] = useState('')
  const [rightCode, setRightCode] = useState('')
  const [diffResult, setDiffResult] = useState(null)
  const [mode, setMode] = useState('char')
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  const computeDiff = () => {
    if (!leftCode && !rightCode) {
      setDiffResult({ error: '请输入要对比的代码' })
      return
    }

    const left = leftCode.split('\n')
    const right = rightCode.split('\n')
    const result = []

    const maxLines = Math.max(left.length, right.length)
    
    for (let i = 0; i < maxLines; i++) {
      const leftLine = left[i] || ''
      const rightLine = right[i] || ''
      
      if (leftLine === rightLine) {
        result.push({ type: 'equal', left: leftLine, right: rightLine, lineNum: i + 1 })
      } else if (!left[i] && left[i] !== '0') {
        result.push({ type: 'add', left: '', right: rightLine, lineNum: i + 1 })
      } else if (!right[i] && right[i] !== '0') {
        result.push({ type: 'remove', left: leftLine, right: '', lineNum: i + 1 })
      } else {
        if (mode === 'char') {
          const leftChars = leftLine.split('')
          const rightChars = rightLine.split('')
          const maxChars = Math.max(leftChars.length, rightChars.length)
          const charDiff = []
          
          for (let j = 0; j < maxChars; j++) {
            if (leftChars[j] === rightChars[j]) {
              charDiff.push({ type: 'equal', char: leftChars[j] })
            } else {
              charDiff.push({ type: 'change', left: leftChars[j] || '', right: rightChars[j] || '' })
            }
          }
          result.push({ 
            type: 'change', 
            left: leftLine, 
            right: rightLine, 
            lineNum: i + 1,
            charDiff 
          })
        } else {
          result.push({ type: 'change', left: leftLine, right: rightLine, lineNum: i + 1 })
        }
      }
    }

    let added = 0, removed = 0, unchanged = 0
    result.forEach(r => {
      if (r.type === 'add') added++
      else if (r.type === 'remove') removed++
      else unchanged++
    })

    setDiffResult({ result, stats: { added, removed, unchanged } })
  }

  const clearAll = () => {
    setLeftCode('')
    setRightCode('')
    setDiffResult(null)
  }

  const swapCodes = () => {
    const temp = leftCode
    setLeftCode(rightCode)
    setRightCode(temp)
    setDiffResult(null)
  }

  useEffect(() => {
    if (leftCode || rightCode) {
      computeDiff()
    }
  }, [leftCode, rightCode, mode])

  return (
    <div className="container">
      <Link to="/" className="back-link">← 返回首页</Link>
      
      <h1>🔄 代码对比工具</h1>
      
      <div className="diff-controls">
        <div className="mode-switch">
          <label>对比模式：</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="char">字符级对比</option>
            <option value="line">行级对比</option>
          </select>
        </div>
        <div className="action-buttons">
          <button onClick={swapCodes} title="交换左右代码">⇄ 交换</button>
          <button onClick={clearAll} className="clear-btn">🗑️ 清空</button>
        </div>
      </div>

      <div className="diff-inputs">
        <div className="code-input">
          <div className="code-header">代码 A (原始)</div>
          <textarea
            ref={leftRef}
            value={leftCode}
            onChange={(e) => setLeftCode(e.target.value)}
            placeholder="粘贴要对比的代码..."
            spellCheck={false}
          />
        </div>
        <div className="code-input">
          <div className="code-header">代码 B (修改后)</div>
          <textarea
            ref={rightRef}
            value={rightCode}
            onChange={(e) => setRightCode(e.target.value)}
            placeholder="粘贴要对比的代码..."
            spellCheck={false}
          />
        </div>
      </div>

      {diffResult && diffResult.stats && (
        <div className="diff-stats">
          <span className="stat add">+{diffResult.stats.added} 行</span>
          <span className="stat remove">-{diffResult.stats.removed} 行</span>
          <span className="stat equal">={diffResult.stats.unchanged} 行</span>
        </div>
      )}

      {diffResult?.error && (
        <div className="error">{diffResult.error}</div>
      )}

      {diffResult?.result && (
        <div className="diff-result">
          <div className="diff-header">
            <span>行号</span>
            <span>代码 A</span>
            <span>代码 B</span>
          </div>
          {diffResult.result.map((line, idx) => (
            <div key={idx} className={`diff-line ${line.type}`}>
              <span className="line-num">{line.lineNum}</span>
              <span className="line-code left">
                {line.type === 'add' ? '' : line.left}
              </span>
              <span className="line-code right">
                {line.type === 'remove' ? '' : line.right}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CodeDiffTool
