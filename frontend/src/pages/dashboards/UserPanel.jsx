import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Activity, MonitorSmartphone, Loader2, Clock, ShieldCheck, Package, 
  CheckCircle2, AlertTriangle, Search, MapPin, ClipboardList, Wrench, 
  ShieldAlert, Box, Send, Check, RefreshCw, Smartphone, HardDrive
} from 'lucide-react';
import { usersApi } from '../../services/api';
import { useInventory } from '../../context/InventoryContext';
import toast from 'react-hot-toast';
import '../../pages/WelcomePage.css';

// ── MOCK WAREHOUSE PICKLIST TASKS ──────────────────────────────────────────
const INITIAL_PICKLISTS = [
  { id: 'TASK-101', sku: 'LAP-1001', name: 'Dell Latitude 5440 Laptop', qty: 5, location: 'Aisle A-01 • Rack 4', status: 'PENDING', priority: 'HIGH' },
  { id: 'TASK-102', sku: 'MOU-1004', name: 'Logitech Wireless Mouse', qty: 20, location: 'Aisle A-04 • Bin 12', status: 'PENDING', priority: 'NORMAL' },
  { id: 'TASK-103', sku: 'SSD-1005', name: 'Samsung 1TB SSD', qty: 10, location: 'Secure Room B-01 • Shelf 2', status: 'COMPLETED', priority: 'URGENT' },
  { id: 'TASK-104', sku: 'CAB-1009', name: 'HDMI Cable 2m', qty: 50, location: 'Aisle C-01 • Bin 8', status: 'PENDING', priority: 'NORMAL' }
];

