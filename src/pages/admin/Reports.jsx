import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Download, TrendingUp, BadgeIndianRupee, Users } from "lucide-react";
import { currency } from "../../services/crm";
import { supabase } from "../../services/supabase";
import "./Reports.css";

export default function Reports() {

  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [sales,setSales] = useState([]);
  const [employees,setEmployees] = useState([]);

  const [employee, setEmployee] = useState("");
  const [status, setStatus] = useState("");
  const [property, setProperty] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
  loadReports();
  supabase.from('crm_sales').select('id,stage,amount,amount_received,employee_id').then(({data})=>setSales(data||[]));
  supabase.from('crm_employees').select('id,full_name,employee_code').then(({data})=>setEmployees(data||[]));

  const channel = supabase
    .channel("reports-refresh")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "leads",
      },
      () => {
        loadReports();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  async function loadReports() {

    const { data } = await supabase
  .from("leads")
  .select("*")
  .order("created_at", { ascending: false });

setLeads(data || []);

  }

  const filtered = leads.filter((lead) => {

    return (

      (employee === "" ||
        lead.employee_name?.toLowerCase().includes(employee.toLowerCase()))

      &&

      (status === "" ||
        lead.status === status)

      &&

      (property === "" ||
        lead.property_name?.toLowerCase().includes(property.toLowerCase()))

      &&

      (date === "" ||
        lead.created_at?.startsWith(date))

    );

  });

  function exportExcel() {

    const exportData = filtered.map((lead) => ({

      Customer: lead.name,
      Phone: lead.phone,
      Email: lead.email,
      Property: lead.property_name,
      Employee: lead.employee_name,
      EmployeeID: lead.employee_id,
      Status: lead.status,
      ExpectedPurchase: lead.expected_date,
      EnquiryType: lead.is_just_enquiry
        ? "Just Enquiry"
        : "Property Purchase",
      EnquiryFor: lead.enquiry_for,
      LastFollowUp: lead.follow_up_date,
      NextFollowUp: lead.next_follow_up_date,
      Notes: lead.feedback,
      Requirement: lead.message

    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "CRM Report"
    );

    XLSX.writeFile(
      workbook,
      "CRM_Report.xlsx"
    );

  }

  return (

    <div className="reports-page">

      <h1>Reports & Performance</h1>
      <div className="crm-mini-stats"><div><Users size={19}/><strong>{leads.length}</strong><span>Leads captured</span></div><div><TrendingUp size={19}/><strong>{leads.filter(l=>l.status==='Closed').length}</strong><span>Closed leads</span></div><div><BadgeIndianRupee size={19}/><strong>{currency(sales.filter(s=>s.stage!=='Cancelled').reduce((n,s)=>n+Number(s.amount),0))}</strong><span>Booking value</span></div><div><BadgeIndianRupee size={19}/><strong>{currency(sales.filter(s=>s.stage!=='Cancelled').reduce((n,s)=>n+Number(s.amount_received),0))}</strong><span>Payments received</span></div></div>
      <div className="crm-panel crm-performance-panel"><div className="crm-panel-title"><h2>Employee performance</h2><span>Lead and sales totals</span></div><div className="crm-performance-grid">{employees.map(emp=><div key={emp.id}><strong>{emp.full_name}</strong><small>{emp.employee_code}</small><span>{leads.filter(l=>l.assigned_employee_uuid===emp.id).length} leads</span><b>{sales.filter(s=>s.employee_id===emp.id&&s.stage!=='Cancelled').length} bookings</b></div>)}{!employees.length&&<p className="crm-suite-empty">Register employees to see their results.</p>}</div></div>

      <div className="report-filter">

        <input
          placeholder="Employee"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        />

        <input
          placeholder="Property"
          value={property}
          onChange={(e) => setProperty(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >

          <option value="">Status</option>

          <option>New</option>
          <option>Interested</option>
          <option>Site Visit</option>
          <option>Negotiation</option>
          <option>Closed</option>

        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={exportExcel}>

          <Download size={18} />

          Export

        </button>

      </div>

      <p className="crm-report-total">{filtered.length} matching {filtered.length === 1 ? "record" : "records"}</p>
      {filtered.map((lead) => (

  <details
    key={lead.id}
    className="report-card"
  >

    <summary className="report-header">

      <h2>{lead.name}</h2>

      <span className={`status ${lead.status?.toLowerCase().replace(/\s/g, "")}`}>
        {lead.status || "New"}
      </span>

    </summary>

    <div className="report-grid">

      <div>

        <label>Customer</label>

        <p>{lead.name}</p>

      </div>

      <div>

        <label>Contact</label>

        <p>{lead.phone}</p>

        <small>{lead.email}</small>

      </div>

      <div>

        <label>Property</label>

        <p>{lead.property_name || "-"}</p>

      </div>

      <div>

        <label>Employee</label>

        <p>{lead.employee_name || "-"}</p>

        <small>{lead.employee_id || "-"}</small>

      </div>

      <div>

        <label>Status</label>

        <p>{lead.status || "-"}</p>

      </div>

      <div>

        <label>Expected Purchase</label>

        <p>{lead.expected_date || "-"}</p>

      </div>

      <div>

        <label>Enquiry</label>

        <p>

          {lead.is_just_enquiry
            ? "Just Enquiry"
            : "Property Purchase"}

        </p>

        <small>

          {lead.enquiry_for || "-"}

        </small>

      </div>

      <div>

        <label>Follow-up</label>

        <small>

          Last : {lead.follow_up_date || "-"}

        </small>

        <p>

          Next : {lead.next_follow_up_date || "-"}

        </p>

      </div>

    </div>

    <div className="report-note">

      <label>Customer Requirement</label>

      <p>

        {lead.message || "-"}

      </p>

    </div>

    <div className="report-note">

      <label>Employee Notes</label>

      <p>

        {lead.feedback || "-"}

      </p>

    </div>

    <div className="report-footer">

      <button
        className="edit-report-btn"
        onClick={() =>
          navigate(`/admin/EditLead/${lead.id}`)
        }
      >

        Edit Lead

      </button>

    </div>

  </details>

))}
      </div>

    

  );

}