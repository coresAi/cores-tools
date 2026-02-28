import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import TimestampTool from './pages/timestamp'
import CodeDiffTool from './pages/code-diff'
import './App.css'

function Home() {
  const tools = [
    { path: 'timestamp', name: '🕐', title: '时间戳转换', desc: '时间戳与日期互转' },
    { path: 'code-diff', name: '🔄', title: '代码对比', desc: '对比两段代码的差异' },
  ]

  return (
    <div className="container">
      <h1>🛠️ Cores Tools</h1>
      <p className="subtitle">常用在线工具集合</p>
      
      <div className="tools-grid">
        {tools.map(tool => (
          <Link to={tool.path} key={tool.path} className="tool-card">
            <div className="tool-icon">{tool.name}</div>
            <div className="tool-title">{tool.title}</div>
            <div className="tool-desc">{tool.desc}</div>
          </Link>
        ))}
      </div>

      <footer className="home-footer">
        <p>点击上方卡片开始使用工具</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timestamp/*" element={<TimestampTool />} />
        <Route path="/code-diff/*" element={<CodeDiffTool />} />
      </Routes>
    </HashRouter>
  )
}

export default App
