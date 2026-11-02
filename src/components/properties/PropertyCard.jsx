import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import Button from "../ui/Button";
import "./PropertyCard.css";

export default function PropertyCard({ property }) {

  return (

    <div className="property-card">

      <div className="property-card-image">

        {property.thumbnail ? (
  <img
    src={property.thumbnail}
    alt={property.title}
  />
) : (
  <div className="property-placeholder">
    No Image
  </div>
)}

        <span>

          {property.status}

        </span>

      </div>

      <div className="property-card-body">

        <h3>

          {property.title}

        </h3>

        <p>

          <MapPin size={16}/>

          {property.location}

        </p>

        <div className="property-card-bottom">

          <h4>

            ₹ {property.price}

          </h4>

          <Link to={`/property/${property.id}`}>

            <Button>

              View

            </Button>

          </Link>

        </div>

      </div>

    </div>

  );

}