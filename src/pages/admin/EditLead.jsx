import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, CalendarClock, History, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { fetchEmployees, fetchLeadNotes, leadStatuses, formatDate, todayLocal } from "../../services/crm";
import { useAuth } from "../../context/AuthContext";

const blank = {
  name: "", phone: "", email: "", property_id: "", property_name: "",
  status: "New", employee_name: "", employee_id: "", assigned_employee_uuid: "",
  next_follow_up_date: "", feedback: "", follow_up_date: "",
};

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, employee } = useAuth();
  const [lead, setLead] = useState(blank);
  const [employees, setEmployees] = useState([]);
  const [properties, setProperties] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const [leadRes, noteRes] = await Promise.all([
        supabase.from("leads").select("*").eq("id", id).maybeSingle(),
        supabase.from("crm_lead_notes").select("*").eq("lead_id", String(id))
          .order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      if (leadRes.error) toast.error(leadRes.error.message);
      setLead(leadRes.data ? {
        ...blank, ...leadRes.data,
        property_id: leadRes.data.property_id || "",
        assigned_employee_uuid: leadRes.data.assigned_employee_uuid || "",
        next_follow_up_date: leadRes.data.next_follow_up_date || "",
      } : blank);
      if (noteRes.error) toast.error(noteRes.error.message);
      setNotes(noteRes.data || []);
      setLoading(false);
    }
    load();
    if (canManage) {
      fetchEmployees(true).then((data) => {
        if (active) setEmployees(data);
      }).catch((error) => toast.error(error.message));
      supabase.from("properties").select("id,title,location,property_type")
        .order("title", { ascending: true }).then(({ data, error }) => {
          if (!active) return;
          if (error) toast.error(`Property list: ${error.message}`);
          setProperties(data || []);
        });
    }
    return () => { active = false; };
  }, [id, canManage]);

  const selectedProperty = useMemo(
    () => properties.find((p) => String(p.id) === String(lead.property_id)),
    [properties, lead.property_id]
  );

  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const selectedEmployee = employees.find((e) => e.id === lead.assigned_employee_uuid);
      const payload = {
        status: lead.status,
        feedback: lead.feedback,
        next_follow_up_date: lead.next_follow_up_date || null,
        follow_up_date: todayLocal(),
      };
      if (canManage) {
        payload.assigned_employee_uuid = lead.assigned_employee_uuid || null;
        payload.employee_id = selectedEmployee?.employee_code || "";
        payload.employee_name = selectedEmployee?.full_name || "";
        // If there is an old property not present in the current list, require a real choice.
        if (lead.property_id && !selectedProperty) {
          throw new Error("Select a valid listed property or General enquiry before saving.");
        }
        payload.property_id = selectedProperty?.id || null;
        payload.property_name = selectedProperty?.title || null;
      }
      const { error } = await supabase.from("leads").update(payload).eq("id", id);
      if (error) throw error;
      if (newNote.trim()) {
        const { error: noteError } = await supabase.from("crm_lead_notes")
          .insert({ lead_id: String(id), employee_id: employee?.id || null, note: newNote.trim() });
        if (noteError) throw noteError;
        setNewNote("");
        setNotes(await fetchLeadNotes(id));
      }
      setLead((previous) => ({ ...previous, ...payload }));
      toast.success("Lead updated");
    } catch (error) {
      toast.error(error.message || "Unable to save enquiry");
    } finally {
      setSaving(false);
    }
  }

  const whatsappText = `Hello ${lead.name || ""}, following up on your enquiry about ${lead.property_name || "a property"}.`;
  if (loading) return <div className="crm-suite-empty">Loading lead…</div>;
  if (!lead.id) return <div className="crm-suite-empty">Lead not found or access denied. <Link to="/admin/leads">Go back</Link></div>;

  return (
    <div className="crm-suite-page">
      <div className="crm-suite-heading">
        <div>
          <Link to="/admin/leads" className="crm-back-link"><ArrowLeft size={17} /> Customer Leads</Link>
          <h1>{lead.name || "Customer enquiry"}</h1>
          <p>{lead.property_name || "General enquiry"} · {lead.phone || "No phone"}</p>
        </div>
        {lead.phone && <a className="crm-action" href={`https://wa.me/${String(lead.phone).replace(/\D/g, "")}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp</a>}
      </div>

      <form onSubmit={save} className="crm-panel crm-form">
        <div className="crm-form-grid">
          <label>Customer<input value={lead.name || ""} readOnly /></label>
          <label>Phone<input value={lead.phone || ""} readOnly /></label>

          {canManage ? (
            <label>
              Enquired property / plot
              <select value={lead.property_id || ""} onChange={(event) => {
                const found = properties.find((p) => String(p.id) === event.target.value);
                setLead((previous) => ({ ...previous, property_id: event.target.value, property_name: found?.title || "" }));
              }}>
                <option value="">General enquiry / no property selected</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_type || "Property"} — {property.title} {property.location ? `(${property.location})` : ""}
                  </option>
                ))}
              </select>
              <small>Choose a listing to attach it to an older general enquiry.</small>
            </label>
          ) : <label>Property<input value={lead.property_name || "General enquiry"} readOnly /></label>}

          <label>Email<input value={lead.email || ""} readOnly /></label>
          <label>Pipeline stage
            <select value={lead.status || "New"} onChange={(event) => setLead((previous) => ({ ...previous, status: event.target.value }))}>
              {[...new Set([...leadStatuses, lead.status].filter(Boolean))].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          {canManage ? (
            <label>Assigned employee
              <small className="crm-help">Only active employees</small>
              <select value={lead.assigned_employee_uuid || ""} onChange={(event) => setLead((previous) => ({ ...previous, assigned_employee_uuid: event.target.value }))}>
                <option value="">Unassigned</option>
                {employees.map((item) => <option key={item.id} value={item.id}>{item.full_name} · {item.employee_code}</option>)}
              </select>
            </label>
          ) : <label>Assigned employee<input value={lead.employee_name || employee?.full_name || "Assigned to me"} readOnly /></label>}

          <label><CalendarClock size={14} /> Next follow-up
            <input type="date" value={lead.next_follow_up_date || ""} onChange={(event) => setLead((previous) => ({ ...previous, next_follow_up_date: event.target.value }))} />
          </label>
          <label>Last follow-up<input value={lead.follow_up_date || "Not contacted"} readOnly /></label>
          <label className="crm-form-wide">Lead notes / feedback
            <textarea rows={3} value={lead.feedback || ""} onChange={(event) => setLead((previous) => ({ ...previous, feedback: event.target.value }))} />
          </label>
          <label className="crm-form-wide"><Plus size={14} /> Add activity note
            <textarea rows={3} maxLength={4000} placeholder="Called customer; interested in visiting on Saturday…" value={newNote} onChange={(event) => setNewNote(event.target.value)} />
          </label>
        </div>
        <div className="crm-modal-actions">
          <button type="button" className="crm-subtle-btn" onClick={() => navigate("/admin/leads")}>Back</button>
          <button className="crm-action" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </form>

      <div className="crm-panel">
        <div className="crm-panel-title"><h2><History size={18} /> Activity history</h2><span>{notes.length} notes</span></div>
        {notes.map((note) => <div className="crm-simple-row" key={note.id}><div><strong>{note.note}</strong><small>{formatDate(note.created_at)}</small></div></div>)}
        {!notes.length && <p className="crm-suite-empty">No activity notes yet.</p>}
      </div>
    </div>
  );
}
