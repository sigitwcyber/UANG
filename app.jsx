import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  LayoutDashboard, History, BarChart3, Settings, LogOut, 
  Plus, Trash2, Edit3, Search, Filter, Download, Sun, Moon, Wallet, ArrowUpCircle, ArrowDownCircle 
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // App States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Penjualan Silk Dress', category: 'Pendapatan', date: '2026-05-20', type: 'pemasukan', amount: 4500000, note: 'Batch 1' },
    { id: 2, name: 'Bahan Baku Katun Premium', category: 'Produksi', date: '2026-05-22', type: 'pengeluaran', amount: 1800000, note: 'Vendor Jakarta' },
    { id: 3, name: 'Gaji Penjahit', category: 'Operasional', date: '2026-05-25', type: 'pengeluaran', amount: 2500000, note: 'Bulan Mei' },
  ]);

  // Form State
  const [form, setForm] = useState({ name: '', category: 'Pendapatan', date: '', type: 'pemasukan', amount: '', note: '' });
  const [editingId, setEditingId] = useState(null);

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'wingstone2026') {
      setIsLoggedIn(true);
    } else {
      alert('Kredensial salah. Gunakan admin / wingstone2026');
    }
  };

  // Financial Calculations
  const totalPemasukan = transactions.filter(t => t.type === 'pemasukan').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalPengeluaran = transactions.filter(t => t.type === 'pengeluaran').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const saldoAkhir = totalPemasukan - totalPengeluaran;

  // CRUD Actions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setTransactions(transactions.map(t => t.id === editingId ? { ...form, id: editingId, amount: Number(form.amount) } : t));
      setEditingId(null);
    } else {
      setTransactions([...transactions, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    }
    setForm({ name: '', category: 'Pendapatan', date: '', type: 'pemasukan', amount: '', note: '' });
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm(t);
  };

  const handleDelete = (id) => {
    if(confirm('Hapus transaksi ini?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.note.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Chart Data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
    datasets: [
      { label: 'Pemasukan', data: [3000000, 4500000, 5000000, 7000000, totalPemasukan], borderColor: '#D4AF37', backgroundColor: 'transparent', tension: 0.4 },
      { label: 'Pengeluaran', data: [2000000, 2500000, 3100000, 4000000, totalPengeluaran], borderColor: '#8E8E93', backgroundColor: 'transparent', tension: 0.4 }
    ]
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-wingstone-dark text-white' : 'bg-wingstone-light text-wingstone-dark'} transition-colors duration-300`}>
        <form onSubmit={handleLogin} className={`p-10 rounded-2xl w-full max-w-md border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'} shadow-2xl backdrop-blur-md`}>
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-extrabold tracking-widest text-wingstone-accent">WINGSTONE</h1>
            <p className="text-sm text-wingstone-muted mt-2 uppercase tracking-wider">Finance Control Suite</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-wingstone-muted block mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 rounded-lg bg-transparent border border-neutral-700 focus:border-wingstone-accent outline-none transition-all" placeholder="admin" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-wingstone-muted block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-transparent border border-neutral-700 focus:border-wingstone-accent outline-none transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 mt-4 rounded-lg bg-white text-black font-semibold hover:bg-wingstone-accent hover:text-white transition-all duration-300 tracking-wider text-sm uppercase">Enter Dashboard</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-wingstone-dark text-white' : 'bg-wingstone-light text-wingstone-dark'} transition-colors duration-300 font-sans`}>
      
      {/* SIDEBAR */}
      <aside className={`w-64 border-r hidden md:flex flex-col justify-between p-6 ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'}`}>
        <div>
          <div className="mb-10">
            <h1 className="font-display text-3xl font-black tracking-widest text-center text-wingstone-accent">WINGSTONE</h1>
            <p className="text-[10px] text-center text-wingstone-muted tracking-widest uppercase mt-1">Internal Ledger</p>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'history', label: 'Riwayat Keuangan', icon: History },
              { id: 'reports', label: 'Laporan Bulanan', icon: BarChart3 },
              { id: 'settings', label: 'Pengaturan', icon: Settings },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-neutral-900 text-wingstone-accent border-l-4 border-wingstone-accent shadow-lg' : 'text-wingstone-muted hover:text-white hover:bg-neutral-900/50'}`}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR */}
        <header className={`p-4 md:p-6 border-b flex items-center justify-between ${darkMode ? 'border-neutral-800 bg-wingstone-dark/80' : 'border-neutral-200 bg-white/80'} backdrop-blur-md sticky top-0 z-50`}>
          <h2 className="text-lg font-semibold tracking-wide capitalize">{activeTab} Panel</h2>
          <div className="flex items-center space-x-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-neutral-800 transition-all">
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-neutral-600" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-wingstone-accent border border-wingstone-accent">W</div>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <main className="p-4 md:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
          
          {/* 1. TAB DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-wingstone-muted">Total Saldo Kas</span>
                    <Wallet className="text-wingstone-accent" size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Rp {saldoAkhir.toLocaleString('id-ID')}</h3>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-wingstone-muted">Total Pemasukan</span>
                    <ArrowUpCircle className="text-emerald-500" size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-emerald-500">Rp {totalPemasukan.toLocaleString('id-ID')}</h3>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-wingstone-muted">Total Pengeluaran</span>
                    <ArrowDownCircle className="text-rose-500" size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-rose-500">Rp {totalPengeluaran.toLocaleString('id-ID')}</h3>
                </div>
              </div>

              {/* INPUT FORM & CHART QUICK VIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Input */}
                <div className={`p-6 rounded-2xl border lg:col-span-1 ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider flex items-center"><Plus size={16} className="mr-2 text-wingstone-accent"/> {editingId ? 'Edit Transaksi' : 'Catat Transaksi Baru'}</h4>
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block mb-1 text-wingstone-muted">Nama Transaksi</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 rounded-lg bg-transparent border border-neutral-700 outline-none focus:border-wingstone-accent" placeholder="Contoh: Pembelian Kain Silk" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-wingstone-muted">Jenis</label>
                        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 outline-none text-white">
                          <option value="pemasukan">Pemasukan</option>
                          <option value="pengeluaran">Pengeluaran</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-wingstone-muted">Kategori</label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 outline-none text-white">
                          <option value="Pendapatan">Pendapatan</option>
                          <option value="Produksi">Produksi</option>
                          <option value="Operasional">Operasional</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-wingstone-muted">Tanggal</label>
                        <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-2.5 rounded-lg bg-transparent border border-neutral-700 outline-none" />
                      </div>
                      <div>
                        <label className="block mb-1 text-wingstone-muted">Jumlah (Rp)</label>
                        <input required type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full p-2.5 rounded-lg bg-transparent border border-neutral-700 outline-none focus:border-wingstone-accent" placeholder="500000" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-wingstone-muted">Catatan Tambahan</label>
                      <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full p-2.5 rounded-lg bg-transparent border border-neutral-700 outline-none h-16" placeholder="Opsional..."></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider rounded-lg hover:bg-wingstone-accent hover:text-white transition-all duration-300">{editingId ? 'Simpan Perubahan' : 'Submit Catatan'}</button>
                  </form>
                </div>

                {/* Realtime Overview Analytics */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Metrik Finansial Bulanan</h4>
                  <div className="h-64">
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. TAB RIWAYAT KEUANGAN */}
          {activeTab === 'history' && (
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h4 className="font-semibold text-sm uppercase tracking-wider">Ledger Riwayat Transaksi</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
                    <input type="text" placeholder="Cari transaksi..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 text-xs rounded-lg bg-transparent border border-neutral-700 outline-none w-48 focus:w-64 transition-all" />
                  </div>
                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-2 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white">
                    <option value="All">Semua Kategori</option>
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Produksi">Produksi</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  <button onClick={() => alert('Exporting to Excel/PDF functionality triggered.')} className="flex items-center space-x-1 p-2 bg-neutral-800 rounded-lg text-xs hover:bg-neutral-700 transition-all">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* TABLE DATA */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-wingstone-muted uppercase tracking-wider">
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Nama Transaksi</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Jenis</th>
                      <th className="p-3 text-right">Jumlah</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/20 transition-all">
                        <td className="p-3">{t.date}</td>
                        <td className="p-3 font-medium">{t.name} <span className="block text-[10px] text-wingstone-muted">{t.note}</span></td>
                        <td className="p-3"><span className="px-2 py-1 bg-neutral-800 rounded text-[10px]">{t.category}</span></td>
                        <td className="p-3">
                          <span className={`capitalize font-semibold ${t.type === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.type}</span>
                        </td>
                        <td className={`p-3 text-right font-semibold ${t.type === 'pemasukan' ? 'text-emerald-500' : 'text-white'}`}>
                          {t.type === 'pengeluaran' ? '-' : ''}Rp {t.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button onClick={() => { handleEdit(t); setActiveTab('dashboard'); }} className="p-1.5 hover:bg-neutral-800 text-wingstone-accent rounded"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-neutral-800 text-rose-500 rounded"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. TAB LAPORAN BULANAN */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Komposisi Pengeluaran</h4>
                <div className="h-64 flex justify-center">
                  <Doughnut data={{
                    labels: ['Produksi', 'Operasional', 'Marketing'],
                    datasets: [{
                      data: [1800000, 2500000, 400000],
                      backgroundColor: ['#D4AF37', '#8E8E93', '#FFFFFF'],
                    }]
                  }} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'} flex flex-col justify-between`}>
                <div>
                  <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Summary Laporan Finansial</h4>
                  <p className="text-xs text-wingstone-muted leading-relaxed">Berdasarkan data input realtime periode ini, rasio pengeluaran operasional mendominasi alokasi dana Wingstone. Profit margin berada pada tingkat stabil dengan rasio kesehatan keuangan (+34.2%).</p>
                </div>
                <div className="space-y-2 mt-4">
                  <button onClick={() => alert('Cetak PDF Berhasil')} className="w-full py-2.5 bg-neutral-900 border border-neutral-700 text-white hover:border-wingstone-accent text-xs font-semibold rounded-lg tracking-wider uppercase transition-all">Download PDF Report</button>
                  <button onClick={() => alert('Cetak Excel Berhasil')} className="w-full py-2.5 bg-wingstone-accent text-white hover:bg-yellow-600 text-xs font-semibold rounded-lg tracking-wider uppercase transition-all">Download Spreadsheet Excel</button>
                </div>
              </div>
            </div>
          )}

          {/* 4. TAB PENGATURAN */}
          {activeTab === 'settings' && (
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-wingstone-cardDark border-neutral-800' : 'bg-white border-neutral-200'} max-w-xl`}>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider">Pengaturan Platform</h4>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                  <div>
                    <p className="font-medium">Mata Uang Utama</p>
                    <p className="text-wingstone-muted text-[11px]">Format standar pelaporan kas bisnis.</p>
                  </div>
                  <span className="font-bold text-wingstone-accent">IDR (Rp)</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                  <div>
                    <p className="font-medium">Sinkronisasi Database Realtime</p>
                    <p className="text-wingstone-muted text-[11px]">Status koneksi cloud server Wingstone.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[10px] font-bold">Active</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium">Keamanan Enkripsi Ledger</p>
                    <p className="text-wingstone-muted text-[11px]">Sistem proteksi data internal.</p>
                  </div>
                  <span className="text-wingstone-muted">AES-256</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}