import "./PropertyTable.css";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

export default function PropertyTable({
  properties,
  loading,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="table-card">
        <h3>Loading properties...</h3>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="table-card empty-state">
        <h2>No Properties Found</h2>
        <p>Add your first property.</p>

        <Link
          to="/admin/AddProperty"
          className="add-property-btn"
        >
          + Add Property
        </Link>
      </div>
    );
  }

  return (
    <div className="table-card">

      <div className="table-header">

        <h2>Property List</h2>

        <input
          type="text"
          placeholder="Search property..."
          className="search-box"
        />

      </div>

      <table>

        <thead>

          <tr>

            <th>Title</th>

            <th>Location</th>

            <th>Price</th>

            <th>Status</th>

            <th>Featured</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {properties.map((property) => (

            <tr key={property.id}>

              <td>{property.title}</td>

              <td>{property.location}</td>

              <td>
                ₹
                {Number(property.price).toLocaleString()}
              </td>

              <td>

                <span
                  className={`status ${property.status.toLowerCase()}`}
                >
                  {property.status}
                </span>

              </td>

              <td>

                {property.featured ? (
                  <FaStar className="featured" />
                ) : (
                  <FaRegStar />
                )}

              </td>

              <td>

                <div className="action-buttons">

                  <Link
                    to={`/admin/edit-property/${property.id}`}
                    className="edit-btn"
                  >
                    <FaEdit />
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      onDelete(property.id)
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}