import {
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

import "./ContactInfo.css";

export default function ContactInfo() {

  return (

    <section className="contact-info">

      <div className="contact-info-grid">

        <div className="info-card">

          <Phone size={32}/>

          <h3>Call Us</h3>

          <p>+91 00000 00000</p>

        </div>

        <div className="info-card">

          <Mail size={32}/>

          <h3>Email</h3>

          <p>hello@example.com</p>

        </div>

        <div className="info-card">

          <MapPin size={32}/>

          <h3>Office</h3>

          <p>Vijayawada, Andhra Pradesh</p>

        </div>

        <div className="info-card">

          <Clock size={32}/>

          <h3>Working Hours</h3>

          <p>Mon - Sat | 9:00 AM - 7:00 PM</p>

        </div>

      </div>

    </section>

  );

}