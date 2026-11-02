import { motion } from "framer-motion";
import "./CompanyIntro.css";

export default function CompanyIntro() {

  return (

    <section className="company-intro">

      <div className="intro-grid">

        <motion.div

          initial={{ opacity: 0, x: -60 }}

          whileInView={{ opacity: 1, x: 0 }}

          transition={{ duration: .8 }}

          viewport={{ once: true }}

        >

          <span>

            WHO WE ARE

          </span>

          <h2>

            About RealEstate Demo

          </h2>

        </motion.div>

        <motion.div

          initial={{ opacity: 0, x: 60 }}

          whileInView={{ opacity: 1, x: 0 }}

          transition={{ duration: .8 }}

          viewport={{ once: true }}

        >

          <p>

            Welcome to <strong>RealEstate Demo</strong>, your trusted real estate
            partner committed to helping families find the perfect home.

            <br /><br />

            We specialize in premium apartments, luxury villas,
            gated communities and investment properties through
            direct collaborations with reputed builders and developers.

            <br /><br />

            Beyond property sales, we provide professional
            interior design services, ensuring every space reflects
            your lifestyle and aspirations.

            <br /><br />

            Our commitment is built on transparency,
            genuine pricing, expert guidance and exceptional
            customer experience from your first enquiry
            until the day you receive your keys.

          </p>

        </motion.div>

      </div>

    </section>

  );

}