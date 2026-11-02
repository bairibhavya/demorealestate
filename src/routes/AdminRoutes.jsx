import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Properties from "../pages/Properties";
import PropertyDetails from "../pages/PropertyDetails";
import Contact from "../pages/Contact";

import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";

import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/services" element={<Services />} />

          <Route path="/properties" element={<Properties />} />

          {/* <Route path="/property/:id" element={<PropertyDetails />} /> */}

          <Route path="/contact" element={<Contact />} />

        </Route>

        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}