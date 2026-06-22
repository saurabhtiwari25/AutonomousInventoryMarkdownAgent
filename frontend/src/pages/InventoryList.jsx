import { useState, useEffect } from 'react';
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../api';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    category: '',
    stock_quantity: 0,
    unit_cost: 0,
    current_price: 0,
    monthly_sales: 0
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.product_id);
      setFormData({
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
        stock_quantity: item.stock_quantity,
        unit_cost: item.unit_cost,
        current_price: item.current_price,
        monthly_sales: item.monthly_sales || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        product_id: '',
        product_name: '',
        category: '',
        stock_quantity: 0,
        unit_cost: 0,
        current_price: 0,
        monthly_sales: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInventoryItem(editingId, formData);
      } else {
        await createInventoryItem(formData);
      }
      handleCloseModal();
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert('Failed to save item');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm(`Are you sure you want to delete ${productId}?`)) {
      try {
        await deleteInventoryItem(productId);
        fetchInventory();
      } catch (err) {
        console.error(err);
        alert('Failed to delete item');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'product_id' || name === 'product_name' || name === 'category' ? value : Number(value)
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Inventory Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading inventory...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Cost</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No inventory items found. Upload some or create manually!</td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.product_id}>
                      <td>{item.product_id}</td>
                      <td>{item.product_name}</td>
                      <td>{item.category}</td>
                      <td>
                        <span style={{ color: item.stock_quantity <= 0 ? 'var(--danger)' : 'inherit' }}>
                           {item.stock_quantity}
                        </span>
                      </td>
                      <td>₹{item.unit_cost.toFixed(2)}</td>
                      <td>₹{item.current_price.toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--accent-primary)' }}
                            onClick={() => handleOpenModal(item)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--danger)' }}
                            onClick={() => handleDelete(item.product_id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Product ID</label>
                <input required type="text" name="product_id" value={formData.product_id} onChange={handleChange} disabled={!!editingId} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Name</label>
                <input required type="text" name="product_name" value={formData.product_name} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Category</label>
                <input required type="text" name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Stock Qty</label>
                  <input required type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Monthly Sales</label>
                  <input type="number" name="monthly_sales" value={formData.monthly_sales} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Unit Cost (₹)</label>
                  <input required type="number" step="0.01" name="unit_cost" value={formData.unit_cost} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label>Current Price (₹)</label>
                  <input required type="number" step="0.01" name="current_price" value={formData.current_price} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem' }} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Item</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
