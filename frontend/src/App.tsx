import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import CitizenReport from './pages/CitizenReport'
import Layout from './components/layout/Layout'
import Overview from './pages/operations/Overview'
import Intelligence from './pages/operations/Intelligence'
import Analytics from './pages/analytics/Analytics'
import LiveWeather from './pages/operations/LiveWeather'
import Reports from './pages/operations/Reports'
import Verification from './pages/operations/Verification'
import Events from './pages/operations/Events'
import Alerts from './pages/operations/Alerts'
import DataSources from './pages/system/DataSources'
import SystemStatus from './pages/system/SystemStatus'
import { CloudLightning, Radar, ShieldCheck, Search } from 'lucide-react'

function Home() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => setHealthStatus(data.status))
      .catch((err) => setHealthStatus('error: ' + err.message))
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
            <CloudLightning className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          NWIP <br/>
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-6">
          NATIONAL WEATHER INTELLIGENCE PLATFORM
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Real-time weather event intelligence for India.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/report" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-medium transition-colors text-sm flex items-center gap-2">
            <Radar className="w-4 h-4" />
            <span>Submit Citizen Report</span>
          </Link>
          <Link to="/report" onClick={() => {
              // Add a small delay so state can be set after navigation if we had a global store, 
              // but for now we'll just link to /report. We can pass state in React Router.
          }} state={{ activeTab: 'track' }} className="bg-card hover:bg-muted text-foreground border border-border px-8 py-3 rounded-md font-medium transition-colors text-sm flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Track Report Status</span>
          </Link>
          <Link to="/admin/dashboard" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3 rounded-md font-medium transition-colors text-sm border border-border flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Command Center Login</span>
          </Link>
        </div>

        <div className="inline-flex items-center space-x-2 bg-card rounded-full px-4 py-1.5 border border-border shadow-sm text-xs">
          <div className={`w-2 h-2 rounded-full ${healthStatus === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`}></div>
          <span className="font-medium text-muted-foreground">
            System Status: {healthStatus === 'ok' ? 'All Systems Operational' : (healthStatus || 'Connecting...')}
          </span>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<CitizenReport />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin/dashboard" element={<Layout><Overview /></Layout>} />
        <Route path="/admin/intelligence" element={<Layout><Intelligence /></Layout>} />
        <Route path="/admin/analytics" element={<Layout><Analytics /></Layout>} />
        
        <Route path="/admin/live-weather" element={<Layout><LiveWeather /></Layout>} />
        <Route path="/admin/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/admin/events" element={<Layout><Events /></Layout>} />
        <Route path="/admin/verification" element={<Layout><Verification /></Layout>} />
        <Route path="/admin/alerts" element={<Layout><Alerts /></Layout>} />
        <Route path="/admin/regional-trends" element={<Layout><div className="p-6 text-muted-foreground">Regional Trends - Coming Soon</div></Layout>} />
        <Route path="/admin/hazard-trends" element={<Layout><div className="p-6 text-muted-foreground">Hazard Trends - Coming Soon</div></Layout>} />
        <Route path="/admin/data-sources" element={<Layout><DataSources /></Layout>} />
        <Route path="/admin/system-status" element={<Layout><SystemStatus /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

