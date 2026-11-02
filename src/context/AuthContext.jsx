import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let current = true;
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured) { setError('Configure Supabase environment variables first.'); setLoading(false); return; }
      const {data:{user:authUser},error:authError} = await supabase.auth.getUser();
      if (!current) return;
      if (authError || !authUser) { setUser(null);setRole(null);setEmployee(null);setError('');setLoading(false);return; }
      setUser(authUser);
      const [{data:member,error:memberError},{data:profile}] = await Promise.all([
        supabase.from('crm_memberships').select('role').eq('user_id',authUser.id).maybeSingle(),
        supabase.from('crm_employees').select('id,full_name,employee_code,role,is_active').eq('auth_user_id',authUser.id).maybeSingle()
      ]);
      if (!current) return;
      setRole(member?.role || null);
      setEmployee(profile?.is_active ? profile : null);
      setError(memberError?.message || (member ? '' : 'Account has no CRM role. Ask an administrator to grant access.'));
      setLoading(false);
    }
    load();
    const {data:{subscription}} = supabase.auth.onAuthStateChange(() => { setTimeout(load,0); });
    return () => { current = false; subscription.unsubscribe(); };
  }, []);
  return <AuthContext.Provider value={{user,role,employee,loading,error,canManage:role==='admin'||role==='manager'}}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if(!ctx) throw new Error('AuthProvider missing'); return ctx; }
