import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Activity, ShieldAlert, FileText, Settings as SettingsIcon, Package, HelpCircle } from 'lucide-react';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const navItemClass = ({ isActive }) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "justify-center gap-3 w-full h-10 text-[13px] font-normal no-underline",
      isActive
        ? "bg-secondary text-foreground font-medium"
        : "text-muted-foreground"
    );

  return (
    <aside className="w-[240px] bg-background border-r border-border flex flex-col shrink-0">
      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 pt-3 flex-1">
        <NavLink to="/" className={navItemClass} end>
          <LayoutDashboard size={15} />
          Dashboard
        </NavLink>
        <NavLink to="/upload" className={navItemClass}>
          <UploadCloud size={15} />
          Upload
        </NavLink>
        <NavLink to="/inventory-list" className={navItemClass}>
          <Package size={15} />
          Inventory
        </NavLink>
        <NavLink to="/analyze" className={navItemClass}>
          <Activity size={15} />
          Analysis
        </NavLink>
        <NavLink to="/monitor" className={navItemClass}>
          <ShieldAlert size={15} />
          Monitor
        </NavLink>
        <NavLink to="/reports" className={navItemClass}>
          <FileText size={15} />
          Reports
        </NavLink>

        <div className="flex-1" />

        <div className="border-t border-border pt-2 pb-2 mt-2 flex flex-col gap-0.5">
          <NavLink to="/settings" className={navItemClass}>
            <SettingsIcon size={15} />
            Settings
          </NavLink>
          <NavLink to="/help" className={navItemClass}>
            <HelpCircle size={15} />
            Help
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
