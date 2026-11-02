import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AddProperty from "./pages/admin/AddProperty";
import EditProperty from "./pages/admin/EditProperty";
import Leads from "./pages/admin/Leads";
import EditLead from "./pages/admin/EditLead";
import Reports from "./pages/admin/Reports";
import Employees from "./pages/admin/crm/Employees";
import Followups from "./pages/admin/crm/Followups";
import SiteVisits from "./pages/admin/crm/SiteVisits";
import Sales from "./pages/admin/crm/Sales";
import MyWork from "./pages/admin/crm/MyWork";
import AdminLayout from "./layouts/AdminLayout";
import RequireAccess from "./components/admin/RequireAccess";
import ScrollToTop from "./components/ScrollToTop";
function WebsiteLayout(){ return <><Navbar/><Outlet/><Footer/></>; }
export default function App(){return <><ScrollToTop/><Routes>
 <Route element={<WebsiteLayout/>}>
   <Route index element={<Home/>}/><Route path="about" element={<About/>}/>
   <Route path="properties" element={<Properties/>}/><Route path="property/:id" element={<PropertyDetails/>}/>
   <Route path="contact" element={<Contact/>}/>
 </Route>
 <Route path="/admin" element={<Login/>}/>
 <Route element={<RequireAccess/>}><Route element={<AdminLayout/>}>
   <Route path="/admin/my-work" element={<MyWork/>}/>
   <Route path="/admin/leads" element={<Leads/>}/>
   <Route path="/admin/EditLead/:id" element={<EditLead/>}/>
   <Route path="/admin/followups" element={<Followups/>}/>
   <Route path="/admin/site-visits" element={<SiteVisits/>}/>
   <Route element={<RequireAccess roles={['admin','manager']}/> }>
     <Route path="/admin/dashboard" element={<Dashboard/>}/>
     <Route path="/admin/properties" element={<AdminProperties/>}/>
     <Route path="/admin/AddProperty" element={<AddProperty/>}/>
     <Route path="/admin/EditProperty/:id" element={<EditProperty/>}/>
     <Route path="/admin/employees" element={<Employees/>}/>
     <Route path="/admin/sales" element={<Sales/>}/>
     <Route path="/admin/reports" element={<Reports/>}/>
   </Route>
 </Route></Route>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes></>;}