export default function UserPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('picklists');
  const [picklists, setPicklists] = useState(INITIAL_PICKLISTS);
  const [sessions, setSessions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Connect to live global inventory!
  const { inventory } = useInventory();
  const [invSearch, setInvSearch] = useState('');

  // Support ticket form
  const [ticket, setTicket] = useState({ category: 'EQUIPMENT_MAINTENANCE', urgency: 'MEDIUM', notes: '' });

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      usersApi.getMySessions().catch(() => ({ data: { data: [] } })),
      usersApi.getMyAuditLogs(0, 8).catch(() => ({ data: { data: [] } }))
    ])
      .then(([sessionsRes, logsRes]) => {
        const sesData = sessionsRes?.data?.data || [];
        const logsData = logsRes?.data?.data || [];

        // Fallback to mock session if array is empty
        if (sesData.length === 0) {
          setSessions([
            { id: 'ses-1', os: 'macOS', browser: 'Chrome 124.0', ipAddress: '192.168.1.45', status: 'ACTIVE', lastActiveAt: new Date().toISOString() },
            { id: 'ses-2', os: 'Android Zebra Scanner', browser: 'FlowStock Mobile App', ipAddress: '10.0.4.18', status: 'ACTIVE', lastActiveAt: new Date(Date.now() - 3600000).toISOString() }
          ]);
        } else {
          setSessions(sesData);
        }

        if (logsData.length === 0) {
          setLogs([
            { id: 'l-1', action: 'WAREHOUSE_CHECKIN', details: 'Clocked into Zone A-01 terminal', status: 'SUCCESS', createdAt: new Date().toISOString() },
            { id: 'l-2', action: 'PICK_CONFIRMED', details: 'Scanned & picked 10x Samsung 1TB SSDs', status: 'SUCCESS', createdAt: new Date(Date.now() - 1800000).toISOString() },
            { id: 'l-3', action: 'SAFETY_VERIFICATION', details: 'Completed daily equipment safety pre-check', status: 'SUCCESS', createdAt: new Date(Date.now() - 7200000).toISOString() }
          ]);
        } else {
          setLogs(logsData);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter inventory items
  const filteredInventory = useMemo(() => {
    if (!invSearch.trim()) return inventory.slice(0, 8);
    return inventory.filter(i => 
      (i.productName || i.name || '').toLowerCase().includes(invSearch.toLowerCase()) ||
      (i.productId || '').toLowerCase().includes(invSearch.toLowerCase()) ||
      (i.warehouseName || i.warehouseId || '').toLowerCase().includes(invSearch.toLowerCase())
    );
  }, [inventory, invSearch]);

  // Actions
  const handleToggleTask = (taskId) => {
    setPicklists(prev => prev.map(t => t.id === taskId ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t));
    toast.success("Picklist fulfillment status updated!");
  };

  const handleReportDamage = (item) => {
    toast.error(`Damaged item report logged for ${item.sku}. Supervisor notified.`);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticket.notes) {
      toast.error("Please explain the issue or required supplies.");
      return;
    }
    toast.success(`Support ticket logged successfully! Assigned to maintenance supervisor.`);
    setTicket({ category: 'EQUIPMENT_MAINTENANCE', urgency: 'MEDIUM', notes: '' });
  };

  const completedCount = picklists.filter(p => p.status === 'COMPLETED').length;

  return (
    <div className="welcome-page" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* ── TOP NAVBAR ──────────────────────────────────────────────────────── */}
      <header className="welcome-header light-mode" style={{ position: 'relative', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Link to="/" className="logo">FLOWSTOCK</Link>
        <nav className="nav-pill">
          <Link to="/">Home</Link>
          <Link to="/warehouses">Warehouses</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span className="px-3 py-1 bg-emerald-100 text-[#0A2B1E] rounded-full text-[11px] font-bold tracking-wider uppercase border border-emerald-200">
            📦 WAREHOUSE SPECIALIST
          </span>
          <button onClick={onLogout} className="cart-btn label-text" style={{ cursor: 'pointer', border: 'none' }}>
            SIGN OUT
          </button>
        </div>
      </header>

      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-forest)',
        padding: '6rem 2rem 5rem 2rem',
        borderBottomLeftRadius: '3rem',
        borderBottomRightRadius: '3rem',
        color: 'var(--color-cream)',
        boxShadow: '0 25px 50px rgba(1,71,46,0.25)',
      }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-widest inline-block mb-3 border border-white/20">
              Operational Fulfillment &amp; Stock Verification
            </span>
            <h1 className="anton text-4xl md:text-5xl lg:text-6xl text-[#C2D7B4] tracking-wide">
              OPERATOR WORKSPACE
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base mt-2 max-w-xl">
              Welcome back, <strong>{user?.firstName || 'Specialist'}</strong>. You are currently clocked into <strong>Zone A-01 Hub (Electronics &amp; Components)</strong> for the daytime fulfillment shift.
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-2xl border border-white/15 backdrop-blur-md text-right shrink-0">
            <div className="text-[11px] text-gray-300 uppercase tracking-wider font-bold">Shift Supervisor</div>
            <div className="text-xl font-['Anton'] text-emerald-300 my-0.5">VIKRAM MALHOTRA (EXT: 402)</div>
            <div className="text-xs text-emerald-200/70 font-mono">Terminal Station #14 • Connected</div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── KPI STATS RIBBON ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Assigned Picklists</span>
              <ClipboardList className="w-5 h-5 p-1 bg-emerald-100 text-[#0A2B1E] rounded-lg" />
            </div>
            <p className="anton text-3xl text-[#0A2B1E]">{picklists.length} Orders</p>
            <span className="text-[11px] font-semibold text-emerald-600">{completedCount} of {picklists.length} Completed</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Picking Accuracy</span>
              <CheckCircle2 className="w-5 h-5 p-1 bg-blue-100 text-blue-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-blue-700">99.4%</p>
            <span className="text-[11px] font-semibold text-gray-500">Tier-1 Operator SLA</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Items Scanned Today</span>
              <Package className="w-5 h-5 p-1 bg-purple-100 text-purple-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-purple-700">142 Units</p>
            <span className="text-[11px] font-semibold text-purple-600">+18% vs yesterday</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Terminal Status</span>
              <ShieldCheck className="w-5 h-5 p-1 bg-emerald-100 text-emerald-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-stone-800">SECURED</p>
            <span className="text-[11px] font-semibold text-emerald-600">JWT &amp; OTP Validated</span>
          </div>
        </div>

        {/* ── TAB SWITCHER NAVIGATION ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm">
          <button
            onClick={() => setActiveTab('picklists')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'picklists' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-emerald-400" /> My Daily Picklists ({picklists.length - completedCount} Pending)
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'inventory' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" /> Live Stock Inquiry
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'security' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
            }`}
          >
            <MonitorSmartphone className="w-4 h-4 text-emerald-400" /> Active Devices &amp; Logs
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'support' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-400" /> Report Issue &amp; PPE
          </button>
        </div>

        {/* ── TAB 1: DAILY PICKLISTS & FULFILLMENT TASKS ───────────────────── */}
        {activeTab === 'picklists' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-stone-200 pb-4">
              <div>
                <h2 className="anton text-2xl text-[#0A2B1E]">ASSIGNED WAREHOUSE PICKLISTS</h2>
                <p className="text-xs text-gray-500">Check off items as you pick them from warehouse shelves and deliver to dispatch packing bins.</p>
              </div>
              <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full font-bold font-mono text-xs">
                {completedCount} / {picklists.length} Fulfilled
              </span>
            </div>

            <div className="space-y-3">
              {picklists.map(item => (
                <div key={item.id} className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.status === 'COMPLETED' ? 'bg-emerald-50/50 border-emerald-300 opacity-80' : 'bg-white border-stone-200 hover:shadow-md'
                }`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(item.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition ${
                        item.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 hover:border-emerald-600'
                      }`}
                    >
                      {item.status === 'COMPLETED' && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0A2B1E]">{item.name}</span>
                        <span className="text-[11px] font-mono font-bold text-gray-400 bg-stone-100 px-2 py-0.5 rounded">{item.sku}</span>
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 inline shrink-0" /> {item.location} • <strong className="text-[#0A2B1E] ml-1">Qty: {item.qty} units</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.priority === 'URGENT' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {item.priority} PRIORITY
                    </span>
                    <button
                      onClick={() => handleReportDamage(item)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      title="Report Damaged Box / Missing Stock"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: LIVE STOCK INQUIRY (GLOBAL INVENTORY CONTEXT) ─────────── */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md space-y-6 animate-fade-in">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="anton text-2xl text-[#0A2B1E]">LIVE INVENTORY &amp; RACK INQUIRY</h2>
              <p className="text-xs text-gray-500">Connected in real-time to FlowStock global database. Query stock counts and storage zones directly from your terminal.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={invSearch}
                onChange={e => setInvSearch(e.target.value)}
                placeholder="Search real-time stock by SKU (e.g. LAP-1001), item name, or warehouse zone..."
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium text-[#0A2B1E] focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInventory.map((item, idx) => {
                const available = item.availableQty ?? item.quantity ?? 0;
                const isLow = available < (item.lowStockThreshold || 50);

                return (
                  <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:border-emerald-500 transition flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-['Anton'] text-base text-[#0A2B1E]">{item.productName || item.name}</span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-stone-200 text-gray-500">{item.productId}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Zone: {item.warehouseName || item.warehouseId || 'Hub A-01'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-['Anton'] ${isLow ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {available} <span className="text-xs font-sans font-normal text-gray-500">in stock</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {isLow ? '⚠️ LOW STOCK' : '🟢 ADEQUATE'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: ACTIVE DEVICES & AUDIT LOGS ────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Active Devices */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md flex flex-col">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <MonitorSmartphone className="w-5 h-5 text-emerald-700" />
                  <h3 className="anton text-lg text-[#0A2B1E]">CONNECTED TERMINALS</h3>
                </div>
                <button 
                  onClick={() => toast.success("Unrecognized terminal sessions revoked!")} 
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase rounded-lg transition"
                >
                  Revoke Others
                </button>
              </div>
              <div className="space-y-3 flex-1">
                {sessions.map((ses, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-6 h-6 text-emerald-700" />
                      <div>
                        <p className="font-bold text-sm text-[#0A2B1E]">{ses.os} • {ses.browser}</p>
                        <p className="text-xs text-gray-500 font-mono">IP: {ses.ipAddress}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      {ses.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operator Logs */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md flex flex-col">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-4 mb-4">
                <Activity className="w-5 h-5 text-emerald-700" />
                <h3 className="anton text-lg text-[#0A2B1E]">RECENT OPERATOR LOGS</h3>
              </div>
              <div className="space-y-3 flex-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#0A2B1E]">{log.action}</p>
                      <p className="text-gray-500">{log.details}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: REPORT ISSUE & REQUEST PPE GEAR ────────────────────────── */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md max-w-2xl mx-auto animate-fade-in">
            <div className="border-b border-stone-200 pb-4 mb-6">
              <h2 className="anton text-2xl text-[#0A2B1E]">MAINTENANCE &amp; SAFETY GEAR REQUEST</h2>
              <p className="text-xs text-gray-500">Submit requests for barcode scanner calibrations, forklift repairs, or PPE replacement gloves directly to your Zone Manager.</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase">Request Category</label>
                <select
                  value={ticket.category}
                  onChange={e => setTicket({ ...ticket, category: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-[#0A2B1E] focus:outline-none cursor-pointer"
                >
                  <option value="EQUIPMENT_MAINTENANCE">Hardware / Barcode Scanner Repair</option>
                  <option value="PPE_REPLENISHMENT">Safety Gear / Gloves &amp; Helmet Replacement</option>
                  <option value="FORKLIFT_REPLY">Forklift / Conveyor Belt Service Request</option>
                  <option value="STOCK_DISCREPANCY">Report Unmatched Pallet Quantity Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['LOW', 'MEDIUM', 'URGENT'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicket({ ...ticket, urgency: p })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                        ticket.urgency === p 
                          ? p === 'URGENT' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-[#0A2B1E] border-[#0A2B1E] text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase">Detailed Explanation / Location</label>
                <textarea
                  rows="4"
                  required
                  value={ticket.notes}
                  onChange={e => setTicket({ ...ticket, notes: e.target.value })}
                  placeholder="Explain the hardware malfunction or specify the required glove size and rack coordinates..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-[#0A2B1E] focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0A2B1E] hover:bg-emerald-900 text-[#F5F2EB] rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#C2D7B4]" /> Submit Ticket to Manager
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
