import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, Home, Mail, MapPin } from "lucide-react";
import "./Footer.css";
export default function Footer() {
  return <footer className="footer">
    <div className="footer-container">
      <div className="footer-column footer-about"><div className="footer-brand"><span className="footer-brand-icon"><Building2 size={23}/></span><strong>RealEstate <span>Demo</span></strong></div><p>A simpler way to explore properties, compare opportunities and connect with real-estate professionals.</p><Link className="footer-cta" to="/properties">Explore properties <ArrowUpRight size={17}/></Link></div>
      <div className="footer-column"><h3>Explore</h3><Link to="/">Home</Link><Link to="/properties">All Properties</Link><Link to="/about">About Us</Link><Link to="/contact">Contact</Link></div>
      <div className="footer-column"><h3>Property types</h3><Link to="/properties?type=Plot">Plots & Land</Link><Link to="/properties?type=Apartment">Apartments</Link><Link to="/properties?type=Villa">Villas</Link><Link to="/properties">View Listings</Link></div>
      <div className="footer-column"><h3>Connect</h3><p><MapPin size={17}/> Vijayawada, Andhra Pradesh</p><Link to="/contact"><Mail size={17}/> Send an enquiry</Link><Link to="/contact"><Home size={17}/> Request a site visit</Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} RealEstate Demo. All rights reserved.</span><Link to="/contact">Have a question? Contact us <ArrowUpRight size={15}/></Link></div>
  </footer>;
}
