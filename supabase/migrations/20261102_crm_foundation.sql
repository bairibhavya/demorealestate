-- Row-level access control for all NEW CRM tables.
alter table public.crm_memberships enable row level security;
alter table public.crm_employees enable row level security;
alter table public.crm_lead_notes enable row level security;
alter table public.crm_site_visits enable row level security;
alter table public.crm_sales enable row level security;

drop policy if exists crm_member_read on public.crm_memberships;
create policy crm_member_read on public.crm_memberships for select to authenticated
using(user_id = (select auth.uid()) or public.crm_my_role() = 'admin');

drop policy if exists crm_employee_read on public.crm_employees;
create policy crm_employee_read on public.crm_employees for select to authenticated
using(public.crm_can_manage() or auth_user_id = (select auth.uid()));
drop policy if exists crm_employee_insert on public.crm_employees;
create policy crm_employee_insert on public.crm_employees for insert to authenticated
with check(public.crm_can_manage());
drop policy if exists crm_employee_update on public.crm_employees;
create policy crm_employee_update on public.crm_employees for update to authenticated
using(public.crm_can_manage()) with check(public.crm_can_manage());
-- Physical deletion intentionally disabled; deactivate an employee to preserve audit links.

-- READ guard on legacy lead data. Existing PUBLIC enquiry INSERT policies are not removed.
-- Existing public SELECT/UPDATE policies must also be reviewed: restrictive policies AND with them.
alter table public.leads enable row level security;
drop policy if exists crm_leads_select_guard on public.leads;
create policy crm_leads_select_guard on public.leads as restrictive for select to public
using(public.crm_can_manage() or
  (auth.uid() is not null and assigned_employee_uuid = public.crm_my_employee_id()));
drop policy if exists crm_leads_auth_select on public.leads;
create policy crm_leads_auth_select on public.leads for select to authenticated
using(public.crm_can_manage() or assigned_employee_uuid = public.crm_my_employee_id());
drop policy if exists crm_leads_update_guard on public.leads;
create policy crm_leads_update_guard on public.leads as restrictive for update to public
using(public.crm_can_manage() or
  (auth.uid() is not null and assigned_employee_uuid = public.crm_my_employee_id()))
with check(public.crm_can_manage() or
  (auth.uid() is not null and assigned_employee_uuid = public.crm_my_employee_id()));
drop policy if exists crm_leads_auth_update on public.leads;
create policy crm_leads_auth_update on public.leads for update to authenticated
using(public.crm_can_manage() or assigned_employee_uuid = public.crm_my_employee_id())
with check(public.crm_can_manage() or assigned_employee_uuid = public.crm_my_employee_id());
drop policy if exists crm_leads_delete_guard on public.leads;
create policy crm_leads_delete_guard on public.leads as restrictive for delete to public
using(public.crm_can_manage());

drop policy if exists crm_notes_read on public.crm_lead_notes;
create policy crm_notes_read on public.crm_lead_notes for select to authenticated
using(public.crm_can_manage() or exists(
 select 1 from public.leads l where l.id::text = lead_id
 and l.assigned_employee_uuid = public.crm_my_employee_id()));
drop policy if exists crm_notes_insert on public.crm_lead_notes;
create policy crm_notes_insert on public.crm_lead_notes for insert to authenticated
with check(created_by = auth.uid() and (public.crm_can_manage() or exists(
 select 1 from public.leads l where l.id::text=lead_id
 and l.assigned_employee_uuid = public.crm_my_employee_id())));

drop policy if exists crm_visits_read on public.crm_site_visits;
create policy crm_visits_read on public.crm_site_visits for select to authenticated
using(public.crm_can_manage() or employee_id = public.crm_my_employee_id());
drop policy if exists crm_visits_insert on public.crm_site_visits;
create policy crm_visits_insert on public.crm_site_visits for insert to authenticated
with check(public.crm_can_manage() or (employee_id = public.crm_my_employee_id() and exists(
 select 1 from public.leads l where l.id::text=lead_id and l.assigned_employee_uuid=public.crm_my_employee_id())));
drop policy if exists crm_visits_update on public.crm_site_visits;
create policy crm_visits_update on public.crm_site_visits for update to authenticated
using(public.crm_can_manage() or employee_id = public.crm_my_employee_id())
with check(public.crm_can_manage() or employee_id = public.crm_my_employee_id());
drop policy if exists crm_visits_delete on public.crm_site_visits;
create policy crm_visits_delete on public.crm_site_visits for delete to authenticated using(public.crm_can_manage());

drop policy if exists crm_sales_read on public.crm_sales;
create policy crm_sales_read on public.crm_sales for select to authenticated
using(public.crm_can_manage() or employee_id = public.crm_my_employee_id());
drop policy if exists crm_sales_insert on public.crm_sales;
create policy crm_sales_insert on public.crm_sales for insert to authenticated
with check(public.crm_can_manage());
drop policy if exists crm_sales_update on public.crm_sales;
create policy crm_sales_update on public.crm_sales for update to authenticated
using(public.crm_can_manage()) with check(public.crm_can_manage());
drop policy if exists crm_sales_delete on public.crm_sales;
create policy crm_sales_delete on public.crm_sales for delete to authenticated using(public.crm_my_role() = 'admin');

-- Private employee photos. Staff can read only their own folder; managers read all.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('crm-employee-photos','crm-employee-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
drop policy if exists crm_photos_read on storage.objects;
create policy crm_photos_read on storage.objects for select to authenticated
using(bucket_id='crm-employee-photos' and
  (public.crm_can_manage() or split_part(name,'/',1) = public.crm_my_employee_id()::text));
drop policy if exists crm_photos_upload on storage.objects;
create policy crm_photos_upload on storage.objects for insert to authenticated
with check(bucket_id='crm-employee-photos' and public.crm_can_manage());
drop policy if exists crm_photos_update on storage.objects;
create policy crm_photos_update on storage.objects for update to authenticated
using(bucket_id='crm-employee-photos' and public.crm_can_manage())
with check(bucket_id='crm-employee-photos' and public.crm_can_manage());

-- Enable authenticated client CRUD; RLS still determines which rows are accessible.
grant select,insert,update on public.crm_employees to authenticated;
grant select on public.crm_memberships to authenticated;
grant select,insert on public.crm_lead_notes to authenticated;
grant select,insert,update,delete on public.crm_site_visits to authenticated;
grant select,insert,update,delete on public.crm_sales to authenticated;
grant usage,select on sequence public.crm_employees_employee_number_seq to authenticated;

-- BOOTSTRAP (run separately, replace UUID):
-- insert into public.crm_memberships(user_id,role)
-- values ('YOUR_EXISTING_ADMIN_AUTH_USER_UUID','admin')
-- on conflict(user_id) do update set role='admin';
