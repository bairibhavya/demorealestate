import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Button from "../ui/Button";
import "./Navbar.css";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-container">

        <NavLink to="/" className="logo">
          <span className="demo-wordmark">RealEstate<span> Demo</span><small> REAL ESTATE</small></span>
        </NavLink>

        <nav className={`nav ${open ? "show" : ""}`}>
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="mobile-contact">
            <Link to="/contact" onClick={() => setOpen(false)}><Button fullWidth>Contact Us</Button></Link>
          </div>
        </nav>

        <div className="desktop-contact">

          <Link to="/admin">
            <button className="admin-btn">
              Admin
            </button>
          </Link>

          <Link to="/contact"><Button>Contact Us</Button></Link>

        </div>

        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>

      </div>
    </header>
  );
}