import { Navigate, Outlet, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export default function RequireAccess({ roles }) {
 const {user,role,loading,error} = useAuth();
 if (loading) return <div className="crm-auth-state">Checking CRM access…</div>;
 if (!user) return <Navigate to="/admin" replace />;
 if (!role || (roles && !roles.includes(role))) return <div className="crm-auth-state"><ShieldAlert size={32}/><h2>Access unavailable</h2><p>{error || 'Your account does not have permission to open this page.'}</p><Link to="/admin/my-work">Go to workspace</Link> · <Link to="/">Website</Link></div>;
 return <Outlet/>;
}
