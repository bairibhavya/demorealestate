// import { useNavigate , NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Building2,
//   PlusCircle,
//   Users,
//   LogOut,
// } from "lucide-react";

// import { logout } from "../../services/authService";
// import "./Sidebar.css";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   async function handleLogout() {

//   try {

//     await logout();

//     navigate("/");

//   } catch (err) {

//     console.error(err);

//   }

// }
//   // async function handleLogout() {

//   //   await logout();

//   //   window.location.href="/admin";

//   // }

//   return (

//     <aside className="sidebar">

      

//       <h2 className="sidebar-logo">

//   <NavLink to="/admin/dashboard">

//     RealEstate Demo

//   </NavLink>

// </h2>

//       <nav>

//         <NavLink to="/admin/dashboard">

//           <LayoutDashboard size={18}/>

//           Dashboard

//         </NavLink>

//         <NavLink to="/admin/properties">

//           <Building2 size={18}/>

//           Properties

//         </NavLink>

//         <NavLink to="/admin/add-property">

//           <PlusCircle size={18}/>

//           Add Property

//         </NavLink>

//         <NavLink to="/admin/leads">

//           <Users size={18}/>

//           Leads

//         </NavLink>

//       </nav>

//       <button
// className="logout-btn"
// onClick={handleLogout}
// >

// <LogOut size={18}/>

// Logout

// </button>

//     </aside>

//   );

// }
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PlusSquare,
  Users,
  FileSpreadsheet,
  LogOut
} from "lucide-react";

import "./AdminSidebar.css";

export default function AdminSidebar() {

  const menu = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      title: "Properties",
      icon: <Building2 size={20} />,
      path: "/admin/properties",
    },
    {
      title: "Add Property",
      icon: <PlusSquare size={20} />,
      path: "/admin/AddProperty",
    },
    {
      title: "Customer Leads",
      icon: <Users size={20} />,
      path: "/admin/leads",
    },
    {
      title: "Reports",
      icon: <FileSpreadsheet size={20} />,
      path: "/admin/reports",
    },
  ];

  return (

    <aside className="admin-sidebar">

      <div className="sidebar-logo">

        <img
          src="/logo.png"
          alt="RealEstate Demo"
        />

        <h2>

          RealEstate Demo

        </h2>

        <span>

          Admin CRM

        </span>

      </div>

      <nav className="sidebar-menu">

        {menu.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >

            {item.icon}

            <span>

              {item.title}

            </span>

          </NavLink>

        ))}

      </nav>

      <div className="sidebar-bottom">

        <button className="logout-btn">

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>

  );

}