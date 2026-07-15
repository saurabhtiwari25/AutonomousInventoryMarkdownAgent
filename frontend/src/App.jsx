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
import { ModeToggle } from './components/mode-toggle'

function App() {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="relative h-[52px] border-b border-border flex items-center px-6 shrink-0">
          {/* Centered Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-tight text-foreground">
            Autonomous Inventory & Markdown Agent
          </h1>

          {/* Right Controls */}
          <div className="ml-auto flex items-center gap-3">
            <ModeToggle />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-muted-foreground">Online</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: '2.5rem 3rem' }}>
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
    </div>
  )
}

export default App;
