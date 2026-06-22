import { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadInventory } from '../api';

export default function InventoryUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setSuccessMsg("");

    try {
      const res = await uploadInventory(file);
      setSuccessMsg(`Successfully uploaded ${res.saved_count} items!`);
      setTimeout(() => navigate('/inventory-list'), 1500);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Inventory Data</h1>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div 
          className="upload-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <Upload size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
          <h3>Drag & Drop CSV/JSON File</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>or click to browse</p>
          <input 
            id="file-upload" 
            type="file" 
            accept=".csv,.json" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600' }}>Expected CSV Format</h4>
          <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Your file should include the following columns and look like this:
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
            <pre style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`product_id,product_name,category,stock_quantity,unit_cost,current_price,monthly_sales
P001,Premium Wireless Headphones,Electronics,150,45.50,129.99,35
P002,Ergonomic Office Chair,Furniture,42,85.00,249.99,12`}
            </pre>
          </div>
        </div>
        
        {file && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <File size={24} color="var(--accent-primary)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{file.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{(file.size / 1024).toFixed(2)} KB</div>
            </div>
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Process File'}
            </button>
          </div>
        )}

        {successMsg && (
           <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(46, 213, 115, 0.1)', color: 'var(--success)', borderRadius: '0.5rem', textAlign: 'center' }}>
             {successMsg}
           </div>
        )}
      </div>
    </div>
  );
}
