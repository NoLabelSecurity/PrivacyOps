import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Database, 
  FileText, 
  Settings, 
  Users, 
  ChevronRight,
  Bell,
  Search,
  User,
  Sparkles,
  MessageSquare,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (Array.isArray(data)) setAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/alerts/${id}/read`, { method: 'PATCH' });
      fetchAlerts();
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-200 font-sans overflow-hidden">
      {/* Sidebar - Geometric Balance implementation */}
      <aside className="w-64 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">P</div>
          <span className="text-xl font-bold tracking-tight text-white leading-none">PrivacyOps</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 px-3 font-semibold">Main Menu</div>
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<FileText size={18} />} 
            label="Privacy Requests" 
            active={activeTab === 'requests'} 
            onClick={() => setActiveTab('requests')} 
          />
          <SidebarItem 
            icon={<Activity size={18} />} 
            label="Compliance Monitor" 
            active={activeTab === 'consent'} 
            onClick={() => setActiveTab('consent')} 
          />
          <SidebarItem 
            icon={<MessageSquare size={18} />} 
            label="AI Assistant" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
          <SidebarItem 
            icon={<Database size={18} />} 
            label="Audit Logs" 
            active={activeTab === 'audit'} 
            onClick={() => setActiveTab('audit')} 
          />
          
          <div className="pt-8 text-[10px] uppercase tracking-widest text-zinc-500 mb-4 px-3 font-semibold">Infrastructure</div>
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="API Configuration" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center bg-[#09090b]/40">
          <span>v2.4.1-stable</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-500 font-medium">ONLINE</span>
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#09090b]">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-zinc-100 italic">PrivacyOps // {activeTab.toUpperCase()}</h2>
            <span className="bg-zinc-800/50 text-zinc-500 text-[9px] px-2 py-0.5 rounded border border-zinc-800 font-mono hidden md:block uppercase tracking-widest">Global Telemetry Enabled</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 w-64 group focus-within:border-blue-500/50 transition-all">
              <Search size={14} className="text-zinc-500 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search auditor logs..." 
                className="bg-transparent border-none outline-none ml-2 text-[10px] w-full text-zinc-300 placeholder-zinc-700 font-mono"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                className="text-zinc-500 hover:text-zinc-100 transition-colors relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-950"></span>
                )}
              </button>
              
              <AnimatePresence>
                {isAlertsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                  >
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-widest">System Alerts</span>
                      {unreadCount > 0 && <Badge variant="overdue" className="px-1.5">{unreadCount} NEW</Badge>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? (
                        alerts.map((alert) => (
                          <div 
                            key={alert.id}
                            className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors cursor-default ${!alert.read ? 'bg-blue-500/5' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div className="space-y-1">
                                <p className={`text-[11px] leading-relaxed ${alert.read ? 'text-zinc-500' : 'text-zinc-200 font-medium'}`}>
                                  {alert.message}
                                </p>
                                <p className="text-[9px] text-zinc-600 font-mono">
                                  {new Date(alert.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {!alert.read && (
                                <button 
                                  onClick={(e) => markRead(alert.id, e)}
                                  className="text-[9px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-tighter"
                                >
                                  Mark
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center opacity-30">
                          <Bell size={24} className="mx-auto mb-2" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Clear Horizons</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-zinc-900/30 text-center">
                      <button className="text-[9px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest">View All Notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-6">
              <div className="text-right">
                <div className="text-xs font-medium text-zinc-200 uppercase tracking-tighter">Senior DPO</div>
                <div className="text-[9px] text-zinc-500 font-mono">Admin: 0x71f2e</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-zinc-700 ring-2 ring-zinc-950 flex items-center justify-center shadow-lg">
                <User size={14} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && ( <DashboardView /> )}
            {activeTab === 'requests' && ( <PrivacyRequestsView /> )}
            {activeTab === 'ai' && ( <AIAssistantView /> )}
            {activeTab === 'audit' && ( <AuditLogsView /> )}
            {activeTab === 'design' && ( <DesignSystemView /> )}
          </AnimatePresence>
        </div>
      </main>

      <FloatingAssistant />
    </div>
  );
}

import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Badge } from './components/ui/Badge';
import { Table, THead, TBody, TH, TD, TR } from './components/ui/Table';
import { Skeleton } from './components/ui/Skeleton';

function DesignSystemView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-12 pb-20"
    >
      <section>
        <h2 className="text-2xl font-bold mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="danger">Danger Action</Button>
          <Button variant="ghost">Ghost Action</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Badges</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="pending">Pending</Badge>
          <Badge variant="completed">Completed</Badge>
          <Badge variant="overdue">Overdue</Badge>
          <Badge variant="system">System</Badge>
          <Badge variant="default">Default</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
          <Input label="Search Logs" placeholder="e.g. metadata_scan_01" />
          <Input label="Email Address" type="email" placeholder="privacy@company.com" error="Valid DPO email required" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card 
            title="Privacy Audit" 
            subtitle="GLOBAL REGULATORY COMPLIANCE STATUS" 
            footer={<Button variant="ghost" size="sm">Download PDF</Button>}
          >
            <p className="text-sm text-zinc-400">All data sources are mapped and compliant with GDPR Article 32.</p>
          </Card>
          <Card title="Quick Action">
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Start a new privacy impact assessment.</p>
              <Button className="w-full">Initialize PIA</Button>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Data Tables</h2>
        <Table>
          <THead>
            <TH>Request ID</TH>
            <TH>Subject</TH>
            <TH>Status</TH>
            <TH>Timeline</TH>
          </THead>
          <TBody>
            <tr>
              <TD>DSAR-2024-001</TD>
              <TD>Michael Chen</TD>
              <TD><Badge variant="pending">Pending</Badge></TD>
              <TD>14 Days Left</TD>
            </tr>
            <tr>
              <TD>DSAR-2024-002</TD>
              <TD>Sarah Smith</TD>
              <TD><Badge variant="completed">Completed</Badge></TD>
              <TD>Archived</TD>
            </tr>
          </TBody>
        </Table>
      </section>
    </motion.div>
  );
}

function DashboardView() {
  const [metrics, setMetrics] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(setMetrics)
      .catch(console.error);
  }, []);

  if (!metrics) return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );

  const COLORS = ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Overview Console</h2>
          <p className="text-zinc-500 text-sm mt-1">Operational state of globally mapped data assets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">EXPORT DATA</Button>
          <Button size="sm">INITIATE SCAN</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="TOTAL REQUESTS" value={metrics.total} change="All time volume" color="blue" />
        <StatCard label="PENDING DSARS" value={metrics.pending} change={`${metrics.pending} active sessions`} color="indigo" />
        <StatCard label="OVERDUE" value={metrics.overdue} change="Exceeding tolerance" color="red" />
        <StatCard label="AVG PROCESSING" value={`${metrics.avgProcessingTime}d`} change="Target: < 30 days" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Traffic Map" subtitle="REQUEST VOLUMES OVER LAST 7 DAYS">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', color: '#e4e4e7' }}
                  labelStyle={{ fontSize: '10px', color: '#71717a', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Status Allocation" subtitle="GLOBAL DATA SUBJECT STATE DISTRIBUTION">
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', color: '#e4e4e7' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {metrics.statusData.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-0 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 tracking-wide uppercase">Operational logs</h3>
            <button className="text-[10px] text-blue-500 hover:text-blue-400 font-bold uppercase tracking-wider">Historical View</button>
          </div>
          <div className="p-2">
            <RecentActivity />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert size={80} />
            </div>
            <h3 className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-4">Critical Deadlines</h3>
            <div className="space-y-3 relative z-10">
              <UpcomingDeadlines />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{role: string, text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = { role: 'user', text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message,
          history: chat.map(c => ({
            role: c.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: c.text }]
          }))
        })
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error) {
      console.error(error);
      setChat(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting to the privacy brain." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="mb-4 w-96 h-[520px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-zinc-800"
          >
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-[10px]">AI</div>
                <span className="font-bold text-xs tracking-widest text-zinc-300 uppercase">Privacy Intelligence</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <ChevronRight size={18} className="rotate-90" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-90">
              {chat.length === 0 && (
                <div className="text-center mt-20">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-500">
                    <ShieldAlert size={24} />
                  </div>
                  <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">Query Database</p>
                  <p className="text-zinc-600 text-[10px] mt-1">GDPR / CCPA / DPA Support Ready</p>
                </div>
              )}
              {chat.map((c, i) => (
                <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    c.role === 'user' 
                      ? 'bg-blue-600 text-white font-medium border border-blue-500 shadow-lg shadow-blue-900/20' 
                      : 'bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono'
                  }`}>
                    {c.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-1.5 items-center pl-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query semantic engine..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-blue-500/50 font-mono transition-all pr-12"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1.5 bg-blue-600 p-1.5 rounded-md hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-zinc-950 border border-zinc-800 hover:border-blue-600 hover:text-blue-500 bg-gradient-to-tr from-zinc-950 to-zinc-900 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all hover:scale-105 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <ShieldAlert size={24} className="relative z-10 transition-colors" />
      </button>
    </div>
  );
}

