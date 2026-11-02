import { useEffect, useState } from 'react';
import { Search, Bell, UserCircle2, Menu, ChevronDown, ArrowUpRight, LogOut, CalendarClock, AlertCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabase';
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
export default function AdminHeader({onMenuClick}) {
  const navigate=useNavigate();
  const {canManage,employee,role} = useAuth();
  const [query,setQuery]=useState('');
  const [panel,setPanel]=useState(null);
  const [followups,setFollowups]=useState({today:0,overdue:0});
  useEffect(()=>{let alive=true;supabase.from('leads').select('next_follow_up_date').then(({data})=>{if(!alive)return;const today=new Date().toLocaleDateString('en-CA');setFollowups({today:(data||[]).filter(x=>x.next_follow_up_date===today).length,overdue:(data||[]).filter(x=>x.next_follow_up_date && x.next_follow_up_date<today).length});});return ()=>{alive=false;};},[]);
  const search=(where)=>{const q=query.trim();if(!q)return;setPanel(null);navigate(`/admin/${canManage ? where : 'leads'}?search=${encodeURIComponent(q)}`);};
  const signOut=async()=>{try{await logout();toast.success('Signed out');navigate('/admin',{replace:true});}catch(err){toast.error(err.message||'Sign out failed');}};
  return <header className="crm-header admin-header">
    <div className="crm-header-name"><button className="crm-menu-toggle" onClick={onMenuClick} aria-label="Open navigation"><Menu size={22}/></button><div><h1>RealEstate Demo <span>CRM</span></h1><p>Property management, made simple</p></div></div>
    <div className="crm-header-actions">
      <div className="crm-global-search"><Search size={18}/><input aria-label="Search properties and leads" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')search('leads')}} placeholder={canManage ? "Search properties or leads…" : "Search assigned leads…"}/>{query.trim() && <div className="crm-search-options"><button onClick={()=>search('leads')}>Search leads</button>{canManage && <button onClick={()=>search('properties')}>Search properties</button>}</div>}</div>
      <div className="crm-popover-anchor"><button className="crm-icon-button" aria-label="Notifications" aria-expanded={panel==='notifications'} onClick={()=>setPanel(panel==='notifications'?null:'notifications')}><Bell size={20}/>{(followups.today+followups.overdue)>0&&<span className="crm-dot"/>}</button>{panel==='notifications' && <div className="crm-popover"><div className="crm-popover-title">Follow-up reminders <button onClick={()=>setPanel(null)} aria-label="Close"><X size={16}/></button></div><Link onClick={()=>setPanel(null)} to="/admin/leads?followup=today"><CalendarClock size={17}/> {followups.today} due today</Link><Link onClick={()=>setPanel(null)} to="/admin/leads?followup=overdue"><AlertCircle size={17}/> {followups.overdue} overdue</Link></div>}</div>
      <div className="crm-popover-anchor"><button className="crm-profile" aria-expanded={panel==='profile'} onClick={()=>setPanel(panel==='profile'?null:'profile')}><UserCircle2 size={32}/><span><strong>{employee?.full_name || (role === "admin" ? "Administrator" : "Manager")}</strong><small>{role || "Account"}</small></span><ChevronDown size={15}/></button>{panel==='profile' && <div className="crm-popover crm-profile-menu"><Link to="/" onClick={()=>setPanel(null)}><ArrowUpRight size={17}/> View website</Link><button onClick={signOut}><LogOut size={17}/> Sign out</button></div>}</div>
    </div>
  </header>;
}
