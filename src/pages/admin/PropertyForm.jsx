import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import "./PropertyForm.css";

export default function PropertyForm() {

  const navigate = useNavigate();

  const [loading,setLoading]=useState(false);

  const [form,setForm]=useState({

    title:"",
    location:"",
    price:"",
    description:"",
    property_type:"",
    bedrooms:"",
    bathrooms:"",
    area:"",
    status:"Available",
    featured:false

  });

  const [image,setImage]=useState(null);

  function handleChange(e){

    const {name,value,type,checked}=e.target;

    setForm(prev=>({

      ...prev,

      [name]:type==="checkbox"?checked:value

    }));

  }

  async function handleSubmit(e){

    e.preventDefault();

    try{

      setLoading(true);

      let imageUrl="";

      if(image){

        const fileName=`${Date.now()}-${image.name}`;

        const {error:uploadError}=await supabase
        .storage
        .from("property-images")
        .upload(fileName,image);

        if(uploadError) throw uploadError;

        const {data}=supabase
        .storage
        .from("property-images")
        .getPublicUrl(fileName);

        imageUrl=data.publicUrl;

      }

      const {error}=await supabase
      .from("properties")
      .insert([{

        ...form,

        thumbnail:imageUrl

      }]);

      if(error) throw error;

      toast.success("Property Added");

      navigate("/admin/properties");

    }

    catch(err){

      toast.error(err.message);

    }

    finally{

      setLoading(false);

    }

  }

  return(

<div className="property-form-page">

<h2>Add Property</h2>

<form
className="property-form"
onSubmit={handleSubmit}
>

<input

name="title"

placeholder="Property Title"

onChange={handleChange}

required

/>

<input

name="location"

placeholder="Location"

onChange={handleChange}

required

/>

<input

name="price"

type="number"

placeholder="Price"

onChange={handleChange}

required

/>

<input

name="property_type"

placeholder="Villa / Apartment / Plot"

onChange={handleChange}

/>

<div className="three-grid">

<input

name="bedrooms"

type="number"

placeholder="Bedrooms"

onChange={handleChange}

/>

<input

name="bathrooms"

type="number"

placeholder="Bathrooms"

onChange={handleChange}

/>

<input

name="area"

type="number"

placeholder="Area (Sqft)"

onChange={handleChange}

/>

</div>

<textarea

name="description"

placeholder="Description"

rows="6"

onChange={handleChange}

/>
<label>Amenities</label>

<textarea
name="amenities"
placeholder="Swimming Pool, Lift, Parking, Security"
onChange={handleChange}
/>

<label>Google Maps Link</label>

<input
name="map_link"
placeholder="https://maps.google.com/..."
onChange={handleChange}
/>

<label>Gallery Images</label>

<input
type="file"
multiple
accept="image/*"
onChange={(e)=>setGallery([...e.target.files])}
/>
<select

name="status"

onChange={handleChange}

>

<option>Available</option>

<option>Sold</option>

</select>

<label className="featured-box">

<input

type="checkbox"

name="featured"

onChange={handleChange}

/>

Featured Property

</label>

<input

type="file"

accept="image/*"

onChange={(e)=>setImage(e.target.files[0])}

/>

<button>

{loading?"Saving...":"Save Property"}

</button>

</form>

</div>

)

}