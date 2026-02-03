import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Search, 
  Bell, 
  Boxes,
  Briefcase,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import './App.css';

// Views
import DashboardView from './views/DashboardView';
import InventoryView from './views/InventoryView';
import SettingsView from './views/SettingsView';

function App() {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('stockflow_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('stockflow_settings');
    return saved ? JSON.parse(saved) : {
      adminName: 'Kashif Ali',
      orgName: 'StockFlow ERP',
      currency: 'PKR',
      lowStockThreshold: 5
    };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    localStorage.setItem('stockflow_v1', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('stockflow_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const stats = {
    totalItems: inventory.reduce((acc, curr) => acc + curr.qty, 0),
    totalValuation: inventory.reduce((acc, curr) => {
      const val = parseFloat(curr.valuation.replace(/,/g, ''));
      return acc + val;
    }, 0).toLocaleString(),
    lowStock: inventory.filter(item => item.qty < settings.lowStockThreshold).length
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notifications = inventory
    .filter(item => item.qty < settings.lowStockThreshold)
    .map(item => ({
      id: item.id,
      text: `Low stock alert: ${item.name} (${item.qty} units left)`,
      type: 'warning'
    }));

  const renderView = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardView 
          inventory={inventory} 
          stats={stats} 
          settings={settings} 
          onNavigate={setActiveTab} 
        />;
      case 'inventory':
        return <InventoryView 
          inventory={filteredInventory} 
          setInventory={setInventory} 
          settings={settings} 
          showToast={showToast}
        />;
      case 'settings':
        return <SettingsView 
          settings={settings} 
          setSettings={setSettings} 
          inventory={inventory}
          setInventory={setInventory}
          showToast={showToast}
          onNavigate={setActiveTab}
        />;
      default:
        return <DashboardView inventory={inventory} stats={stats} settings={settings} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Toast System */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <Boxes size={32} />
          <div>{settings.orgName.split(' ')[0]}<span>{settings.orgName.split(' ')[1] || 'Flow'}</span></div>
        </div>
        
        <nav className="nav-links">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={20} />
            <span>Inventory</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', padding: '10px' }}>
           <div className="nav-item" onClick={() => showToast('Enterprise features coming soon!', 'warning')}>
             <Briefcase size={20} />
             <span>Enterprise Plan</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Global search SKU, items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <X size={14} className="clear-search" onClick={() => setSearchQuery('')} />}
          </div>
          
          <div className="profile-section">
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} color="#64748b" />
                {notifications.length > 0 && <div className="notification-dot"></div>}
              </div>

              {showNotifications && (
                <div className="notification-dropdown">
                  <h4>Notifications</h4>
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="notification-item">
                          <AlertTriangle size={14} color="var(--warning)" />
                          <span>{n.text}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No new alerts</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="admin-profile" onClick={() => setActiveTab('settings')} style={{ cursor: 'pointer' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{settings.adminName}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Logistics Lead</p>
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
}

export default App;
