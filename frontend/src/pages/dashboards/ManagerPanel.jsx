import React, { useEffect, useState } from 'react';
import { Package, Truck, LayoutDashboard, Settings, User, Bell, Search, BarChart2, CheckCircle2, ChevronDown, Upload, MoreHorizontal, FileText, ClipboardList, X, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useInventory } from '../../context/InventoryContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ManagerPanel({ user, onLogout }) {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task to migrate zone C', desc: 'Complete by 5:00 PM', done: false },
    { id: 2, title: 'Compile taxes report', desc: 'Complete', done: true },
    { id: 3, title: 'Complete deliveries', desc: 'In progress', done: false },
    { id: 4, title: 'Wait for crates', desc: '15 minutes remaining', done: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [reportItem, setReportItem] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemData, setNewItemData] = useState({
    productId: '',
    name: '',
    category: '',
    warehouseId: '',
    availableQty: ''
  });
  const navigate = useNavigate();

  const handleAddNewItem = async () => {
    if (!newItemData.productId || !newItemData.name) return;
    setIsSubmitting(true);
    await addInventoryItem(newItemData);
    setIsAddingItem(false);
    setNewItemData({ productId: '', name: '', category: '', warehouseId: '', availableQty: '' });
    setIsSubmitting(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskTitle, desc: 'Pending', done: false }]);
    setNewTaskTitle('');
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditQty(item.availableQty || item.quantity || item.qty || '');
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    await updateInventoryItem(editingItem, editQty);
    setEditingItem(null);
    setIsSubmitting(false);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteInventoryItem(item);
    }
  };

  const getStatusBadge = (qty) => {
    if (qty === 0) return { text: 'Out of Stock', color: 'bg-gray-500/10 text-gray-700', icon: '⚫' };
    if (qty < 20) return { text: 'Low Stock', color: 'bg-red-500/10 text-red-600', icon: '🔴' };
    if (qty <= 50) return { text: 'Limited Stock', color: 'bg-amber-500/20 text-amber-700', icon: '🟡' };
    return { text: 'In Stock', color: 'bg-[#7a8b66]/20 text-[#0f3822]', icon: '🟢' };
  };

  const totalAvailable = inventory.reduce((sum, item) => sum + (item.availableQty ?? item.quantity ?? 0), 0) + 14892;
  const lowStockCount = inventory.filter(item => (item.availableQty ?? item.quantity) < 100).length + 215;

  const lineData = {
    labels: ['Mon', '#4', '102', '168', '202', '277', '30ys'],
    datasets: [
      {
        label: 'Current Stock',
        data: [400, 1200, 1000, 1800, 1100, 1600, 1900],
        borderColor: '#0f3822',
        backgroundColor: 'rgba(15, 56, 34, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Projected',
        data: [200, 600, 1300, 900, 1500, 1000, 1400],
        borderColor: '#7a8b66',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { border: { display: false }, grid: { color: '#01472e10' }, max: 2500, min: 0, ticks: { stepSize: 500, color: '#01472e80' } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#01472e80' } }
    }
  };

  const barData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [220, 340, 180, 290, 200],
      backgroundColor: '#7a8b66',
      borderRadius: 4,
      borderSkipped: false
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { border: { display: false }, grid: { color: '#01472e10' }, max: 400, min: 0, ticks: { stepSize: 100, color: '#01472e80' } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#01472e80' } }
    }
  };

  const displayName = user?.firstName || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-[#dce1c4] text-[#01472e] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#113a25] text-[#f2f4d8] flex flex-col justify-between py-6 rounded-r-[2rem] my-2 ml-2 shadow-[4px_0_24px_rgba(1,71,46,0.3)] z-10 border border-[#2b593a]">
        <div>
          <div className="px-8 flex items-center gap-3 mb-12 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 border-2 border-[#dce1c4] rounded flex items-center justify-center text-[#dce1c4] font-bold">
              ◆
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-widest leading-none">FLOWSTOCK</h1>
              <span className="text-[10px] uppercase opacity-70 tracking-widest">Platform</span>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2 px-4">
            <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 bg-[#f2f4d8]/10 rounded-xl cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <LayoutDashboard className="w-5 h-5 text-[#f2f4d8]" />
              <span className="font-semibold text-sm">Dashboard</span>
            </Link>
            <Link to="/inventory" className="flex items-center gap-4 px-4 py-3 hover:bg-[#f2f4d8]/5 rounded-xl cursor-pointer text-[#f2f4d8]/70 hover:text-[#f2f4d8] transition" style={{ textDecoration: 'none' }}>
              <Package className="w-5 h-5" />
              <span className="font-semibold text-sm">Inventory</span>
            </Link>
            <Link to="/orders" className="flex items-center gap-4 px-4 py-3 hover:bg-[#f2f4d8]/5 rounded-xl cursor-pointer text-[#f2f4d8]/70 hover:text-[#f2f4d8] transition" style={{ textDecoration: 'none' }}>
              <ClipboardList className="w-5 h-5" />
              <span className="font-semibold text-sm">Orders</span>
            </Link>
            <Link to="/warehouses" className="flex items-center gap-4 px-4 py-3 hover:bg-[#f2f4d8]/5 rounded-xl cursor-pointer text-[#f2f4d8]/70 hover:text-[#f2f4d8] transition" style={{ textDecoration: 'none' }}>
              <Truck className="w-5 h-5" />
              <span className="font-semibold text-sm">Shipments</span>
            </Link>
            <Link to="/suppliers" className="flex items-center gap-4 px-4 py-3 hover:bg-[#f2f4d8]/5 rounded-xl cursor-pointer text-[#f2f4d8]/70 hover:text-[#f2f4d8] transition" style={{ textDecoration: 'none' }}>
              <FileText className="w-5 h-5" />
              <span className="font-semibold text-sm">Reports</span>
            </Link>
            <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#f2f4d8]/5 rounded-xl cursor-pointer text-[#f2f4d8]/70 hover:text-[#f2f4d8] transition mt-2">
              <Settings className="w-5 h-5" />
              <span className="font-semibold text-sm">Settings</span>
            </div>
          </nav>
        </div>

        <div className="px-4">
          <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#d84315]/20 rounded-xl cursor-pointer text-[#f2f4d8]/70 hover:text-[#d84315] transition mb-4" onClick={onLogout}>
            <User className="w-5 h-5" />
            <span className="font-semibold text-sm">Sign Out</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-[#f2f4d8]/5 border border-[#f2f4d8]/10 rounded-xl cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-brand-500 overflow-hidden flex items-center justify-center text-white font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-[#f2f4d8] leading-tight">{displayName}</p>
              <p className="text-[10px] text-[#f2f4d8]/60">Warehouse Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="flex justify-between items-center px-10 py-8 z-10">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-[#01472e]">Welcome, {displayName}!</h1>
            <span className="text-xl text-[#01472e]/60 border-l border-[#01472e]/20 pl-3">Inventory Overview</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-[#01472e]">
              <Search className="w-6 h-6" />
            </div>
            <div className="relative cursor-pointer text-[#01472e]">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d84315] rounded-full border-2 border-[#dce1c4]"></span>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold shadow-sm overflow-hidden border border-[#01472e]/10">
              {user?.firstName?.charAt(0) || 'L'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-10 pb-10 flex flex-col gap-6 scrollbar-hide">
          
           {/* KPI Cards */}
           <div className="grid grid-cols-4 gap-5">
              <div className="bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-[#01472e]/70">Total SKUs</span>
                  <MoreHorizontal className="w-5 h-5 text-[#01472e]/40" />
                </div>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold">{totalAvailable.toLocaleString()}</h2>
                  <span className="text-xs font-bold text-[#01472e] bg-[#ccd5ae]/40 px-2 py-1 rounded-full mb-1">+3.1%</span>
                </div>
              </div>

              <div className="bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-[#01472e]/70">Low Stock Items</span>
                  <div className="w-5 h-5 rounded-full border border-red-500/30 flex items-center justify-center">
                    <span className="text-red-500 text-[10px]">↓</span>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold">{lowStockCount}</h2>
                  <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full mb-1">-12%</span>
                </div>
              </div>

              <div className="bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-[#01472e]/70">Pending Orders</span>
                  <div className="w-5 h-5 rounded-full border border-amber-500/30 flex items-center justify-center">
                    <span className="text-amber-600 text-[10px]">!</span>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold">67</h2>
                  <span className="text-xs font-bold text-[#01472e] bg-[#ccd5ae]/40 px-2 py-1 rounded-full mb-1">Active</span>
                </div>
              </div>

              <div className="bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-[#01472e]/70">Space Utilization</span>
                  <LayoutDashboard className="w-4 h-4 text-[#01472e]/40" />
                </div>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold">78%</h2>
                  <span className="text-xs font-bold text-[#01472e]/70 bg-black/5 px-2 py-1 rounded-full mb-1">Stable</span>
                </div>
              </div>
           </div>

           {/* Middle Grid */}
           <div className="grid grid-cols-12 gap-6 h-[400px]">
             {/* Line Chart */}
             <div className="col-span-5 bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ccd5ae]/20 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="font-bold text-lg">Stock Levels & Trend</h3>
                  <button className="text-xs font-medium bg-[#dce1c4] px-3 py-1.5 rounded-xl border border-[#ccd5ae]/50 flex items-center gap-1">
                    Last 30 days <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 relative z-10 w-full min-h-0">
                  <Line data={lineData} options={lineOptions} />
                </div>
             </div>
             
             {/* Middle Charts */}
             <div className="col-span-4 flex flex-col gap-6">
                <div className="bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex-1 flex flex-col min-h-0">
                  <h3 className="font-bold text-base mb-2">Top Selling Items</h3>
                  <div className="flex-1 w-full relative min-h-0">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
                
                <div className="bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-base mb-3">Warehouse Map Overview</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <div className="bg-[#dce1c4] rounded-lg flex items-center justify-center text-xs font-bold border border-[#ccd5ae] row-span-2">A</div>
                      <div className="bg-[#dce1c4] rounded-lg flex items-center justify-center text-xs font-bold border border-[#ccd5ae] py-3">B</div>
                      <div className="bg-[#0f3822] text-[#f2f4d8] rounded-lg flex items-center justify-center text-xs font-bold py-3 shadow-inner">C</div>
                      <div className="bg-[#dce1c4] rounded-lg flex items-center justify-center text-xs font-bold border border-[#ccd5ae] py-3">D</div>
                      <div className="bg-[#dce1c4] rounded-lg flex items-center justify-center text-xs font-bold border border-[#ccd5ae] col-span-2 py-3">F</div>
                      <div className="bg-[#dce1c4] rounded-lg flex items-center justify-center text-xs font-bold border border-[#ccd5ae] py-3">G</div>
                    </div>
                    <div className="w-24 flex flex-col justify-center gap-1 text-[10px] font-medium text-[#01472e]/70">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0f3822]"></div> Stock Status</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7a8b66]"></div> In Stock</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#d84315]"></div> Low Stock</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#dce1c4] border border-[#ccd5ae]"></div> Empty</div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Right Task List */}
             <div className="col-span-3 bg-[#f5f6e6] rounded-[2rem] p-6 shadow-sm border border-[#ccd5ae]/40 flex flex-col relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/40 blur-3xl rounded-full pointer-events-none"></div>
                <h3 className="font-bold text-lg mb-6 relative z-10">Task List</h3>
                <div className="flex flex-col gap-4 relative z-10 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                  
                  {tasks.map(task => (
                    <div key={task.id} className="flex gap-3">
                      <div className="mt-0.5 cursor-pointer" onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}>
                        {task.done ? (
                          <div className="w-4 h-4 rounded border-2 border-[#7a8b66] bg-[#7a8b66] flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-[#01472e]/20 hover:border-[#01472e]/40 transition"></div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold transition ${task.done ? 'opacity-70 line-through' : ''}`}>{task.title}</p>
                        <p className="text-xs text-[#01472e]/50 mt-0.5">{task.desc}</p>
                      </div>
                    </div>
                  ))}

                </div>
                <input 
                  type="text" 
                  placeholder="Type new task..." 
                  value={newTaskTitle} 
                  onChange={e => setNewTaskTitle(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  className="w-full bg-white border border-[#ccd5ae]/50 rounded-xl px-4 py-3 mt-4 text-sm font-semibold text-[#01472e] outline-none focus:border-[#0f3822]/50 placeholder:text-[#01472e]/30 shadow-sm" 
                />
                <button onClick={handleAddTask} className="w-full bg-[#0f3822] text-[#f2f4d8] py-3 rounded-xl font-bold text-sm mt-3 shadow-lg hover:bg-[#0f3822]/90 transition cursor-pointer">
                  Add Task
                </button>
             </div>
           </div>

           {/* Bottom Grid: Inventory List */}
           <div className="bg-[#f5f6e6] rounded-[3rem] p-8 shadow-sm border border-[#ccd5ae]/40 mt-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Inventory List</h3>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#ccd5ae]/50 text-sm font-medium">
                    <Search className="w-4 h-4 opacity-50" />
                    <input type="text" placeholder="Search" className="bg-transparent border-none outline-none w-24 text-[#01472e] placeholder:text-[#01472e]/40" />
                  </div>
                  <button onClick={() => setIsAddingItem(true)} className="bg-[#dce1c4] text-[#0f3822] border border-[#ccd5ae]/50 px-5 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-[#ccd5ae]/40 transition cursor-pointer">
                    + Add Item
                  </button>
                  <button className="bg-[#0f3822] text-[#f2f4d8] px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md">
                    Filter All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#01472e]/10 text-sm font-bold text-[#01472e]">
                      <th className="py-4 px-2 w-10">
                        <div className="w-4 h-4 rounded border-2 border-[#01472e]/20"></div>
                      </th>
                      <th className="py-4 px-4 w-32">SKU</th>
                      <th className="py-4 px-4">Item Name</th>
                      <th className="py-4 px-4 w-40">Category</th>
                      <th className="py-4 px-4 w-32">Location</th>
                      <th className="py-4 px-4 w-32">Qty On Hand</th>
                      <th className="py-4 px-4 w-32">Status</th>
                      <th className="py-4 px-4 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium">
                    {inventory.map((item, idx) => {
                      const qty = item.availableQty ?? item.quantity ?? 0;
                      const status = getStatusBadge(qty);
                      
                      return (
                      <tr key={idx} className="border-b border-[#01472e]/5 hover:bg-[#ccd5ae]/20 transition">
                        <td className="py-4 px-2"><div className="w-4 h-4 rounded border-2 border-[#01472e]/20"></div></td>
                        <td className="py-4 px-4 text-[#01472e]/70">{item.productId?.substring(0,8)}</td>
                        <td className="py-4 px-4 font-bold">{item.name || `Live Item ${idx+1}`}</td>
                        <td className="py-4 px-4">{item.category || 'Category'}</td>
                        <td className="py-4 px-4">{item.warehouseId?.substring(0,4) || '1111'}</td>
                        <td className="py-4 px-4">{qty}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max ${status.color}`}>
                            <span>{status.icon}</span> {status.text}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-3 text-[#01472e]/50">
                            <Upload className="w-4 h-4 hover:text-[#01472e] cursor-pointer" onClick={() => setReportItem(item)} />
                            <MoreHorizontal className="w-4 h-4 hover:text-[#01472e] cursor-pointer" onClick={() => handleEditClick(item)} />
                            <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer" onClick={() => handleDeleteItem(item)} />
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
           </div>

        </main>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#01472e]/40 backdrop-blur-sm">
          <div className="bg-[#f5f6e6] p-8 rounded-[2rem] shadow-2xl w-96 border border-[#ccd5ae]/50 relative">
            <button className="absolute top-6 right-6 text-[#01472e]/50 hover:text-[#01472e]" onClick={() => setEditingItem(null)}><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-1">Edit Inventory</h3>
            <p className="text-sm opacity-60 mb-6">{editingItem.name || 'Selected Item'}</p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold opacity-60 mb-2">ADJUST QUANTITY</label>
              <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} className="w-full bg-white border border-[#ccd5ae] rounded-xl px-4 py-3 text-[#01472e] font-bold outline-none focus:border-[#0f3822]" />
            </div>

            <button onClick={handleSaveEdit} disabled={isSubmitting} className="w-full bg-[#0f3822] text-[#f2f4d8] py-3 rounded-xl font-bold shadow-lg hover:bg-[#0f3822]/90 transition disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#01472e]/40 backdrop-blur-sm">
          <div className="bg-[#f5f6e6] p-8 rounded-[2rem] shadow-2xl w-[500px] border border-[#ccd5ae]/50 relative">
            <button className="absolute top-6 right-6 text-[#01472e]/50 hover:text-[#01472e]" onClick={() => setReportItem(null)}><X className="w-5 h-5" /></button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#0f3822] flex items-center justify-center text-[#f2f4d8]"><FileText className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold leading-tight">{reportItem.name || 'Product Report'}</h3>
                <p className="text-sm opacity-60">SKU: {reportItem.productId?.substring(0, 18) || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#dce1c4]/50 p-4 rounded-2xl border border-[#ccd5ae]/50">
                <p className="text-[10px] font-bold opacity-50 mb-1">LOCATION</p>
                <p className="font-bold">{reportItem.warehouseId?.substring(0, 8) || 'Main Hub'}</p>
              </div>
              <div className="bg-[#dce1c4]/50 p-4 rounded-2xl border border-[#ccd5ae]/50">
                <p className="text-[10px] font-bold opacity-50 mb-1">TOTAL STOCK</p>
                <p className="font-bold text-xl">{reportItem.availableQty || reportItem.quantity || 0}</p>
              </div>
            </div>

            <div className="border-t border-[#ccd5ae]/50 pt-6">
              <h4 className="text-sm font-bold mb-4">Recent Activity</h4>
              <div className="flex flex-col gap-4 relative">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-[#ccd5ae]/40"></div>
                
                <div className="flex gap-4 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-[#7a8b66] border-2 border-[#f5f6e6] mt-0.5 shadow-sm"></div>
                  <div>
                    <p className="text-sm font-bold">Stock Adjusted</p>
                    <p className="text-xs opacity-60">Quantity changed by +50 units</p>
                  </div>
                </div>
                
                <div className="flex gap-4 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-[#d84315] border-2 border-[#f5f6e6] mt-0.5 shadow-sm"></div>
                  <div>
                    <p className="text-sm font-bold">Low Stock Warning</p>
                    <p className="text-xs opacity-60">System generated alert</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#01472e]/40 backdrop-blur-sm">
          <div className="bg-[#f5f6e6] p-8 rounded-[2rem] shadow-2xl w-[400px] border border-[#ccd5ae]/50 relative">
            <button className="absolute top-6 right-6 text-[#01472e]/50 hover:text-[#01472e]" onClick={() => setIsAddingItem(false)}><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-6">Add New Inventory Item</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold opacity-60 mb-1">SKU / PRODUCT ID</label>
                <input type="text" value={newItemData.productId} onChange={e => setNewItemData({...newItemData, productId: e.target.value})} className="w-full bg-white border border-[#ccd5ae] rounded-xl px-4 py-2.5 text-[#01472e] font-semibold outline-none focus:border-[#0f3822]" placeholder="e.g. WL-5000" />
              </div>
              <div>
                <label className="block text-xs font-bold opacity-60 mb-1">ITEM NAME</label>
                <input type="text" value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})} className="w-full bg-white border border-[#ccd5ae] rounded-xl px-4 py-2.5 text-[#01472e] font-semibold outline-none focus:border-[#0f3822]" placeholder="e.g. Heavy Duty Pallets" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold opacity-60 mb-1">CATEGORY</label>
                  <input type="text" value={newItemData.category} onChange={e => setNewItemData({...newItemData, category: e.target.value})} className="w-full bg-white border border-[#ccd5ae] rounded-xl px-4 py-2.5 text-[#01472e] font-semibold outline-none focus:border-[#0f3822]" placeholder="e.g. Materials" />
                </div>
                <div>
                  <label className="block text-xs font-bold opacity-60 mb-1">LOCATION</label>
                  <input type="text" value={newItemData.warehouseId} onChange={e => setNewItemData({...newItemData, warehouseId: e.target.value})} className="w-full bg-white border border-[#ccd5ae] rounded-xl px-4 py-2.5 text-[#01472e] font-semibold outline-none focus:border-[#0f3822]" placeholder="e.g. C-9" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold opacity-60 mb-1">INITIAL QUANTITY</label>
                <input type="number" value={newItemData.availableQty} onChange={e => setNewItemData({...newItemData, availableQty: e.target.value})} className="w-full bg-white border border-[#ccd5ae] rounded-xl px-4 py-2.5 text-[#01472e] font-bold outline-none focus:border-[#0f3822]" placeholder="0" />
              </div>
            </div>

            <button onClick={handleAddNewItem} disabled={isSubmitting || !newItemData.productId || !newItemData.name} className="w-full bg-[#0f3822] text-[#f2f4d8] py-3 rounded-xl font-bold shadow-lg hover:bg-[#0f3822]/90 transition disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
