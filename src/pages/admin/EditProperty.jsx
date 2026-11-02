import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { uploadImage } from "../../services/storage";
import "./EditProperty.css";
export default function EditProperty() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

 const [imageFiles, setImageFiles] = useState([]);
const [gallery, setGallery] = useState([]);

const [form, setForm] = useState({
  title: "",
  location: "",
  price: "",
  description: "",
  status: "",
  property_type: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  featured: false,
  thumbnail: "",
 
});

  useEffect(() => {
    fetchProperty();
  }, []);

 async function fetchProperty() {

  // Fetch property
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    toast.error(error.message);
    navigate("/admin/properties");
    return;
  }

  // Fetch gallery
  const { data: images } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", id);

  setGallery(images || []);

  setForm({
    title: data.title || "",
    location: data.location || "",
    price: data.price || "",
    description: data.description || "",
    status: data.status || "Available",
    property_type: data.property_type || "",
    bedrooms: data.bedrooms || "",
    bathrooms: data.bathrooms || "",
    area: data.area || "",
    featured: data.featured || false,
    thumbnail: data.thumbnail || "",
  });

  setLoading(false);
}
function handleChange(e) {
  const { name, value, type, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
}
async function updateProperty() {

  setLoading(true);

  try {

    const { error } = await supabase
      .from("properties")
      .update({
        title: form.title,
        location: form.location,
        price: form.price,
        description: form.description,
        status: form.status,
        property_type: form.property_type,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        area: form.area,
        featured: form.featured,
      })
      .eq("id", id);

    if (error) throw error;

    // Upload newly selected images
    if (imageFiles.length > 0) {

      const uploaded = [];

      for (const file of imageFiles) {

        const url = await uploadImage(file);

        uploaded.push({
          property_id: id,
          image_url: url,
        });

      }

      const { error: imgError } = await supabase
        .from("property_images")
        .insert(uploaded);

      if (imgError) throw imgError;

      // Make first uploaded image thumbnail
      await supabase
        .from("properties")
        .update({
          thumbnail: uploaded[0].image_url,
        })
        .eq("id", id);

    }

    toast.success("Property Updated");

    navigate("/admin/properties");

  } catch (err) {

    console.error(err);

    toast.error(err.message);

  } finally {

    setLoading(false);

  }

}

  if (loading)
    return (
      <h2 style={{ color: "white", padding: 40 }}>
        Loading...
      </h2>
    );

  return (

    

<div className="edit-property-page">

<div className="edit-property-card">

<h1>Edit Property</h1>

<p>Update your property details</p>

<form className="edit-form">

<label>Title</label>

<input
name="title"
value={form.title}
onChange={handleChange}
/>

<label>Location</label>

<input
name="location"
value={form.location}
onChange={handleChange}
/>

<label>Price</label>

<input
name="price"
value={form.price}
onChange={handleChange}
/>

<label>Bedrooms</label>

<input
type="number"
name="bedrooms"
value={form.bedrooms}
onChange={handleChange}
/>

<label>Bathrooms</label>

<input
type="number"
name="bathrooms"
value={form.bathrooms}
onChange={handleChange}
/>

<label>Area (Sq.ft)</label>

<input
type="number"
name="area"
value={form.area}
onChange={handleChange}
/>

<label>Property Type</label>

<select
name="property_type"
value={form.property_type}
onChange={handleChange}
>
<option value="">Select Property Type</option>
<option value="Apartment">Apartment</option>
<option value="Villa">Villa</option>
<option value="Independent House">Independent House</option>
<option value="Plot">Plot</option>
</select>

<label>Status</label>

<select
name="status"
value={form.status}
onChange={handleChange}
>
<option>Available</option>
<option>Sold</option>
<option>Upcoming</option>
</select>
<label>Current Images</label>

<div className="image-preview-grid">

  {gallery.map((img) => (

    <div
      key={img.id}
      className="preview-card"
    >

      <img
        src={img.image_url}
        alt=""
        className="preview-image"
      />

      <button
        type="button"
        className="remove-image"
        onClick={async () => {

          await supabase
            .from("property_images")
            .delete()
            .eq("id", img.id);

          setGallery(
            gallery.filter(g => g.id !== img.id)
          );

          toast.success("Image Removed");

        }}
      >
        ×
      </button>

    </div>

  ))}

</div>
<label>Current Images</label>

{/* <div className="image-preview-grid">

  {gallery.map((img) => (

    <div
      key={img.id}
      className="preview-card"
    >

      <img
        src={img.image_url}
        alt=""
        className="preview-image"
      />

      <button
        type="button"
        className="remove-image"
        onClick={async () => {

          await supabase
            .from("property_images")
            .delete()
            .eq("id", img.id);

          setGallery(
            gallery.filter(g => g.id !== img.id)
          );

          toast.success("Image Removed");

        }}
      >
        ×
      </button>

    </div>

  ))}

</div> */}
<label>Add More Images</label>

<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {

    const files = Array.from(e.target.files);

    setImageFiles(files);

  }}
/>
{imageFiles.length > 0 && (

  <>

    <label>New Images Preview</label>

    <div className="image-preview-grid">

      {imageFiles.map((file, index) => (

        <div
          key={index}
          className="preview-card"
        >

          <img
            src={URL.createObjectURL(file)}
            alt=""
            className="preview-image"
          />

          <button
            type="button"
            className="remove-image"
            onClick={() =>
              setImageFiles(
                imageFiles.filter((_, i) => i !== index)
              )
            }
          >
            ×
          </button>

        </div>

      ))}

    </div>

  </>

)}
<label>Description</label>

<textarea
rows="6"
name="description"
value={form.description}
onChange={handleChange}
/>

{/* <label>Featured</label> */}

{/* <label className="featured-check">

<input
type="checkbox"
name="featured"
checked={form.featured}
onChange={handleChange}
/>

Featured Property

</label> */}

<div></div>

<button
type="button"
className="save-btn"
onClick={updateProperty}
>

Update Property

</button>

</form>

</div>

</div>

);


}