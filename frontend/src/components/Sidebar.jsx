import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Activity, ShieldAlert, FileText, Settings as SettingsIcon, Package, HelpCircle } from 'lucide-react';
import CustomDocumentIcon from './CustomDocumentIcon';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ justifyContent: 'center' }}>
        <CustomDocumentIcon size={32} />
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UploadCloud size={20} />
          Inventory Upload
        </NavLink>
        <NavLink to="/inventory-list" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          Inventory List
        </NavLink>
        <NavLink to="/analyze" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={20} />
          Analysis
        </NavLink>
        <NavLink to="/monitor" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShieldAlert size={20} />
          Agent Monitor
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          Reports
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <SettingsIcon size={20} />
          Settings
        </NavLink>
        <NavLink to="/help" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <HelpCircle size={20} />
          Help
        </NavLink>
      </nav>
    </aside>
  );
}
