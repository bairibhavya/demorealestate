import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Download, Search, Phone, Mail, Users, SlidersHorizontal, Copy, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import "./Leads.css";

export default function Leads() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState(params.get("search") || "");
  const [statusFilter,setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { setSearch(params.get("search") || ""); }, [params]);
  useEffect(() => {
    let live = true;
    async function load() {
      const {data, error} = await supabase.from("leads").select("*").order("created_at", {ascending:false});
      if (!live) return;
      if(error) toast.error(error.message);
      setLeads(data || []); setLoading(false);
    }
    load();
    const channel = supabase.channel('crm-leads-update').on('postgres_changes', {event:'*',schema:'public',table:'leads'}, load).subscribe();
    return () => {live = false; supabase.removeChannel(channel);};
  }, []);
  const filteredLeads = useMemo(() => {
    const q=search.trim().toLocaleLowerCase();
    const status=params.get('status') || statusFilter; const followup=params.get('followup');
    const today=new Date().toLocaleDateString('en-CA');
    return leads.filter(lead => {
      if (status && (lead.status || 'New') !== status) return false;
      if (followup === 'today' && lead.next_follow_up_date !== today) return false;
      if (followup === 'overdue' && (!lead.next_follow_up_date || lead.next_follow_up_date >= today)) return false;
      if (!q) return true;
      return [lead.name,lead.phone,lead.email,lead.employee_name,lead.employee_id,lead.property_name,lead.property_type,lead.status,lead.feedback]
        .some(value => String(value || '').toLocaleLowerCase().includes(q));
    });
  }, [search, leads, params, statusFilter]);
  const duplicatePhones = useMemo(() => {
    const tally=new Map();
    leads.forEach(l => {const phone=String(l.phone||'').replace(/\D/g,''); if(phone)tally.set(phone,(tally.get(phone)||0)+1);});
    return tally;
  },[leads]);
  function exportToExcel() {
    if (!filteredLeads.length) return toast('No leads to export');
    const rows=filteredLeads.map(l => ({Customer:l.name, Phone:l.phone,Email:l.email,Property:l.property_name, Employee:l.employee_name,EmployeeID:l.employee_id,Status:l.status,FollowUp:l.next_follow_up_date,Message:l.message,Notes:l.feedback,Created:l.created_at}));
    const ws=XLSX.utils.json_to_sheet(rows); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Leads'); XLSX.writeFile(wb,'RealEstateDemo-Leads.xlsx');
  }
  function clearFilters() { setSearch(''); setParams({}); }
  return <div className="leads-page">
    <div className="crm-page-title"><div><span className="crm-eyebrow"><Users size={15}/> CLIENT RELATIONSHIPS</span><h1>Customer Leads</h1><p>Search and manage enquiries, customers and follow-ups</p></div><span className="crm-count">{filteredLeads.length} leads</span></div>
    <div className="leads-top crm-glass">
      <label className="search-box" htmlFor="leads-search"><Search size={19}/><input id="leads-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, property or employee…" /></label>
      <select aria-label="Filter lead status" className="crm-lead-status-filter" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">All statuses</option>{['New','Contacted','Interested','Site Visit','Negotiation','Booked','Closed','Lost'].map(s=><option key={s} value={s}>{s}</option>)}</select>
      <button className="export-btn" onClick={exportToExcel}><Download size={17}/> Export Excel</button>
    </div>
    {(params.get('status') || params.get('followup')) && <div className="crm-filter-message"><SlidersHorizontal size={16}/> Showing {params.get('status') || params.get('followup')} leads <button onClick={clearFilters}>Clear filter</button></div>}
    <div className="crm-table crm-glass">
      <div className="table-head"><div>Customer</div><div>Property</div><div>Employee</div><div>Status</div><div>Follow-up</div><div>Action</div></div>
      {loading ? <div className="crm-empty">Loading customer enquiries…</div> : filteredLeads.length === 0 ? <div className="crm-empty">No matching leads. Try another search or clear the filters.</div> : filteredLeads.map(lead => <div key={lead.id} className="table-row">
        <div className="crm-lead-identity"><span className="crm-avatar">{(lead.name || '?').slice(0,1).toUpperCase()}</span><div><h3>{lead.name || 'Unnamed enquiry'} {((duplicatePhones.get(String(lead.phone||'').replace(/\D/g,''))||0)>1)&&<span className="crm-pill warn crm-duplicate-pill" title="Other leads share this phone number"><Copy size={12}/> Duplicate</span>}</h3><p><Phone size={13}/>{lead.phone || '—'}</p><p><Mail size={13}/>{lead.email || '—'}</p></div></div>
        <div className="crm-cell"><span className="crm-mobile-label">Property</span>{lead.property_id ? <Link to={`/property/${lead.property_id}`} className="crm-property-link" title="Open property details">{lead.property_name || 'View property'}</Link> : lead.property_name || 'General enquiry'}</div>
        <div className="crm-cell"><span className="crm-mobile-label">Employee</span>{lead.employee_name || 'Unassigned'}</div>
        <div className="crm-cell"><span className="crm-mobile-label">Status</span><span className={`badge ${(lead.status || 'New').replace(/\s/g,'').toLowerCase()}`}>{lead.status || 'New'}</span></div>
        <div className="crm-cell"><span className="crm-mobile-label">Follow-up</span>{lead.next_follow_up_date || 'Not scheduled'}</div>
        <div className="crm-cell crm-inline-buttons">{lead.phone&&<a className="crm-lead-wa" href={`https://wa.me/${String(lead.phone).replace(/\D/g,'')}?text=${encodeURIComponent('Hello, following up on your real estate enquiry.')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp enquiry" aria-label="WhatsApp enquiry"><MessageCircle size={17}/></a>}<button className="edit-btn" onClick={()=>navigate(`/admin/EditLead/${lead.id}`)}>Manage</button></div>
      </div>)}
    </div>
  </div>;
}
