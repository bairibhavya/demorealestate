import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { supabase } from "../../services/supabase";
import Button from "../ui/Button";
import "./FeaturedProperties.css";

export default function FeaturedProperties() {

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) return;

    setProperties(data || []);
  }

  return (

    <section id="featured" className="featured-properties">

      <div className="section-title">

        <span>FEATURED PROPERTIES</span>

        <h2>
          Discover Premium Living
        </h2>

        <p>
          Explore our handpicked collection of verified premium flats
          and luxury villas.
        </p>

      </div>

      <div className="featured-grid">

        {properties.map((property, index) => (

          <motion.div
            key={property.id}
            className="featured-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: index * .08 }}
            viewport={{ once: true }}
          >

            <div className="featured-image">

              {property.thumbnail ? (
  <img
    src={property.thumbnail}
    alt={property.title}
  />
) : (
  <div className="featured-placeholder">
    No Image
  </div>
)}

              <span className="property-status">

                {property.status}

              </span>

            </div>

            <div className="featured-content">

              <h3>
                {property.title}
              </h3>

              <p className="property-location">

                <MapPin size={16} />

                {property.location}

              </p>

              <div className="featured-bottom">

                <h4>

                  ₹ {property.price}

                </h4>

                <Link to={`/property/${property.id}`}>

                  <Button>

                    View More

                  </Button>

                </Link>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

      <div className="featured-view-all">

        <Link to="/properties">

          <Button>

            Browse All Properties

          </Button>

        </Link>

      </div>

    </section>

  );

}