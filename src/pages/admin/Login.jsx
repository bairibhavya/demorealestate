import { useState } from "react";
import { Eye, EyeOff, Building2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../services/authService";
import { supabase } from "../../services/supabase";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);
      const {data:{user}} = await supabase.auth.getUser();
      const {data:member,error:roleError} = await supabase.from('crm_memberships').select('role').eq('user_id',user.id).single();
      if(roleError || !member) {
        await supabase.auth.signOut();
        throw new Error('This account does not have a CRM role. Contact the administrator.');
      }
      toast.success('Welcome back!');
      navigate(member.role === 'employee' ? '/admin/my-work' : '/admin/dashboard', {replace:true});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <Building2 size={42} />
          <h2>RealEstate Demo</h2>
          <p>Property management workspace</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-box">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

          </div>

          <button
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>
        <div style={{textAlign:"center"}}><Link className="fd-back-home" to="/"><ArrowLeft size={17}/> Back to website</Link></div>

      </div>
    </div>
  );
}