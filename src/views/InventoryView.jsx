import React, { useState } from 'react';
import { Truck, PlusCircle, Filter, PackageOpen, LayoutList, Trash2, Edit3, X } from 'lucide-react';

function InventoryView({ inventory, setInventory, settings, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    qty: '',
    price: '',
    status: 'In Stock'
  });

  const [filterLowStock, setFilterLowStock] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'itemName' ? 'name' : id === 'itemQty' ? 'qty' : id === 'itemPrice' ? 'price' : 'status']: value
    }));
  };

  const addItem = () => {
    const { name, qty, price, status } = formData;

    if (!name || !qty || !price) {
      showToast("Please fill all logistics data", "warning");
      return;
    }

    const item = {
      id: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      name,
      qty: parseInt(qty),
      valuation: (qty * price).toLocaleString(),
      price: parseFloat(price),
      status
    };

    setInventory(prev => [...prev, item]);
    showToast(`${name} added to inventory!`);
    
    setFormData({
      name: '',
      qty: '',
      price: '',
      status: 'In Stock'
    });
  };

  const deleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this SKU?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
      showToast("Item removed from record", "warning");
    }
  };

  const startEdit = (item) => {
    setEditingItem({ ...item });
  };

  const saveEdit = () => {
    if (!editingItem.name || !editingItem.qty || !editingItem.price) {
      showToast("Please fill all fields", "warning");
      return;
    }

    const updatedItem = {
      ...editingItem,
      valuation: (editingItem.qty * editingItem.price).toLocaleString()
    };

    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
    showToast(`${updatedItem.id} updated!`);
  };

  const displayInventory = filterLowStock 
    ? inventory.filter(item => item.qty < settings.lowStockThreshold) 
    : inventory;

  return (
    <div className="view-fade-in" style={{ maxWidth: '100%' }}>
      <div className="content-grid">
        <section className="data-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}><Truck size={24} color="#6366f1" /> Inventory Repository</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`filter-btn ${filterLowStock ? 'active' : ''}`}
                onClick={() => setFilterLowStock(!filterLowStock)}
              >
                <Filter size={14} /> {filterLowStock ? 'Showing Low Stock' : 'All Stock'}
              </button>
              <div className="view-toggle">
                <LayoutList size={16} className="active" />
                <PackageOpen size={16} />
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>SKU ID</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Valuation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...displayInventory].reverse().map(i => (
                  <tr key={i.id}>
                    <td><span className="sku-tag">{i.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{i.name}</td>
                    <td style={{ color: i.qty < settings.lowStockThreshold ? 'var(--danger)' : 'inherit', fontWeight: i.qty < settings.lowStockThreshold ? 700 : 400 }}>
                      {i.qty} Units
                    </td>
                    <td>{settings.currency} {i.valuation}</td>
                    <td>
                      <span className={`status-badge ${i.status === 'In Stock' ? 'status-in-stock' : 'status-on-order'}`}>
                        {i.status === 'In Stock' ? '● ' : '○ '}{i.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-icon-edit" onClick={() => startEdit(i)} title="Edit Item">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn-icon btn-icon-delete" onClick={() => deleteItem(i.id)} title="Delete Item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayInventory.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                       <div style={{ marginBottom: '10px' }}><PackageOpen size={40} opacity={0.3} /></div>
                       No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="entry-card">
          <h3 style={{ marginBottom: '20px' }}><PlusCircle size={20} color="#6366f1" /> Rapid Inflow</h3>
          <div className="input-group">
            <div className="field">
              <label>Item Name / Description</label>
              <input 
                type="text" 
                id="itemName" 
                placeholder="e.g. Server Rack"
                value={formData.name}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <div className="field">
              <label>Stock Quantity</label>
              <input 
                type="number" 
                id="itemQty" 
                placeholder="Units"
                value={formData.qty}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <div className="field">
              <label>Cost Unit ({settings.currency})</label>
              <input 
                type="number" 
                id="itemPrice" 
                placeholder="Per unit"
                value={formData.price}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <div className="field">
              <label>Logistics Status</label>
              <select 
                id="itemStatus"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="In Stock">In Stock (Warehouse)</option>
                <option value="On Order">On Order (Transit)</option>
              </select>
            </div>
            <button onClick={addItem} className="btn-update">
              Commit Entry
            </button>
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Edit SKU: {editingItem.id}</h3>
              <button className="btn-icon" onClick={() => setEditingItem(null)}><X size={20} /></button>
            </div>
            <div className="input-group">
              <div className="field">
                <label>Item Description</label>
                <input 
                  type="text" 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Quantity</label>
                <input 
                  type="number" 
                  value={editingItem.qty}
                  onChange={(e) => setEditingItem({ ...editingItem, qty: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="field">
                <label>Price ({settings.currency})</label>
                <input 
                  type="number" 
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="field">
                <label>Status</label>
                <select 
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="On Order">On Order</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingItem(null)}>Cancel</button>
              <button className="btn-update" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryView;
