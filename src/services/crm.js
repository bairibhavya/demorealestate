import { supabase } from './supabase';
export const leadStatuses = ['New','Contacted','Interested','Site Visit','Negotiation','Booked','Closed','Lost'];
export function todayLocal() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function currency(value) {return `₹${new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(Number(value)||0)}`;}
export function formatDate(value) {return value?new Date(value).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—';}
export async function fetchEmployees(activeOnly=false) {
 let query=supabase.from('crm_employees').select('id,employee_code,full_name,phone,email,designation,department,joined_on,address,photo_path,is_active,role,auth_user_id,created_at').order('employee_number');
 if(activeOnly)query=query.eq('is_active',true);
 const {data,error}=await query; if(error) throw error;return data||[];
}
export async function photoSignedUrl(path) {
 if(!path)return '';
 const {data,error}=await supabase.storage.from('crm-employee-photos').createSignedUrl(path,3600);
 if(error) return '';return data?.signedUrl||'';
}
export async function fetchLeadNotes(id){const {data,error}=await supabase.from('crm_lead_notes').select('id,note,created_at,employee_id').eq('lead_id',String(id)).order('created_at',{ascending:false});if(error)throw error;return data||[];}
