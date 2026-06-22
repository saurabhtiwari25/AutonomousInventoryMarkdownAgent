import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import InventoryUpload from './pages/InventoryUpload'
import InventoryList from './pages/InventoryList'
import Analysis from './pages/Analysis'
import AgentMonitor from './pages/AgentMonitor'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Help from './pages/Help'

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="app-topbar">
          <h1>Autonomous Inventory & Markdown Agent</h1>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<InventoryUpload />} />
          <Route path="/inventory-list" element={<InventoryList />} />
          <Route path="/analyze" element={<Analysis />} />
          <Route path="/monitor" element={<AgentMonitor />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
