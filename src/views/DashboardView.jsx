import React from 'react';
import { Package, DollarSign, AlertCircle, TrendingUp, History, ArrowRight } from 'lucide-react';

function DashboardView({ inventory, stats, settings, onNavigate }) {
  // Simple CSS Chart Data
  const categories = inventory.reduce((acc, curr) => {
    const existing = acc.find(c => c.name === curr.name);
    if (existing) {
      existing.value += curr.qty;
    } else {
      acc.push({ name: curr.name, value: curr.qty });
    }
    return acc;
  }, []).sort((a,b) => b.value - a.value).slice(0, 5);

  const maxValue = categories.length > 0 ? Math.max(...categories.map(c => c.value)) : 0;

  return (
    <div className="view-fade-in" style={{ maxWidth: '100%' }}>
      <div className="stats-grid">
        <div className="stat-card clickable" onClick={() => onNavigate('inventory')}>
          <div className="stat-info">
            <h4>Total Inventory</h4>
            <p>{stats.totalItems}</p>
          </div>
          <div className="stat-icon icon-blue">
            <Package size={24} />
          </div>
        </div>
        <div className="stat-card clickable" onClick={() => onNavigate('inventory')}>
          <div className="stat-info">
            <h4>Global Valuation</h4>
            <p>{settings.currency} {stats.totalValuation}</p>
          </div>
          <div className="stat-icon icon-green">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="stat-card clickable" onClick={() => onNavigate('inventory')}>
          <div className="stat-info">
            <h4>Low Stock Alerts</h4>
            <p>{stats.lowStock}</p>
          </div>
          <div className="stat-icon icon-orange">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      <div className="content-grid">
        <section className="data-card">
          <h3><TrendingUp size={24} color="#6366f1" /> Inventory Distribution</h3>
          <div className="chart-container">
             {categories.length > 0 ? (
               <div className="bar-chart">
                 {categories.map(cat => (
                   <div key={cat.name} className="chart-item">
                     <div className="chart-label">
                       <span>{cat.name}</span>
                       <span>{cat.value} Units</span>
                     </div>
                     <div className="chart-bar-bg">
                       <div 
                         className="chart-bar-fill" 
                         style={{ width: `${(cat.value / maxValue) * 100}%` }}
                       ></div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="empty-chart">
                 <p>No inventory data available for analytics.</p>
               </div>
             )}
          </div>
        </section>

        <section className="data-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}><History size={20} color="#6366f1" /> Recent Drops</h3>
            <button className="text-btn" onClick={() => onNavigate('inventory')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {inventory.slice(-4).reverse().map(item => (
              <div key={item.id} className="recent-item">
                <div className="icon-badge">
                   <Package size={16} color="var(--primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>{item.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem' }}>+{item.qty}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Stock In</p>
                </div>
              </div>
            ))}
            {inventory.length === 0 && <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', padding: '20px' }}>No recent activity.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardView;