function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/dsars')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((d: any) => ({
          title: `DSAR ${d.type} INITIATED`,
          desc: `Identity ${d.subjectName} confirmed. Status set to ${d.status}.`,
          time: '2m ago',
          status: d.status
        }));
        setActivities(formatted);
      })
      .catch(() => {});
  }, []);

  if (activities.length === 0) {
    return (
      <>
        <ActivityItem title="NEW ACCESS REQUEST" desc="Data subject confirmation required for GDPR Art. 15 ticket." time="2h ago" />
        <ActivityItem title="SYSTEM SCAN COMPLETE" desc="Infrastructure audit identified 3 unmapped PII vectors." time="5h ago" />
        <ActivityItem title="POLICY VERSION UPGRADE" desc="Cookie Consent Policy v2.4.1 deployed to edge." time="1d ago" />
      </>
    );
  }

  return (
    <>
      {activities.map((a, i) => (
        <ActivityItem key={i} title={a.title} desc={a.desc} time={a.time} />
      ))}
    </>
  );
}

function UpcomingDeadlines() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <ShieldAlert size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-zinc-300">REQ-2024-{i}01</p>
            <p className="text-[10px] text-zinc-500 font-mono tracking-tight">EOD - {i * 2} DAYS REMAINING</p>
          </div>
          <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
        </div>
      ))}
    </>
  );
}

