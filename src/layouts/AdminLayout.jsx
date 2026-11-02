import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const root = document.querySelector('.admin-content');
    const elements = root?.querySelectorAll('.stat-card, .property-card, .table-row, .report-card, .property-form, .edit-property-card, .edit-lead-card');
    if (!elements?.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('crm-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .06, rootMargin: '0px 0px -25px 0px' });
    elements.forEach((el, i) => {
      el.classList.add('crm-reveal');
      el.style.setProperty('--reveal-delay', `${Math.min(i % 8, 5) * 45}ms`);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname, location.search]);
  return (
    <div className="admin-layout">
      {menuOpen && <button className="crm-sidebar-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="admin-main">
        <AdminHeader onMenuClick={() => setMenuOpen(v => !v)} />
        <main className="admin-content" id="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
