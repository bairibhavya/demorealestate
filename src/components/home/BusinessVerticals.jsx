import { motion } from "framer-motion";
import {
  Building2,
  Home,
  MapPinned,
  Handshake
} from "lucide-react";

import "./BusinessVerticals.css";

const services = [

  {
    icon: <Building2 size={34} />,
    title: "Premium Flats",
    description:
      "Curated listings of verified modern apartments from trusted developers."
  },

  {
    icon: <Home size={34} />,
    title: "Luxury Villas",
    description:
      "Independent villas and gated communities designed for luxurious living."
  },

  {
    icon: <MapPinned size={34} />,
    title: "Plots & Land",
    description:
      "Explore residential plots and land opportunities across different locations."
  },

  {
    icon: <Handshake size={34} />,
    title: "Strategic Partnerships",
    description:
      "Direct collaborations with reputed builders ensuring genuine pricing and verified projects."
  }

];

export default function BusinessVerticals() {

  return (

    <section className="business">

      <div className="section-title">

        <span>WHAT WE DO</span>

        <h2>

          Complete Real Estate Solutions

        </h2>

        <p>

          Everything you need—from finding the perfect property
          to comparing land and investment opportunities.

        </p>

      </div>

      <div className="business-grid">

        {services.map((service, index) => (

          <motion.div

            key={service.title}

            className="business-card"

            initial={{ opacity: 0, y: 60 }}

            whileInView={{ opacity: 1, y: 0 }}

            transition={{
              duration: .5,
              delay: index * .08
            }}

            viewport={{ once: false, amount: 0.2 }}

          >

            <div className="business-icon">

              {service.icon}

            </div>

            <h3>

              {service.title}

            </h3>

            <p>

              {service.description}

            </p>

          </motion.div>

        ))}

      </div>

    </section>

  );

}