import { motion } from "framer-motion";
import "./PropertyHero.css";

export default function PropertyHero() {

  return (

    <section className="property-hero">

      <div className="property-overlay">

        <motion.div

          className="property-content"

          initial={{opacity:0,y:50}}

          animate={{opacity:1,y:0}}

          transition={{duration:.8}}

        >

          <span>

            PREMIUM COLLECTION

          </span>

          <h1>

            Explore Premium
            <br/>
            Properties

          </h1>

          <p>

            Discover verified apartments, luxury villas,
            gated communities and investment opportunities.

          </p>

        </motion.div>

      </div>

    </section>

  );

}