function SidebarItem({ icon, label, active, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-zinc-800/50 text-blue-400 font-semibold border border-zinc-700/50' 
          : 'text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-300'
      }`}
    >
      <span className={`${active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
      {badge && (
        <span className="ml-auto bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, change, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-all">
      <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">{label}</div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className={`h-1 w-full bg-zinc-800 mt-2 rounded-full overflow-hidden`}>
        <div className={`h-full ${colorMap[color] || 'bg-blue-500'} transition-all duration-1000 w-3/4 group-hover:w-full`}></div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 font-medium">{change}</span>
      </div>
    </div>
  );
}

function ActivityItem({ title, desc, time }: any) {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-zinc-800/30 rounded-xl transition-colors group">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-zinc-200 tracking-wide uppercase">{title}</p>
          <span className="text-[10px] font-mono text-zinc-600">{time}</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-mono">{desc}</p>
      </div>
    </div>
  );
}

export interface AnalysisResult {
  summary: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedAction: string;
}

function PrivacyRequestsView() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [newRequest, setNewRequest] = useState({
    userEmail: '',
    requestType: 'ACCESS',
    notes: ''
  });

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/dsars');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreate = async () => {
    if (!newRequest.userEmail) return;
    setIsLoading(true);
    try {
      await fetch('/api/dsars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
      setIsModalOpen(false);
      setNewRequest({ userEmail: '', requestType: 'ACCESS', notes: '' });
      fetchRequests();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/dsars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnalyze = async (request: any) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestData: request })
      });
      const result = await res.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Privacy Requests</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage data access and deletion requests from users.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>New Request</Button>
      </div>

      <Table>
        <THead>
          <TH>Request ID</TH>
          <TH>User Email</TH>
          <TH>Type</TH>
          <TH>Status</TH>
          <TH>Deadline</TH>
          <TH>Actions</TH>
        </THead>
        <TBody>
          {requests.map((r) => (
            <tr key={r.id}>
              <TD className="text-zinc-500">{r.id.slice(0, 8)}...</TD>
              <TD>{r.userEmail}</TD>
              <TD>
                <Badge variant={r.requestType === 'DELETE' ? 'overdue' : 'system'}>
                  {r.requestType}
                </Badge>
              </TD>
              <TD>
                <Badge variant={r.status.toLowerCase() as any}>
                  {r.status}
                </Badge>
              </TD>
              <TD className={new Date(r.deadline) < new Date() ? 'text-red-500 font-bold' : ''}>
                {new Date(r.deadline).toLocaleDateString()}
              </TD>
              <TD>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleAnalyze(r)} disabled={isAnalyzing}>
                    <Sparkles size={12} className="mr-1 text-blue-400" />
                    AI Analyze
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, 'IN_PROGRESS')}>Process</Button>
                  <Button variant="ghost" size="sm" className="text-green-500" onClick={() => updateStatus(r.id, 'COMPLETED')}>Close</Button>
                </div>
              </TD>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <TD colSpan={6} className="text-center py-20">
                <div className="flex flex-col items-center opacity-40">
                  <FileText className="mb-4" size={48} />
                  <p className="text-sm font-bold uppercase tracking-widest">No Active Requests</p>
                  <p className="text-[10px] mt-1">Subject mapping system ready for telemetry.</p>
                </div>
              </TD>
            </tr>
          )}
        </TBody>
      </Table>

      <AnimatePresence>
        {analysisResult && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setAnalysisResult(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card 
                title="AI Risk Assessment" 
                subtitle="AUTOMATED PRIVACY IMPACT ANALYSIS"
                footer={<Button onClick={() => setAnalysisResult(null)} className="w-full">Dismiss Analysis</Button>}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Risk Level</span>
                    <Badge variant={analysisResult.riskLevel === 'HIGH' ? 'overdue' : analysisResult.riskLevel === 'MEDIUM' ? 'pending' : 'completed'}>
                      {analysisResult.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Executive Summary</span>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                      {analysisResult.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recommended Action</span>
                    <div className="flex items-start gap-3 text-sm text-blue-400 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                      <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                      <p>{analysisResult.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card title="New Privacy Request" subtitle="INITIATE FORMAL SUBJECT REQUEST">
                <div className="space-y-6">
                  <Input 
                    label="User Email" 
                    placeholder="subject@example.com"
                    value={newRequest.userEmail}
                    onChange={(e) => setNewRequest({...newRequest, userEmail: e.target.value})}
                  />
                  <div className="space-y-1.5 px-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Request Type</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-300 font-mono outline-none focus:border-blue-600/50 transition-all ring-offset-zinc-950"
                      value={newRequest.requestType}
                      onChange={(e) => setNewRequest({...newRequest, requestType: e.target.value})}
                    >
                      <option value="ACCESS">ACCESS (GDPR Art. 15)</option>
                      <option value="DELETE">DELETE (Right to Erasure)</option>
                      <option value="PORTABILITY">PORTABILITY</option>
                    </select>
                  </div>
                  <Input 
                    label="Additional Notes" 
                    placeholder="Optional details about context..."
                    value={newRequest.notes}
                    onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                  />
                  <div className="flex gap-4 pt-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={handleCreate} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Submit Request'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">System Audit logs</h2>
          <p className="text-zinc-500 font-medium">IMMUTABLE COMPLIANCE TRAIL</p>
        </div>
        <Badge variant="completed" className="px-3 py-1 font-mono tracking-tighter">INTEGRITY_VERIFIED</Badge>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <Table>
          <THead>
            <TH>Timestamp</TH>
            <TH>Action</TH>
            <TH>Entity</TH>
            <TH>Details</TH>
          </THead>
          <TBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TR key={i}>
                  <TD><Skeleton className="h-4 w-32" /></TD>
                  <TD><Skeleton className="h-4 w-24" /></TD>
                  <TD><Skeleton className="h-4 w-20" /></TD>
                  <TD><Skeleton className="h-4 w-full" /></TD>
                </TR>
              ))
            ) : logs.length > 0 ? (
              logs.map(log => (
                <TR key={log.id}>
                  <TD className="font-mono text-[10px] text-zinc-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </TD>
                  <TD>
                    <code className="bg-zinc-900 px-2 py-1 rounded text-blue-400 text-[10px] font-bold">
                      {log.action}
                    </code>
                  </TD>
                  <TD className="text-zinc-300 font-medium">{log.entity}</TD>
                  <TD className="text-zinc-500 italic max-w-md truncate">{log.details}</TD>
                </TR>
              ))
            ) : (
              <TR>
                <TD colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Database size={48} />
                    <span className="text-sm font-bold uppercase tracking-widest">No logs recorded</span>
                  </div>
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>
    </motion.div>
  );
}

function AIAssistantView() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Greeting. I am the PrivacyOps AI Assistant. How can I assist you with compliance or data subject requests today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection to AI kernel interrupted. Please retry.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-blue-500" size={24} />
        <h2 className="text-2xl font-bold text-white tracking-tight">AI Compliance Assistant</h2>
      </div>

      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
          <div className="flex gap-4">
            <input 
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none focus:border-blue-500/50 transition-all font-mono placeholder:text-zinc-700"
              placeholder="Ask about compliance policies, request handling, or legal frameworks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={isTyping}>
              <ChevronRight size={20} />
            </Button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-3 text-center uppercase tracking-widest font-bold">
            Powered by Gemini • Subject to privacy governance protocols
          </p>
        </div>
      </div>
    </motion.div>
  );
}
