import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


import {
  Search,
  MapPin,
  IndianRupee,
  Building2,
  Plus
} from "lucide-react";

import { supabase } from "../../services/supabase";
import "./Properties.css";

export default function Properties() {
const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  useEffect(() => { setSearch(params.get("search") || ""); }, [params]);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setProperties(data || []);
  }

  async function deleteProperty(id) {

    const confirmDelete = window.confirm(
      "Delete this property?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Property Deleted");

    fetchProperties();
  }

  const filteredProperties = properties.filter((property) =>
    `${property.title} ${property.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div className="properties-page">

      <div className="properties-top">

        <div>

          <h1>

            Property Management

          </h1>

          <p>

            {properties.length} Properties Available

          </p>

        </div>

        <Link
          to="/admin/AddProperty"
          className="add-property-btn"
        >

          <Plus size={18} />

          Add Property

        </Link>

      </div>

      <div className="properties-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search Property..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

        </div>

      </div>

      <div className="property-grid">

        {

          filteredProperties.map((property)=>(

            <div
              key={property.id}
              className="property-card"
            >

              <div className="property-image">

                {

                  property.thumbnail ?

                  <img
                    src={property.thumbnail}
                    alt={property.title}
                  />

                  :

                  <div className="image-placeholder">

                    <Building2 size={55}/>

                  </div>

                }

                <span
                  className={`status-badge ${property.status?.toLowerCase()}`}
                >

                  {property.status || "Available"}

                </span>

              </div>

              <div className="property-body">

                <h2>

                  {property.title}

                </h2>

                <div className="property-info">

                  <p>

                    <MapPin size={16}/>

                    {property.location}

                  </p>

                  <p>

                    <IndianRupee size={16}/>

                    {property.price}

                  </p>

                </div>

                <div className="property-actions">
                  
  {/* <Link
    to={`/admin/EditProperty/${property.id}`}
    className="edit-btn"
  >
    Edit
  </Link> */}
  <button
  className="edit-btn"
  onClick={() => navigate(`/admin/EditProperty/${property.id}`)}
>
  Edit
</button>

  <button
    type="button"
    className="delete-btn"
    onClick={() => deleteProperty(property.id)}
  >
    Delete
  </button>
</div>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}