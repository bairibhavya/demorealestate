import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { uploadImage } from "../../services/storage";
import "./AddProperty.css";

export default function AddProperty() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    status: "Available",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    thumbnail: "",
    featured: false,
  });

  function handleChange(e) {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

  }

  // async function handleSubmit(e) {

  //   e.preventDefault();

  //   setLoading(true);

  //   const { error } = await supabase
  //     .from("properties")
  //     .insert([form]);

  //   setLoading(false);

  //   if (error) {

  //     toast.error(error.message);
  //     return;

  //   }

  //   toast.success("Property Added Successfully");

  //   navigate("/admin/properties");

  // }
// async function handleSubmit(e) {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     let thumbnailUrl = "";

//     // Upload image if selected
//     if (imageFile) {
//       thumbnailUrl = await uploadImage(imageFile);
//       console.log("IMAGE URL:", thumbnailUrl);
//     }

//     // Save property with image URL
//     const { error } = await supabase
//       .from("properties")
//       .insert([
//         {
//           ...form,
//           thumbnail: thumbnailUrl,
//         },
//       ]);

//     if (error) throw error;

//     toast.success("Property Added Successfully");

//     navigate("/admin/properties");

//   } catch (err) {
//     console.error(err);
//     toast.error(err.message);
//   } finally {
//     setLoading(false);
//   }
// }
async function handleSubmit(e) {
  e.preventDefault();

  try {
    setLoading(true);

    // Upload all images
    let uploadedImages = [];

    for (const file of imageFiles) {
      const imageUrl = await uploadImage(file);
      uploadedImages.push(imageUrl);
    }

    // First image becomes thumbnail
    const thumbnailUrl = uploadedImages[0] || "";

    // Save Property
    const { data: property, error } = await supabase
      .from("properties")
      .insert([
        {
          ...form,
          price: form.price.trim() === '' ? null : Number(form.price),
          bedrooms: form.bedrooms === '' ? null : Number(form.bedrooms),
          bathrooms: form.bathrooms === '' ? null : Number(form.bathrooms),
          area: form.area === '' ? null : Number(form.area),
          thumbnail: thumbnailUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Save Gallery Images
    if (uploadedImages.length > 0) {
      const gallery = uploadedImages.map((url) => ({
        property_id: property.id,
        image_url: url,
      }));

      const { data: galleryData, error: galleryError } = await supabase
  .from("property_images")
  .insert(gallery)
  .select();

console.log("Gallery Data:", galleryData);
console.log("Gallery Error:", galleryError);

if (galleryError) throw galleryError;
    }

    toast.success("Property Added Successfully");

    navigate("/admin/properties");

  } catch (err) {

    console.error(err);

    toast.error(err.message);

  } finally {

    setLoading(false);

  }
}
  return (

    <div className="add-property-page">

      <h2>Add Property</h2>

      <form
        onSubmit={handleSubmit}
        className="property-form"
      >

        <input
          name="title"
          placeholder="Property Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <select
  name="property_type"
  value={form.property_type}
  onChange={handleChange}
  required
>
  <option value="">Select Property Type</option>
  <option value="Apartment">Apartment</option>
  <option value="Villa">Villa</option>
  <option value="Independent House">Independent House</option>
</select>

        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
        />

        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
        />

        <input
          type="number"
          name="area"
          placeholder="Area (Sq.ft)"
          value={form.area}
          onChange={handleChange}
        />

 <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    const newFiles = Array.from(e.target.files);

    setImageFiles((prev) => {
      const updated = [...prev, ...newFiles];
      return updated.slice(0, 5); // Maximum 5 images
    });

    e.target.value = "";
  }}
/>

{imageFiles.length > 0 && (
  <div
    className="image-preview-grid"
    
  >
    <div
  className="preview-wrapper"
>
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
        onClick={() =>
          setImageFiles(imageFiles.filter((_, i) => i !== index))
        }
        className="remove-image"
      >
        ×
      </button>
    </div>
  ))}
</div>
  </div>
)}

        <textarea
          rows="6"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >

          <option>Available</option>
          <option>Reserved</option>
          <option>Sold</option>
          <option>Upcoming</option>

        </select>

        <label className="featured-check">

          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />

          Featured Property

        </label>

        <button
          type="submit"
          disabled={loading}
        >

          {loading ? "Saving..." : "Add Property"}

        </button>

      </form>

    </div>

  );

}