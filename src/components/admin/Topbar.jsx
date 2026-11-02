import { useLocation } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();

  const titles = {
    "/admin/dashboard": "Dashboard",
    "/admin/properties": "Properties",
    "/admin/AddProperty": "Add Property",
    "/admin/leads": "Leads",
  };

  let title = titles[location.pathname] || "Admin Panel";

  if (location.pathname.includes("/admin/edit-property")) {
    title = "Edit Property";
  }

  return (
    <header className="topbar">
      <h1>{title}</h1>
    </header>
  );
}