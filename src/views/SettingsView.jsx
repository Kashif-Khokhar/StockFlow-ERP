import React from 'react';
import { User, Building, Coins, ShieldCheck, Download, Trash2, Github, Cloud } from 'lucide-react';

function SettingsView({ settings, setSettings, inventory, setInventory, showToast, onNavigate }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ inventory, settings }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'stockflow_export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast("Catalog exported successfully!");
  };

  const handlePurge = () => {
    if (window.confirm("CRITICAL: Are you sure you want to delete all logistics data? This action cannot be undone.")) {
      setInventory([]);
      localStorage.removeItem('stockflow_v1');
      showToast("System purged successfully", "warning");
      onNavigate('dashboard');
    }
  };

  return (
    <div className="view-fade-in" style={{ maxWidth: '900px' }}>
      <section className="data-card">
        <h3><User size={24} color="#6366f1" /> System Localization</h3>
        <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div className="field">
            <label>Admin Display Name</label>
            <div className="input-with-icon">
              <input 
                type="text" 
                name="adminName"
                value={settings.adminName}
                onChange={handleChange}
              />
              <User size={16} className="icon-overlay" />
            </div>
          </div>
          <div className="field">
            <label>Organization Label</label>
            <div className="input-with-icon">
              <input 
                type="text" 
                name="orgName"
                value={settings.orgName}
                onChange={handleChange}
              />
              <Building size={16} className="icon-overlay" />
            </div>
          </div>
          <div className="field">
            <label>Operating Currency</label>
            <div className="input-with-icon">
              <select 
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >
                <option value="PKR">PKR (₨)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
              <Coins size={16} className="icon-overlay" />
            </div>
          </div>
          <div className="field">
            <label>Low Stock Warning Threshold</label>
            <div className="input-with-icon">
              <input 
                type="number" 
                name="lowStockThreshold"
                value={settings.lowStockThreshold}
                onChange={handleChange}
              />
              <ShieldCheck size={16} className="icon-overlay" />
            </div>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <section className="data-card border-success">
          <div className="card-header">
             <h3>Data Management</h3>
             <Cloud size={20} color="var(--success)" />
          </div>
          <p className="card-desc">Download your entire warehouse catalog in local JSON format for backup.</p>
          <button className="btn-action btn-success" onClick={handleExport}>
            <Download size={18} /> Run Export
          </button>
        </section>

        <section className="data-card border-danger">
          <div className="card-header">
             <h3>System Security</h3>
             <Trash2 size={20} color="var(--danger)" />
          </div>
          <p className="card-desc">Permanently wipe all local logistics data and reset system to factory.</p>
          <button className="btn-action btn-danger" onClick={handlePurge}>
            <Trash2 size={18} /> Purge System
          </button>
        </section>

        <section className="data-card border-blue">
          <div className="card-header">
             <h3>Developers</h3>
             <Github size={20} color="var(--primary)" />
          </div>
          <p className="card-desc">StockFlow ERP v2.0.1. Explore the documentation and source on GitHub.</p>
          <button className="btn-action btn-blue" onClick={() => window.open('https://github.com/Kashif-Khokhar/Inventory-Supply-Chain-Management', '_blank')}>
            <Github size={18} /> Open Repository
          </button>
        </section>
      </div>
    </div>
  );
}

export default SettingsView;
