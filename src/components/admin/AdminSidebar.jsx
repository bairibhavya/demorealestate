import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, PlusSquare, Users, FileBarChart2, LogOut, ArrowUpRight, X, House, UserRoundPlus, CalendarClock, MapPinned, BadgeIndianRupee, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
const managerNav = [
 {label:'Dashboard',to:'/admin/dashboard',icon:LayoutDashboard},
 {label:'Properties',to:'/admin/properties',icon:Building2},
 {label:'Add Property',to:'/admin/AddProperty',icon:PlusSquare},
 {label:'Employees',to:'/admin/employees',icon:UserRoundPlus},
 {label:'Customer Leads',to:'/admin/leads',icon:Users},
 {label:'Follow-ups',to:'/admin/followups',icon:CalendarClock},
 {label:'Site Visits',to:'/admin/site-visits',icon:MapPinned},
 {label:'Bookings & Sales',to:'/admin/sales',icon:BadgeIndianRupee},
 {label:'Reports',to:'/admin/reports',icon:FileBarChart2},
];
const staffNav = [
 {label:'My Workspace',to:'/admin/my-work',icon:ClipboardList},
 {label:'My Leads',to:'/admin/leads',icon:Users},
 {label:'My Follow-ups',to:'/admin/followups',icon:CalendarClock},
 {label:'My Site Visits',to:'/admin/site-visits',icon:MapPinned},
];
export default function AdminSidebar({open=false,onClose=()=>{}}) {
 const navigate=useNavigate(); const {canManage}=useAuth();
 const signOut=async()=>{try {await logout();toast.success('Signed out');navigate('/admin',{replace:true});}catch(err){toast.error(err.message||'Could not sign out');}};
 const nav=canManage?managerNav:staffNav;
 return <aside className={`crm-sidebar admin-sidebar ${open?'is-open':''}`} aria-label="CRM navigation">
  <div className="crm-sidebar-brand"><div className="crm-brand-mark"><House size={23} strokeWidth={2.4}/></div><div><strong>RealEstate <span>Demo</span></strong><small>PROPERTY & SALES CRM</small></div><button type="button" className="crm-close-menu" onClick={onClose} aria-label="Close menu"><X size={20}/></button></div>
  <div className="crm-sidebar-caption">WORKSPACE</div>
  <nav className="crm-nav">{nav.map(({label,to,icon:Icon})=><NavLink key={to} to={to} onClick={onClose} className={({isActive})=>`crm-nav-link ${isActive?'active':''}`}><Icon size={19}/><span>{label}</span></NavLink>)}</nav>
  <div className="crm-sidebar-foot"><Link to="/" className="crm-site-link" onClick={onClose}><ArrowUpRight size={18}/> Back to website</Link><button type="button" onClick={signOut} className="crm-signout"><LogOut size={18}/> Sign out</button></div>
 </aside>;
}
