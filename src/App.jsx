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
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Menu
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className={`dashboard-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'show' : ''}`}>
        <button 
          className="sidebar-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>
            <Boxes size={42} color="var(--primary-light)" style={{ filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.5))' }} />
            {!isCollapsed && (
              <div>{settings.orgName.split(' ')[0]}<span>{settings.orgName.split(' ')[1] || 'Flow'}</span></div>
            )}
          </div>
          {isMobileMenuOpen && (
            <button className="close-mobile-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} color="white" />
            </button>
          )}
        </div>
        
        <nav className="nav-links">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            title={isCollapsed ? "Dashboard" : ""}
          >
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </div>
          <div 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}
            title={isCollapsed ? "Inventory" : ""}
          >
            <Package size={20} />
            {!isCollapsed && <span>Inventory</span>}
          </div>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings size={20} />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </nav>

        <div style={{ marginTop: 'auto', padding: isCollapsed ? '0' : '10px' }}>
           <div 
            className="nav-item" 
            onClick={() => { showToast('Enterprise features coming soon!', 'warning'); setIsMobileMenuOpen(false); }}
            title={isCollapsed ? "Enterprise Plan" : ""}
           >
             <Briefcase size={20} />
             {!isCollapsed && <span>Enterprise Plan</span>}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} color="#64748b" />
            </button>
            <div className="mobile-brand">
              <Boxes size={24} color="var(--primary)" />
              <span>StockFlow</span>
            </div>
          </div>

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
              <div className="avatar-placeholder">{settings.adminName.charAt(0)}</div>
              <div className="profile-info">
                <p className="admin-name">{settings.adminName}</p>
                <p className="admin-role">Logistics Lead</p>
              </div>
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
}

export default App;
