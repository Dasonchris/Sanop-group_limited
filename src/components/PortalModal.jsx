import React, { useState, useEffect } from 'react';
import { X, Shield, User, FileText, CheckCircle, AlertTriangle, Key, Clock, Settings, RefreshCcw, Mail, Phone, MapPin, Trash2, TrendingUp, DollarSign, Calendar, Eye } from 'lucide-react';

export default function PortalModal({ isOpen, onClose, user, onLogOut, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState('profile'); // profile, admin-users, admin-logs, admin-stats
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // States for standard member Actions
  const [pinEntry, setPinEntry] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');
  const [showPinTest, setShowPinTest] = useState(false);

  // Admin states
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [overrideTempPin, setOverrideTempPin] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setError('');
      setSuccess('');
      setPinVerified(false);
      setPinEntry('');
      setPinError('');
      setOverrideTempPin('');
      
      // Default admins to users tab
      if (user.role === 'admin') {
        setActiveTab('admin-stats');
        fetchAdminInsights();
      } else {
        setActiveTab('profile');
      }
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const authHeader = () => {
    const token = localStorage.getItem('sanop_session_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleUpdateClassification = async (targetClass) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const resp = await fetch('/api/auth/classification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({ classification: targetClass })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to update classification');

      setSuccess(data.message);
      onUserUpdate({ ...user, classification: targetClass });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCard = () => {
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print_Sanop_ID_' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=100,top=100,width=900,height=600');
    if (!printWindow) {
      alert("Popup blocker active. Please allow popups to save and print your ID card.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>SANOP ECOSYSTEM - Member ID Card - ${user.fullName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #f7f6f3;
              margin: 0;
            }
            .id-card-print {
              background: linear-gradient(135deg, #0f2419 0%, #153625 60%, #030a06 100%);
              color: white;
              width: 580px;
              height: 340px;
              border-radius: 24px;
              padding: 28px;
              box-sizing: border-box;
              position: relative;
              font-family: 'JetBrains Mono', monospace;
              border: 3px solid #d4af37;
              box-shadow: 0 15px 45px rgba(0,0,0,0.35);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              overflow: hidden;
            }
            .background-glares {
              position: absolute;
              right: -50px;
              top: -50px;
              width: 250px;
              height: 250px;
              background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(0,0,0,0) 70%);
              pointer-events: none;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1.5px solid rgba(212,175,55,0.25);
              padding-bottom: 12px;
              position: relative;
              z-index: 2;
            }
            .logo {
              color: #d4af37;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 3px;
              font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .title {
              font-size: 14px;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: 0.5px;
              margin-top: 3px;
              font-family: 'Plus Jakarta Sans', sans-serif;
              text-transform: uppercase;
            }
            .verified-badge {
              font-size: 9px;
              font-weight: 800;
              background: rgba(16, 185, 129, 0.2);
              color: #10b981;
              border: 1.5px solid #10b981;
              padding: 5px 12px;
              border-radius: 99px;
              font-family: 'Plus Jakarta Sans', sans-serif;
              letter-spacing: 1px;
            }
            .content {
              display: flex;
              gap: 25px;
              align-items: center;
              margin: 15px 0;
              position: relative;
              z-index: 2;
            }
            .avatar {
              width: 90px;
              height: 90px;
              border-radius: 18px;
              background: #d4af37;
              color: #0f2419;
              font-size: 32px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: 800;
              border: 3px solid rgba(255,255,255,0.9);
              font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .holder-details {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .name {
              font-size: 20px;
              font-weight: 800;
              color: white;
              font-family: 'Plus Jakarta Sans', sans-serif;
              margin-bottom: 4px;
            }
            .details-row {
              font-size: 11px;
              color: #a0aec0;
              letter-spacing: 0.5px;
            }
            .details-row span {
              color: #f7f6f3;
              font-weight: bold;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid rgba(255,255,255,0.1);
              padding-top: 12px;
              position: relative;
              z-index: 2;
            }
            .classification-stamp {
              background: #10b981;
              color: white;
              font-size: 10px;
              font-weight: 800;
              padding: 6px 16px;
              border-radius: 8px;
              letter-spacing: 1.5px;
              border: 1px solid rgba(255,255,255,0.15);
              font-family: 'Plus Jakarta Sans', sans-serif;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              display: inline-block;
            }
            .classification-stamp.retail {
              background: #d4af37;
            }
            .classification-stamp.depot {
              background: #2563eb;
            }
            .barcode-area {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 4px;
            }
            .barcode-lines {
              display: flex;
              height: 28px;
              background: rgba(255,255,255,0.9);
              padding: 3px 6px;
              border-radius: 6px;
            }
            .bar {
              background: #111;
              height: 100%;
            }
            .barcode-text {
              font-size: 8px;
              color: #a0aec0;
              letter-spacing: 2px;
            }
            @media print {
              body { background: white; }
              .id-card-print {
                box-shadow: none;
                border: 2px solid #d4af37;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card-print">
            <div class="background-glares"></div>
            <div class="header">
              <div>
                <div class="logo">SANOP GROUP • WEST AFRICA</div>
                <div class="title">COSMETIC BIOTARGET SYSTEM CARD</div>
              </div>
              <div class="verified-badge">● GENERATED NODE</div>
            </div>
            
            <div class="content">
              <div class="avatar">
                ${user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'SN'}
              </div>
              <div class="holder-details">
                <div class="name">${user.fullName}</div>
                <div class="details-row">EMAIL: <span>${user.email}</span></div>
                <div class="details-row">REGION: <span>${user.region} Ghana</span></div>
                <div class="details-row">CONTACT: <span>${user.phone || 'On-Net'}</span></div>
                <div class="details-row">AUTH ID: <span>SN-${user.id.toUpperCase().substring(0,8)}</span></div>
              </div>
            </div>

            <div class="footer">
              <div>
                <span style="font-size: 8px; color: #a0aec0; display: block; margin-bottom: 4px; uppercase; letter-spacing: 1px;">VERIFICATION CLASS</span>
                <div class="classification-stamp ${user.classification || 'buyer'}">
                  ${(user.classification || 'buyer').toUpperCase()}
                </div>
              </div>

              <div class="barcode-area">
                <div class="barcode-lines">
                  <div class="bar" style="width: 2px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 3px; margin-right: 1.5px;"></div>
                  <div class="bar" style="width: 1px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 4px; margin-right: 2px;"></div>
                  <div class="bar" style="width: 1.5px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 2px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 3px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 1px; margin-right: 2px;"></div>
                  <div class="bar" style="width: 4px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 2px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 1.5px; margin-right: 1px;"></div>
                  <div class="bar" style="width: 3px; margin-right: 1px;"></div>
                </div>
                <div class="barcode-text">MEMB-${user.id.toUpperCase().substring(0,8)}</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  /* --- 👤 MEMBER ACTIONS & PIN API HANDLERS --- */

  const handleVerifyPIN = async (e) => {
    e.preventDefault();
    setPinError('');
    setError('');

    try {
      const resp = await fetch('/api/auth/pin/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({ pin: pinEntry })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Invalid PIN entered.');
      }
      setPinVerified(true);
      setSuccess('Security PIN verified successfully! Authorized.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setPinError(err.message);
    }
  };

  const handleRequestPINAssistance = async () => {
    setError('');
    setSuccess('');
    try {
      const resp = await fetch('/api/auth/pin/reset-request', {
        method: 'POST',
        headers: authHeader()
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setSuccess('PIN Assistance request registered at Admin desk! An administrator can reset your PIN.');
      onUserUpdate({ ...user, pinResetRequested: true });
    } catch (err) {
      setError(err.message);
    }
  };

  /* --- 🛡️ SECURE ADMIN API CALLS --- */

  const fetchAdminInsights = async () => {
    setLoading(true);
    setError('');

    const loadFallbacks = () => {
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('sanop_fallback_users') || '[]');
      } catch (e) {}
      if (localUsers.length === 0) {
        localUsers = [
          {
            id: 'admin-id-1234',
            email: 'admin@sanop-group',
            fullName: 'Ecosystem Principal Administrator',
            phone: '+233 (021) 605 3309',
            role: 'admin',
            region: 'Volta',
            classification: 'depot',
            isVerified: true,
            password: 'Admin@1234',
            pin: '1234',
            pinResetRequested: false,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('sanop_fallback_users', JSON.stringify(localUsers));
      }

      let localLogs = [];
      try {
        localLogs = JSON.parse(localStorage.getItem('sanop_fallback_logs') || '[]');
      } catch (e) {}

      let localOrders = [];
      try {
        localOrders = JSON.parse(localStorage.getItem('sanop_fallback_orders') || '[]');
      } catch (e) {}

      let localConsultations = [];
      try {
        localConsultations = JSON.parse(localStorage.getItem('sanop_fallback_consultations') || '[]');
      } catch (e) {}

      const verifiedUsers = localUsers.filter(u => u.isVerified).length;
      const ordersVolume = localOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pinRequestsCount = localUsers.filter(u => u.pinResetRequested).length;

      setAdminStats({
        stats: {
          totalUsers: localUsers.length,
          verifiedUsers,
          totalOrders: localOrders.length,
          ordersVolume,
          totalConsultations: localConsultations.length,
          pinRequests: pinRequestsCount
        },
        orders: localOrders,
        consultations: localConsultations,
      });
      setAdminUsers(localUsers);
      setAdminLogs(localLogs);
    };

    try {
      const resp = await fetch('/api/admin/stats', { headers: authHeader() });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to fetch admin stats');
      setAdminStats(data);

      const usersResp = await fetch('/api/admin/users', { headers: authHeader() });
      const usersData = await usersResp.json();
      if (usersResp.ok && Array.isArray(usersData.users)) {
        setAdminUsers(usersData.users);
      } else {
        throw new Error(usersData.error || 'Failed to fetch admin users');
      }

      const logsResp = await fetch('/api/admin/logs', { headers: authHeader() });
      const logsData = await logsResp.json();
      if (logsResp.ok && Array.isArray(logsData.logs)) {
        setAdminLogs(logsData.logs);
      } else {
        throw new Error(logsData.error || 'Failed to fetch admin logs');
      }
    } catch (err) {
      console.warn('Admin API failed. Falling back to local ledger data:', err.message);
      loadFallbacks();
      setError('Unable to load live admin metrics from server. Showing offline ledger state.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (userId, currentStatus) => {
    setError('');
    setSuccess('');
    try {
      const targetStatus = !currentStatus;
      const resp = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({ verified: targetStatus })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setSuccess(data.message || 'Verification state modified');
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: targetStatus } : u));
      fetchAdminInsights(); // reload stats
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminResetUserPIN = async (userId, userName) => {
    setError('');
    setSuccess('');
    setOverrideTempPin('');
    setSelectedUserForReset(userName);
    try {
      const resp = await fetch(`/api/admin/users/${userId}/reset-pin`, {
        method: 'POST',
        headers: authHeader()
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setOverrideTempPin(data.tempPin);
      setSuccess(`Direct Admin Overwrite complete! Output PIN generated for user sharing.`);
      
      // Update local state list to clear flag
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, pinResetRequested: false } : u));
      fetchAdminInsights(); // refresh
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUserAccount = async (userId) => {
    if (!window.confirm('CRITICAL ACTION: Are you absolutely certain you want to purge this registered user entirely from the Sanop Group database? This cannot be undone.')) return;
    setError('');
    setSuccess('');
    try {
      const resp = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setSuccess(data.message);
      setAdminUsers(prev => prev.filter(u => u.id !== userId));
      fetchAdminInsights();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Portal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-brand-beige overflow-hidden shadow-2xl z-2 z-10 max-h-[92vh] flex flex-col justify-between">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-brand-beige-light border-b border-brand-beige/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${user.role === 'admin' ? 'bg-brand-gold' : 'bg-brand-green'}`}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[#1a3a2a] text-sm tracking-wide">
                {user.role === 'admin' ? 'SANOP SECURITY & INTEGRATED SYSTEM' : 'SANOP ECOSYSTEM MEMBER PORTAL'}
              </h3>
              <p className="text-[10px] text-brand-charcoal/50 font-mono">
                Log User ID: <span className="font-bold">{user.id}</span> • Auth Node: Gh-Volta-01
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-beige/70 text-brand-charcoal cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Banner Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-2 text-xs text-red-700 animate-slide-left shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-slide-left shrink-0">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Sub-Layout Navigation Tabs */}
        <div className="mx-6 mt-4 border-b border-brand-beige flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {user.role === 'admin' ? (
            <>
              <button
                onClick={() => { setActiveTab('admin-stats'); fetchAdminInsights(); }}
                className={`pb-2.5 text-xs font-heading font-black tracking-widest uppercase cursor-pointer px-2 border-b-2 transition-all ${activeTab === 'admin-stats' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-charcoal/50 hover:text-brand-gold'}`}
              >
                📊 Diagnostics & Stats
              </button>
              <button
                onClick={() => { setActiveTab('admin-users'); fetchAdminInsights(); }}
                className={`pb-2.5 text-xs font-heading font-black tracking-widest uppercase cursor-pointer px-2 border-b-2 transition-all ${activeTab === 'admin-users' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-charcoal/50 hover:text-brand-gold'}`}
              >
                👥 Network Members ({adminUsers.length})
              </button>
              <button
                onClick={() => { setActiveTab('admin-logs'); fetchAdminInsights(); }}
                className={`pb-2.5 text-xs font-heading font-black tracking-widest uppercase cursor-pointer px-2 border-b-2 transition-all ${activeTab === 'admin-logs' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-charcoal/50 hover:text-brand-gold'}`}
              >
                🛡️ Audit Logs Stream
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 text-xs font-heading font-black tracking-widest uppercase cursor-pointer px-2 border-b-2 transition-all ${activeTab === 'profile' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-charcoal/50 hover:text-brand-gold'}`}
              >
                👤 My Admin Card
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 text-xs font-heading font-black tracking-widest uppercase cursor-pointer px-2 border-b-2 transition-all ${activeTab === 'profile' ? 'border-brand-green text-brand-green' : 'border-transparent text-brand-charcoal/50 hover:text-brand-green'}`}
              >
                🌱 My Membership Card
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-2.5 text-xs font-heading font-black tracking-widest uppercase cursor-pointer px-2 border-b-2 transition-all ${activeTab === 'security' ? 'border-brand-green text-brand-green' : 'border-transparent text-brand-charcoal/50'}`}
              >
                🛡️ PIN & Firmware Guards
              </button>
            </>
          )}

          <div className="ml-auto pb-2.5">
            <button
              onClick={() => {
                localStorage.removeItem('sanop_session_token');
                onLogOut();
                onClose();
              }}
              className="text-xs font-heading font-bold text-red-500 uppercase tracking-wide hover:underline px-2 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
          {activeTab === 'profile' && (
            /* USER CARD SECTION */
            <div className="space-y-6 animate-scale-up">
              <div className="bg-brand-beige-light/30 border border-brand-beige/50 p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-black text-sm text-brand-green uppercase tracking-wide">
                    Ecosystem Biometric ID Card
                  </h3>
                  <p className="text-[11px] text-brand-charcoal/60 leading-relaxed mt-0.5">
                    Your digital Bio-Credential card generates instantly upon authentication. Securely verify your categorization and export your physical badge card.
                  </p>
                </div>
                <button
                  onClick={handlePrintCard}
                  className="bg-brand-green hover:bg-brand-green-dark text-white text-[11px] font-heading font-bold uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer flex items-center gap-2"
                >
                  <span>Print / Save ID Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* Membership Card Visual layout */}
                <div 
                  id="sanop-member-id-card"
                  className={`md:col-span-3 text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl border flex flex-col justify-between h-[270px] transition-all duration-300 ${
                    user.classification === 'depot' 
                      ? 'bg-gradient-to-br from-[#0c1f36] via-[#112d4e] to-[#04080f] border-blue-500/40' 
                      : user.classification === 'retail' 
                        ? 'bg-gradient-to-br from-[#281d09] via-[#43300a] to-[#0d0902] border-amber-500/40'
                        : 'bg-gradient-to-br from-[#091b12] via-[#123020] to-[#030805] border-brand-green/40'
                  }`}
                >
                  
                  {/* Decorative element for depth */}
                  <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute left-1/4 -bottom-10 w-32 h-32 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Chip & hologram mockup */}
                  <div className="absolute right-6 top-16 w-10 h-8 bg-gradient-to-br from-[#ffe07a] to-[#d4af37] rounded-md opacity-80 border border-amber-400/40 shadow-inner flex flex-col justify-around p-1">
                    <div className="h-px bg-yellow-900/15 w-full"></div>
                    <div className="h-px bg-yellow-900/15 w-full"></div>
                    <div className="h-px bg-yellow-900/15 w-full"></div>
                  </div>

                  {/* Top header on card */}
                  <div className="flex justify-between items-start z-1">
                    <div>
                      <span className="text-[9px] font-heading font-black tracking-[0.25em] text-brand-gold uppercase">
                        SANOP ECOSYSTEM • BIO-LENS
                      </span>
                      <h4 className="text-xs font-heading font-bold tracking-widest mt-0.5 text-white">
                        WEST AFRICAN DIGITAL PORTAL CARD
                      </h4>
                    </div>
                    <span className={`text-[8px] font-heading font-black uppercase px-2.5 py-1 rounded-full tracking-wider border ${
                      user.isVerified 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-400/10 text-amber-400 border-amber-400/30 animate-pulse'
                    }`}>
                      ● {user.isVerified ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  {/* Real Biometric Layout */}
                  <div className="flex gap-4 items-center z-1 my-2">
                    {/* User initials placeholder avatar */}
                    <div className="w-14 h-14 rounded-xl bg-brand-beige-dark/20 text-brand-gold font-heading font-black text-lg flex items-center justify-center border-2 border-brand-gold/30 backdrop-blur-xs select-none">
                      {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'SN'}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-sm font-heading font-black text-gray-100 uppercase tracking-wide leading-tight">{user.fullName}</div>
                      <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-white/5 rounded-xs">ID: {user.id.toUpperCase().substring(0,8)}</span>
                        <span>•</span>
                        <span className="text-brand-gold">{user.region} Ghana</span>
                      </div>
                      <div className="text-[9px] text-gray-400 font-mono">
                        Ecosystem Contact: <span className="text-white">{user.phone || 'On-Net'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barcode & Footer info */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-3 z-1">
                    <div className="text-[9px] font-mono">
                      <div className="text-[#888] text-[8px] uppercase tracking-wider mb-0.5">MEMBER CLASSIFICATION</div>
                      <div className={`font-heading font-black uppercase tracking-widest text-[11px] ${
                        user.classification === 'depot' 
                          ? 'text-blue-400' 
                          : user.classification === 'retail' 
                            ? 'text-amber-400'
                            : 'text-brand-green'
                      }`}>
                        {user.classification ? `${user.classification} node` : 'buyer node'}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      {/* Visual Barcode mockup */}
                      <div className="flex gap-0.5 h-6 items-end bg-white/90 px-2 py-0.5 rounded-xs mb-1">
                        {[1,3,1,2,3,1,3,1,4,1,3,1,2,1,3].map((val, idx) => (
                          <div key={idx} className="bg-brand-charcoal" style={{ width: `${val}px`, height: '100%' }} />
                        ))}
                      </div>
                      <span className="text-[8px] text-gray-400 font-mono tracking-widest">
                        MEMB-{user.id.toUpperCase().substring(0,8)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Classification update selector / Bio-credentials panel */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-brand-beige-light border border-brand-beige/50 rounded-2xl p-4">
                    <h4 className="font-heading font-black text-xs text-brand-green uppercase tracking-wider mb-2">
                      Node Verification Selector
                    </h4>
                    <p className="text-[10px] text-brand-charcoal/60 leading-relaxed mb-3">
                      Access roles require classification verification. Set or update your role to authorize ledger credentials immediately:
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleUpdateClassification('buyer')}
                        disabled={loading}
                        className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          user.classification === 'buyer' || !user.classification
                            ? 'bg-brand-green/10 border-brand-green text-brand-green font-bold'
                            : 'bg-white border-brand-beige text-brand-charcoal hover:bg-brand-beige-light'
                        }`}
                      >
                        <span>Buyer Group Target</span>
                        <span className="text-[9px] font-mono bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded-full font-normal">Active</span>
                      </button>

                      <button
                        onClick={() => handleUpdateClassification('retail')}
                        disabled={loading}
                        className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          user.classification === 'retail'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-700 font-bold'
                            : 'bg-white border-brand-beige text-brand-charcoal hover:bg-brand-beige-light'
                        }`}
                      >
                        <span>Retail Merchant</span>
                        <span className="text-[9px] font-mono bg-amber-500/15 text-amber-600 px-1.5 py-0.5 rounded-full font-normal">Merchant</span>
                      </button>

                      <button
                        onClick={() => handleUpdateClassification('depot')}
                        disabled={loading}
                        className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          user.classification === 'depot'
                            ? 'bg-blue-600/10 border-blue-500 text-blue-700 font-bold'
                            : 'bg-white border-brand-beige text-brand-charcoal hover:bg-brand-beige-light'
                        }`}
                      >
                        <span>Depot Operator</span>
                        <span className="text-[9px] font-mono bg-blue-600/15 text-blue-600 px-1.5 py-0.5 rounded-full font-normal">Storage</span>
                      </button>
                    </div>

                    {success && <p className="text-[10px] text-emerald-600 font-medium mt-2">{success}</p>}
                    {error && <p className="text-[10px] text-red-600 font-medium mt-2">{error}</p>}
                  </div>

                  <div className="bg-brand-beige bg-opacity-30 p-3.5 rounded-2xl border border-brand-beige/50 text-[11px] text-brand-charcoal/80 space-y-1.5">
                    <div className="flex justify-between border-b border-brand-beige/40 pb-1 pt-0.5">
                      <span className="text-brand-charcoal/50">Node Contact:</span>
                      <span className="font-bold">{user.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-beige/40 pb-1">
                      <span className="text-brand-charcoal/50">Locality Node:</span>
                      <span className="font-bold">{user.region} Region</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'security' && (
            /* USER PIN MANAGEMENT */
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-brand-beige-light border border-brand-beige p-5 rounded-2xl">
                <div className="flex gap-3 items-start">
                  <Key className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-black text-sm text-brand-green uppercase tracking-wide">
                      Secure Action PIN Verification
                    </h4>
                    <p className="text-[11px] text-brand-charcoal/60 mt-1 leading-relaxed">
                      Every critical bio-transaction, cosmetic diagnostics bookings update, or profile modification within the Sanop network must be authenticated with your personalized Security PIN.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyPIN} className="mt-5 flex gap-3">
                  <input
                    type="password"
                    pattern="\d*"
                    maxLength={6}
                    required
                    value={pinEntry}
                    onChange={(e) => setPinEntry(e.target.value)}
                    placeholder="Key in your PIN (e.g. 1234)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-brand-beige bg-white text-xs outline-none focus:border-brand-green"
                  />
                  <button
                    type="submit"
                    className="bg-brand-green hover:bg-brand-green-hover text-white px-5 rounded-xl text-xs font-semibold uppercase tracking-wide cursor-pointer"
                  >
                    Authenticate PIN
                  </button>
                </form>

                {pinError && <p className="text-xs text-red-600 font-bold mt-2 font-mono">⚠️ {pinError}</p>}
                {pinVerified && <p className="text-xs text-emerald-600 font-bold mt-2">✓ Lock Open: Current PIN is valid and correct.</p>}
              </div>

              <div className="border border-brand-beige p-5 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-xs text-[#1a3a2a]">Forgot your Security PIN?</h4>
                  <p className="text-[10px] text-brand-charcoal/50 leading-relaxed mt-1">
                    Send a 1-click Security Assistance request to the Administrator Desk. Once sent, administrators will see your help request flag next to your profile and generate a secure temporary reset pin.
                  </p>
                </div>
                
                {user.pinResetRequested ? (
                  <span className="text-[10px] bg-amber-400/10 text-amber-500 border border-amber-300/30 px-3 py-1.5 rounded-full font-bold animate-pulse">
                    ⚠️ RESET REQUEST PENDING
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestPINAssistance}
                    className="bg-brand-gold hover:bg-brand-gold-hover text-white text-[11px] font-heading font-black uppercase tracking-widest px-4 py-2.5 rounded-lg shrink-0 cursor-pointer"
                  >
                    Request PIN Assist
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'admin-stats' && adminStats && (
            /* ADMIN INSIGHTS AND DATA COUNTERS */
            <div className="space-y-6">
              
              {/* Dynamic Grid metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-brand-beige-light border border-brand-beige/50 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-brand-charcoal/50 font-heading font-black tracking-wider uppercase">Active In-Network</span>
                  <div className="text-3xl font-heading font-black text-brand-green mt-2">{adminStats.stats.totalUsers}</div>
                  <span className="text-[9px] text-[#666] font-mono mt-1">👥 {adminStats.stats.verifiedUsers} Verified Members</span>
                </div>
                
                <div className="bg-brand-beige-light border border-brand-beige/50 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-brand-charcoal/50 font-heading font-black tracking-wider uppercase">Fulfillment orders</span>
                  <div className="text-3xl font-heading font-black text-brand-green mt-2">{adminStats.stats.totalOrders}</div>
                  <span className="text-[9px] text-emerald-600 font-mono mt-1 font-bold">💳 ${adminStats.stats.ordersVolume.toFixed(2)} Vol.</span>
                </div>

                <div className="bg-brand-beige-light border border-brand-beige/50 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-brand-charcoal/50 font-heading font-black tracking-wider uppercase">Clinics booked</span>
                  <div className="text-3xl font-heading font-black text-brand-green mt-2">{adminStats.stats.totalConsultations}</div>
                  <span className="text-[9px] text-[#666] font-mono mt-1">🔬 Diagnostics Registry</span>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-amber-800/80 font-heading font-black tracking-wider uppercase">Pending PIN Resets</span>
                  <div className="text-3xl font-heading font-black text-amber-600 mt-2">{adminStats.stats.pinRequests}</div>
                  <span className="text-[9px] text-amber-700/80 font-mono mt-1 font-semibold">⚠️ Action required desk</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent diagnostic appointments (Real data stored) */}
                <div className="bg-white border border-brand-beige rounded-2xl p-5">
                  <h4 className="font-heading font-black text-xs text-[#1a3a2a] uppercase tracking-wider mb-3">
                    Recent Diagnostic Bookings
                  </h4>
                  {adminStats.consultations.length > 0 ? (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto">
                      {adminStats.consultations.map((c) => (
                        <div key={c.id} className="p-3 bg-brand-beige-light/50 border border-brand-beige rounded-xl text-xs">
                          <div className="flex justify-between items-start font-bold text-brand-green">
                            <span>{c.name}</span>
                            <span className="font-mono text-[9px] bg-brand-beige text-brand-gold px-2 py-0.5 rounded-full">{c.date}</span>
                          </div>
                          <div className="text-[10px] text-[#666] mt-1">Scope: <span className="font-semibold text-brand-charcoal">{c.scope}</span></div>
                          <div className="text-[10px] text-[#666]">Contact: {c.phone} • {c.email}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-brand-charcoal/40 py-6 text-center">No diagnostic sessions registered in the database yet.</p>
                  )}
                </div>

                {/* Recent checkout orders (Real data stored) */}
                <div className="bg-white border border-brand-beige rounded-2xl p-5">
                  <h4 className="font-heading font-black text-xs text-[#1a3a2a] uppercase tracking-wider mb-3">
                    Recent Ecosystem Orders Log
                  </h4>
                  {adminStats.orders.length > 0 ? (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto">
                      {adminStats.orders.map((o) => (
                        <div key={o.id} className="p-3 bg-brand-beige-light/50 border border-brand-beige rounded-xl text-xs">
                          <div className="flex justify-between font-bold text-brand-green">
                            <span>{o.customerName}</span>
                            <span className="font-mono text-brand-gold">${o.total.toFixed(2)}</span>
                          </div>
                          <p className="text-[10px] text-[#666] mt-1 font-semibold truncate">Email: {o.customerEmail}</p>
                          <p className="text-[10px] text-brand-charcoal/60 mt-0.5">
                            Items ({o.items.length}): {o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-brand-charcoal/40 py-6 text-center">No shop orders processed yet.</p>
                  )}
                </div>

              </div>

            </div>
          )}

          {activeTab === 'admin-users' && (
            /* SECURED USER LIST & VERIFICATION CONTROL & PIN RESET DESK */
            <div className="space-y-4">
              
              {/* Reset Password Info banner */}
              {overrideTempPin && selectedUserForReset && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2 animate-bounce">
                  <h4 className="font-heading font-black text-sm text-emerald-800 uppercase tracking-wide">
                    🗝️ Live Credentials Overwrite Output
                  </h4>
                  <p className="text-xs text-emerald-700">
                    A secure, strong temporary PIN has been successfully forced for user <strong className="font-black text-emerald-900">{selectedUserForReset}</strong>:
                  </p>
                  <div className="p-3 bg-white border border-emerald-200 rounded-lg inline-flex items-center gap-3">
                    <span className="font-mono text-lg font-black tracking-widest text-[#1a3a2a]">{overrideTempPin}</span>
                    <span className="text-[9px] bg-brand-gold text-white font-bold px-2 py-1 rounded-sm uppercase">Copy to Desk</span>
                  </div>
                  <p className="text-[10px] text-emerald-600">
                    * The previous PIN hash has been purged. Give this numeric code to the user. They must replace it immediately inside their guards panel.
                  </p>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-brand-beige text-[10px] font-heading font-black uppercase tracking-wider text-brand-charcoal/50 bg-brand-beige-light/30">
                      <th className="py-3 px-3">Ecosystem Name</th>
                      <th className="py-3 px-3">Contact Email</th>
                      <th className="py-3 px-3">Ghana Region</th>
                      <th className="py-3 px-3">Verification Badge</th>
                      <th className="py-3 px-3">PIN Assist Flag</th>
                      <th className="py-3 px-3 text-right">Actions Panel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u) => (
                      <tr key={u.id} className="border-b border-brand-beige/50 text-xs hover:bg-brand-beige-light/20 transition-colors">
                        <td className="py-3 px-3 font-bold text-[#1a3a2a]">{u.fullName}</td>
                        <td className="py-3 px-3 font-mono">{u.email}</td>
                        <td className="py-3 px-3">{u.region}</td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleVerification(u.id, u.isVerified)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer ${u.isVerified ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-50 text-red-600 hover:bg-red-100 animate-pulse'}`}
                          >
                            {u.isVerified ? '✓ Approved' : '● Verify User'}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          {u.pinResetRequested ? (
                            <span className="text-[9px] font-black bg-amber-400/10 text-amber-600 border border-amber-300/30 px-2 py-1 rounded-md animate-pulse">
                              ⚠️ PIN LOCK ASSIST
                            </span>
                          ) : (
                            <span className="text-[9px] text-brand-charcoal/40 font-mono">Secured</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5 min-w-[200px]">
                          <button
                            onClick={() => handleAdminResetUserPIN(u.id, u.fullName)}
                            title="Force PIN Overwrite Helper"
                            className="bg-brand-gold hover:bg-brand-gold-hover text-white text-[10px] font-heading font-black uppercase tracking-wide px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Reset PIN
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUserAccount(u.id)}
                            title="Purge profile"
                            className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer inline-flex items-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {adminUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-brand-charcoal/40">No registered users in system registry.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === 'admin-logs' && (
            /* REAL-TIME SECURITY AUDIT STREAM */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-brand-gold font-heading font-black tracking-widest uppercase">
                  SECURITY AND INTEGRITY LOGSTREAM
                </span>
                <button
                  onClick={fetchAdminInsights}
                  className="p-1 px-3 text-[10px] border border-brand-beige rounded-lg hover:bg-brand-beige-light flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3" /> Refresh Logs
                </button>
              </div>

              <div className="bg-[#111] text-gray-300 rounded-2xl font-mono text-[11px] p-4 max-h-[400px] overflow-y-auto border border-gray-800 space-y-2 text-left">
                {adminLogs.map((log) => {
                  // highlight suspicious events
                  const isSuspicious = log.action === 'MALICIOUS_ACCESS_BLOCKED' || log.action === 'LOGIN_FAILED';
                  return (
                    <div key={log.id} className={`p-2 rounded-lg border leading-relaxed ${isSuspicious ? 'bg-red-950/20 border-red-900/40 text-red-300' : 'bg-transparent border-gray-900 text-gray-300'}`}>
                      <div className="flex justify-between text-[10px] text-gray-500 font-semibold mb-0.5">
                        <span>[{new Date(log.timestamp).toLocaleTimeString()}] IP: {log.ip}</span>
                        <span className={isSuspicious ? 'text-red-400 font-black' : 'text-brand-gold'}>
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[11px]"><strong className="text-white">Actor:</strong> {log.userEmail || 'Anonymous Guest'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{log.details}</p>
                    </div>
                  );
                })}
                {adminLogs.length === 0 && (
                  <p className="text-center py-6 text-gray-600">No system security logs cached.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info brand */}
        <div className="px-6 py-4 bg-brand-beige-light/40 border-t border-brand-beige/50 text-center flex justify-between items-center text-[10px] font-mono text-brand-charcoal/40 shrink-0">
          <span>Sanop Security Protocol: PBKDF2 Hashed Keys • 256-Bit Cryptographics</span>
          <span>© 2026 Sanop Group, Volta, Ghana.</span>
        </div>

      </div>
    </div>
  );
}
