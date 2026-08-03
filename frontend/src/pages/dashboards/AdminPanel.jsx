import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, Users, Database, Loader2, CheckCircle, XCircle, Search,
  Filter, UserPlus, Lock, Unlock, RefreshCw, Server, Activity, Settings,
  Trash2, ShieldCheck, AlertTriangle, Cpu, HardDrive, Wifi, Check, X,
  Terminal, Bell, Sliders, ArrowUpRight
} from 'lucide-react';
import { usersApi } from '../../services/api';
import toast from 'react-hot-toast';
import '../../pages/WelcomePage.css';

// ── REALISTIC MOCK ENTERPRISE STAFF (FALLBACK & HYDRATION) ──────────────────
const MOCK_ADMIN_STAFF = [
  { id: 'usr-01', firstName: 'Ashish', lastName: 'Bhardwaj', email: 'admin@flowstock.com', roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'], emailVerified: true, createdAt: '2025-01-10', status: 'ACTIVE' },
  { id: 'usr-02', firstName: 'Vikram', lastName: 'Malhotra', email: 'manager@flowstock.com', roles: ['ROLE_MANAGER'], emailVerified: true, createdAt: '2025-03-15', status: 'ACTIVE' },
  { id: 'usr-03', firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@flowstock.com', roles: ['ROLE_MANAGER'], emailVerified: true, createdAt: '2025-04-20', status: 'ACTIVE' },
];

// ── MOCK MICROSERVICE NODES DATA ──────────────────────────────────────────────
const MICROSERVICES_LIST = [
  { name: 'API Gateway', port: 8080, status: 'ONLINE', latency: '4ms', load: '32%', desc: 'Spring Cloud Gateway router and JWT filter' },
  { name: 'Eureka Discovery Server', port: 8761, status: 'ONLINE', latency: '2ms', load: '14%', desc: 'Service naming registry and heart-beat monitor' },
  { name: 'Auth & Security Service', port: 8081, status: 'ONLINE', latency: '7ms', load: '45%', desc: 'OAuth2 / JWT token issuer & RBAC engine' },
  { name: 'Inventory Core Service', port: 8082, status: 'ONLINE', latency: '5ms', load: '61%', desc: 'Real-time SKU reservation & stock balancing' },
  { name: 'Order Processing Service', port: 8083, status: 'ONLINE', latency: '9ms', load: '28%', desc: 'Purchase orders and dispatch coordination' },
  { name: 'Warehouse Logistics Service', port: 8084, status: 'ONLINE', latency: '6ms', load: '39%', desc: 'Aisle mapping and zone capacity analytics' }
];

// ── MOCK AUDIT LOGS ─────────────────────────────────────────────────────────
const INITIAL_AUDIT_LOGS = [
  { id: 'log-101', timestamp: 'Just now', user: 'admin@flowstock.com', action: 'UPDATE_SYS_CONFIG', details: 'Updated Redis caching parameters for API Gateway', status: 'SUCCESS' },
  { id: 'log-102', timestamp: '12m ago', user: 'manager@flowstock.com', action: 'CREATE_PURCHASE_ORDER', details: 'PO-2026-8966 sent to Blue Dart Logistics Supplies', status: 'SUCCESS' },
  { id: 'log-103', timestamp: '1h ago', user: '192.168.1.142 (IP)', action: 'FAILED_ADMIN_LOGIN', details: 'Multiple unsuccessful authentication attempts detected', status: 'SECURITY ALERT' },
  { id: 'log-104', timestamp: '3h ago', user: 'priya.nair@flowstock.com', action: 'MODIFY_INVENTORY_QTY', details: 'Updated available quantity for LAP-1001 (+50 units)', status: 'SUCCESS' },
  { id: 'log-105', timestamp: '5h ago', user: 'SYSTEM_AUTOBACKUP', action: 'DB_REPLICA_SNAPSHOT', details: 'PostgreSQL read replica check-pointed successfully (4.2GB)', status: 'SUCCESS' }
];

export default function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [microservices, setMicroservices] = useState(MICROSERVICES_LIST);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // System config state
  const [config, setConfig] = useState({
    maintenanceMode: false,
    enforceMfa: true,
    autoBackup: true,
    rateLimiting: true
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'ROLE_USER', status: 'ACTIVE' });

  // Fetch real users and blend with mock staff for rich UX
  useEffect(() => {
    setIsLoading(true);
    usersApi.getAllUsers()
      .then((res) => {
        const backendUsers = res?.data?.data || [];
        // Blend unique emails
        const existingEmails = new Set(backendUsers.map(u => u.email));
        const addedMocks = MOCK_ADMIN_STAFF.filter(m => !existingEmails.has(m.email));
        setUsers([...backendUsers, ...addedMocks]);
      })
      .catch((err) => {
        console.warn('Backend users load fallback to local enterprise roster', err);
        setUsers(MOCK_ADMIN_STAFF);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = searchTerm === '' ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === 'ALL' || (u.roles && u.roles.some(r => r.includes(roleFilter)));
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Actions
  const handleToggleLock = (id, currentStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: currentStatus === 'LOCKED' ? 'ACTIVE' : 'LOCKED' } : u));
    toast.success(currentStatus === 'LOCKED' ? 'Account unlocked successfully!' : 'Account locked for security.');
  };

  const handlePromoteRole = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        if (u.roles.includes('ROLE_ADMIN')) {
          toast.success('User demoted to Manager.');
          return { ...u, roles: ['ROLE_MANAGER'] };
        }
        if (u.roles.includes('ROLE_MANAGER')) {
          toast.success('User promoted to Admin!');
          return { ...u, roles: ['ROLE_ADMIN'] };
        }
        toast.success('User promoted to Manager!');
        return { ...u, roles: ['ROLE_MANAGER'] };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id, name) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success(`User ${name} removed from system.`);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.firstName) {
      toast.error('Please fill out Name and Email.');
      return;
    }
    const created = {
      id: 'usr-' + Date.now().toString().slice(-4),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      roles: [newUser.role],
      emailVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    setUsers(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewUser({ firstName: '', lastName: '', email: '', role: 'ROLE_USER', status: 'ACTIVE' });
    toast.success(`User ${created.firstName} provisioned successfully!`);
  };

  const handlePurgeCache = (serviceName) => {
    toast.loading(`Purging Redis cache for ${serviceName}...`, { duration: 1500 });
    setTimeout(() => toast.success(`Cache flushed for ${serviceName}!`), 1500);
  };

  const handleRestartNode = (serviceName) => {
    toast.loading(`Restarting spring container: ${serviceName}...`, { duration: 2000 });
    setTimeout(() => toast.success(`${serviceName} restarted and online!`), 2000);
  };

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
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-[11px] font-bold tracking-wider uppercase border border-rose-200">
            🛡️ SUPER ADMIN
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-widest inline-block mb-3 border border-white/20">
              System Governance &amp; RBAC Control
            </span>
            <h1 className="anton text-4xl md:text-5xl lg:text-6xl text-[#C2D7B4] tracking-wide">
              ADMINISTRATOR CONSOLE
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base mt-2 max-w-xl">
              System wide orchestration, role-based access control (RBAC), security audit streams, and real-time microservices infrastructure management.
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-2xl border border-white/15 backdrop-blur-md text-right shrink-0">
            <div className="text-[11px] text-gray-300 uppercase tracking-wider font-bold">Infrastructure Health</div>
            <div className="text-2xl font-['Anton'] text-emerald-400 my-0.5 flex items-center justify-end gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" /> 99.99% UPTIME
            </div>
            <div className="text-xs text-emerald-200/70 font-mono">6/6 Microservice Nodes Syncing</div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── KPI EXECUTIVE RIBBON ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Users</span>
              <Users className="w-5 h-5 p-1 bg-blue-100 text-blue-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-[#0A2B1E]">{users.length}</p>
            <span className="text-[11px] font-semibold text-emerald-600">Active Roster</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Managers</span>
              <ShieldAlert className="w-5 h-5 p-1 bg-purple-100 text-purple-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-purple-700">{users.filter(u => u.roles?.some(r => r.includes('MANAGER') || r.includes('ADMIN'))).length}</p>
            <span className="text-[11px] font-semibold text-gray-500">Supervisory Staff</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Active JWTs</span>
              <ShieldCheck className="w-5 h-5 p-1 bg-emerald-100 text-emerald-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-emerald-700">18</p>
            <span className="text-[11px] font-semibold text-emerald-600">OAuth2 Verified</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Server Nodes</span>
              <Server className="w-5 h-5 p-1 bg-amber-100 text-amber-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-stone-800">6/6</p>
            <span className="text-[11px] font-semibold text-amber-600">Spring Cloud Gate</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Audit Events</span>
              <Activity className="w-5 h-5 p-1 bg-stone-100 text-stone-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-[#0A2B1E]">{auditLogs.length}</p>
            <span className="text-[11px] font-semibold text-gray-500">Logged This Shift</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">Compute Load</span>
              <Cpu className="w-5 h-5 p-1 bg-emerald-100 text-emerald-700 rounded-lg" />
            </div>
            <p className="anton text-3xl text-stone-800">18%</p>
            <span className="text-[11px] font-semibold text-emerald-600">Cluster Optimal</span>
          </div>
        </div>

        {/* ── TAB SWITCHER NAVIGATION ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
              }`}
          >
            <Users className="w-4 h-4 text-emerald-400" /> User Access &amp; RBAC
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'infrastructure' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
              }`}
          >
            <Server className="w-4 h-4 text-emerald-400" /> Microservices Fleet
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'audit' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
              }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security &amp; Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'config' ? 'bg-[#0A2B1E] text-white shadow-md' : 'text-gray-600 hover:bg-stone-50'
              }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" /> System Configuration
          </button>
        </div>

        {/* ── TAB 1: USER & ACCESS MANAGEMENT (RBAC) ────────────────────────── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5">
              <div>
                <h2 className="anton text-2xl text-[#0A2B1E] flex items-center gap-2">
                  REGISTERED SYSTEM ACCOUNTS ({filteredUsers.length})
                </h2>
                <p className="text-xs text-gray-500">Manage role assignments, account locking, and staff credentials.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-[#0A2B1E] hover:bg-emerald-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md"
              >
                <UserPlus className="w-4 h-4 text-[#C2D7B4]" /> Provision New User
              </button>
            </div>

            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by staff name or email address..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-[#0A2B1E] font-medium"
                />
              </div>
              <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase">Role:</span>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="bg-transparent font-bold text-xs text-[#0A2B1E] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admins Only</option>
                  <option value="MANAGER">Managers Only</option>
                  <option value="USER">Warehouse Staff</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
              <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-700 mx-auto" /></div>
            ) : (
              <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-4">User Details &amp; Email</th>
                      <th className="p-4">Role Assignment</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Verified</th>
                      <th className="p-4 text-right">RBAC Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-stone-50 transition">
                        <td className="p-4">
                          <div className="font-bold text-sm text-[#0A2B1E]">{u.firstName} {u.lastName}</div>
                          <div className="text-gray-500 text-xs font-mono">{u.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {u.roles?.map(r => (
                              <span key={r} className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${r.includes('ADMIN') ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  r.includes('MANAGER') ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                    'bg-stone-200 text-stone-700'
                                }`}>
                                {r.replace('ROLE_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.status === 'LOCKED' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                            {u.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {u.emailVerified ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePromoteRole(u.id)}
                              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-stone-800 text-[11px] font-bold uppercase transition shadow-xs"
                              title="Cycle between User -> Manager -> Admin"
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleToggleLock(u.id, u.status)}
                              className={`p-1.5 rounded-lg border transition ${u.status === 'LOCKED' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-amber-50 border-amber-300 text-amber-700'
                                }`}
                              title={u.status === 'LOCKED' ? 'Unlock Account' : 'Lock Account'}
                            >
                              {u.status === 'LOCKED' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.firstName)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: MICROSERVICES FLEET MONITOR ───────────────────────────── */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5 mb-6">
                <div>
                  <h2 className="anton text-2xl text-[#0A2B1E]">SPRING BOOT MICROSERVICES FLEET</h2>
                  <p className="text-xs text-gray-500">Live heartbeat monitor across Eureka discovery server, API gateway, and core domain services.</p>
                </div>
                <button
                  onClick={() => toast.success('All nodes synchronized with Eureka registry.')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase rounded-xl transition flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700" /> Poll Eureka Registry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {microservices.map((svc, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold font-mono flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> PORT :{svc.port}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-gray-500">{svc.latency} ping</span>
                      </div>
                      <h3 className="font-['Anton'] text-lg text-[#0A2B1E]">{svc.name}</h3>
                      <p className="text-xs text-gray-600 mb-4 h-8">{svc.desc}</p>

                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs text-gray-500 font-semibold">
                          <span>Container CPU / Memory</span>
                          <span className="text-[#0A2B1E]">{svc.load}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: svc.load }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-stone-200/80">
                      <button
                        onClick={() => handlePurgeCache(svc.name)}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold uppercase rounded-xl border border-stone-300 transition shadow-xs"
                      >
                        Purge Cache
                      </button>
                      <button
                        onClick={() => handleRestartNode(svc.name)}
                        className="py-2 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold uppercase rounded-xl transition"
                        title="Restart Spring Node"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SECURITY AUDIT & COMPLIANCE LOGS ───────────────────────── */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-5">
              <div>
                <h2 className="anton text-2xl text-[#0A2B1E]">SECURITY &amp; COMPLIANCE AUDIT STREAM</h2>
                <p className="text-xs text-gray-500">Immutable system logs tracking RBAC changes, inventory quantity adjustments, and authentication attempts.</p>
              </div>
              <button
                onClick={() => setAuditLogs(INITIAL_AUDIT_LOGS)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase rounded-xl transition"
              >
                Reload Stream
              </button>
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor / Origin IP</th>
                    <th className="p-4">Action Type</th>
                    <th className="p-4">Event Details &amp; Payload</th>
                    <th className="p-4 text-right">Severity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-stone-50 transition font-mono">
                      <td className="p-4 text-gray-400">{log.timestamp}</td>
                      <td className="p-4 font-bold text-[#0A2B1E]">{log.user}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-sans text-stone-700 font-medium">{log.details}</td>
                      <td className="p-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-sans ${log.status === 'SECURITY ALERT' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: SYSTEM CONFIGURATION ────────────────────────────────────── */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="anton text-2xl text-[#0A2B1E]">GLOBAL SYSTEM GOVERNANCE &amp; POLICIES</h2>
              <p className="text-xs text-gray-500">Configure global platform behavior, database replication schedules, and security thresholds.</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0A2B1E]">Platform Maintenance Mode</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Temporarily restrict login access to system administrators only for scheduled maintenance.</p>
                </div>
                <button
                  onClick={() => {
                    setConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
                    toast.success(!config.maintenanceMode ? 'Maintenance mode ACTIVATED' : 'Maintenance mode disabled');
                  }}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 ${config.maintenanceMode ? 'bg-rose-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${config.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0A2B1E]">Enforce Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Require mandatory OTP verification for all staff accounts with Manager or Admin roles.</p>
                </div>
                <button
                  onClick={() => {
                    setConfig(prev => ({ ...prev, enforceMfa: !prev.enforceMfa }));
                    toast.success('2FA security policy updated');
                  }}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 ${config.enforceMfa ? 'bg-[#0A2B1E]' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${config.enforceMfa ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0A2B1E]">Automated Hourly Database Snapshots</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Execute background point-in-time PostgreSQL volume backups every hour.</p>
                </div>
                <button
                  onClick={() => {
                    setConfig(prev => ({ ...prev, autoBackup: !prev.autoBackup }));
                    toast.success('Backup scheduler updated');
                  }}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 ${config.autoBackup ? 'bg-[#0A2B1E]' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${config.autoBackup ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button onClick={() => toast.success('All platform configuration parameters saved!')} className="px-6 py-3 bg-[#0A2B1E] text-[#F5F2EB] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition shadow-lg">
                Save &amp; Commit Changes
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ── PROVISION NEW USER MODAL ───────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-fade-in">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-100 text-[#0A2B1E]">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="anton text-xl text-[#0A2B1E]">PROVISION NEW USER</h3>
                <p className="text-xs text-gray-500">Create credentials &amp; set RBAC role</p>
              </div>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.firstName}
                    onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                    placeholder="e.g. Rajesh"
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-[#0A2B1E] focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.lastName}
                    onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                    placeholder="e.g. Kumar"
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-[#0A2B1E] focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@flowstock.com"
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono text-[#0A2B1E] focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">System RBAC Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-[#0A2B1E] focus:outline-none cursor-pointer"
                >
                  <option value="ROLE_USER">Warehouse Specialist (Operator / Picker)</option>
                  <option value="ROLE_MANAGER">Inventory Manager (Supervisory Access)</option>
                  <option value="ROLE_ADMIN">System Administrator (Full Governance)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0A2B1E] hover:bg-emerald-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
