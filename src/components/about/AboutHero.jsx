import { motion } from "framer-motion";
import "./AboutHero.css";

export default function AboutHero() {

  return (

    <section className="about-hero">

      <div className="about-overlay">

        <motion.div

          className="about-content"

          initial={{opacity:0,y:60}}

          animate={{opacity:1,y:0}}

          transition={{duration:.8}}

        >

          <span>

            ABOUT REALESTATE DEMO

          </span>

          <h1>

            Building Trust.
            <br/>
            Delivering Dream Homes.

          </h1>

          <p>

            We believe buying a property should be simple,
            transparent and stress-free. Our experienced team
            connects customers with verified builders and
            premium residential projects.

          </p>

        </motion.div>

      </div>

    </section>

  );

}