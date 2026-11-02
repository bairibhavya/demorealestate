import { motion } from "framer-motion";
import "./ContactHero.css";

export default function ContactHero() {
  return (
    <section className="contact-hero">

      <div className="contact-overlay">

        <motion.div
          className="contact-hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
        >

          <span>CONTACT US</span>

          <h1>

            Let's Find Your
            <br />
            Dream Property

          </h1>

          <p>

            Whether you're buying your first home,
            investing, or looking for interior design,
            we're here to guide you.

          </p>

        </motion.div>

      </div>

    </section>
  );
}