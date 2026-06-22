export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2>General Configurations</h2>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Maximum Allowed Markdown (%)</label>
            <input 
              type="number" 
              defaultValue={30} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Default Risk Threshold</label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option>Conservative (Requires approval for Medium/High)</option>
              <option>Moderate (Requires approval for High)</option>
              <option>Aggressive (Auto-approve all)</option>
            </select>
          </div>
          
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
