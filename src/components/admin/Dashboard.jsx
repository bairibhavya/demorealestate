import { Building2, Users, Star, Home } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {

  const cards = [
    {
      title: "Total Properties",
      value: "0",
      icon: <Building2 size={30} />,
    },
    {
      title: "Featured",
      value: "0",
      icon: <Star size={30} />,
    },
    {
      title: "Leads",
      value: "0",
      icon: <Users size={30} />,
    },
    {
      title: "Available",
      value: "0",
      icon: <Home size={30} />,
    },
  ];

  return (
    <div className="dashboard-page">

      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        {cards.map((card) => (

          <div
            key={card.title}
            className="dashboard-card"
          >

            <div className="dashboard-icon">

              {card.icon}

            </div>

            <h2>{card.value}</h2>

            <p>{card.title}</p>

          </div>

        ))}

      </div>

      <div className="dashboard-placeholder">

        <h3>Welcome to RealEstate Demo Admin</h3>

        <p>

          Manage your properties, leads and website
          from this dashboard.

        </p>

      </div>

    </div>
  );

}