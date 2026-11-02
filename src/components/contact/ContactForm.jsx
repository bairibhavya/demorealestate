import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import Button from "../ui/Button";
import "./ContactForm.css";

const blankCustomer = {
  name: "",
  phone: "",
  email: "",
  expected_date: "",
  is_just_enquiry: false,
  enquiry_for: "Myself",
  message: "",
};

export default function ContactForm() {
  const location = useLocation();
  // A visitor may arrive from a property details page or directly via Contact Us.
  const routePropertyId =
    location.state?.property_id ||
    new URLSearchParams(location.search).get("property_id") ||
    "";

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");
  const [propertyId, setPropertyId] = useState(routePropertyId);
  const [formData, setFormData] = useState(blankCustomer);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPropertyId(routePropertyId);
  }, [routePropertyId]);

  useEffect(() => {
    let mounted = true;
    async function loadProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("id,title,location,property_type")
        .order("title", { ascending: true });
      if (!mounted) return;
      setProperties(data || []);
      setPropertiesError(error?.message || "");
      setPropertiesLoading(false);
    }
    loadProperties();
    return () => { mounted = false; };
  }, []);

  const selectedProperty = useMemo(
    () => properties.find((property) => String(property.id) === String(propertyId)),
    [properties, propertyId]
  );

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    // Never store a property ID without a matching property title.
    if (propertyId && !selectedProperty) {
      toast.error("Please select a valid property or choose General enquiry.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert([{
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        expected_date: formData.expected_date || null,
        property_id: selectedProperty?.id || null,
        property_name: selectedProperty?.title || null,
      }]);
      if (error) throw error;
      toast.success("Enquiry submitted. We'll contact you soon.");
      setFormData({ ...blankCustomer });
      // Keep the selected property for a repeat enquiry.
    } catch (error) {
      toast.error(error.message || "Unable to submit your enquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contact-form-section" id="contact-enquiry-form">
      <div className="contact-form-wrapper">
        <div className="contact-left">
          <span>LET'S CONNECT</span>
          <h2>Enquire About a Property</h2>
          <p>Choose a plot, apartment or villa and our team will contact you about that specific listing.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-property-field">
            <label htmlFor="contact-property">Which property or plot are you enquiring about?</label>
            <select
              id="contact-property"
              value={propertyId}
              onChange={(event) => setPropertyId(event.target.value)}
              disabled={propertiesLoading || Boolean(propertiesError)}
              aria-describedby="contact-property-help"
            >
              <option value="">General enquiry (no specific property)</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.property_type || "Property"} — {property.title}
                  {property.location ? ` (${property.location})` : ""}
                </option>
              ))}
            </select>
            <small id="contact-property-help">
              {propertiesLoading
                ? "Loading available properties…"
                : propertiesError
                ? "Property choices are unavailable. Please try again later."
                : selectedProperty
                ? <>Selected: <strong>{selectedProperty.title}</strong> · <Link to={`/property/${selectedProperty.id}`}>View listing</Link></>
                : "Select a listing to help us identify your enquiry, or leave it as a general enquiry."}
            </small>
          </div>

          <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />

          <div className="form-group">
            <label htmlFor="contact-expected-date">When are you planning to buy?</label>
            <input id="contact-expected-date" type="date" name="expected_date" value={formData.expected_date} onChange={handleChange} />
          </div>
          <div className="checkbox-group">
            <label><input type="checkbox" name="is_just_enquiry" checked={formData.is_just_enquiry} onChange={handleChange} /> Just Enquiry</label>
          </div>
          <div className="form-group">
            <label>Enquiring For</label>
            <div className="radio-group">
              <label><input type="radio" name="enquiry_for" value="Myself" checked={formData.enquiry_for === "Myself"} onChange={handleChange} /> Myself</label>
              <label><input type="radio" name="enquiry_for" value="Someone Else" checked={formData.enquiry_for === "Someone Else"} onChange={handleChange} /> Someone Else</label>
            </div>
          </div>
          <textarea rows="4" name="message" placeholder="Tell us your requirement…" value={formData.message} onChange={handleChange} />
          <Button type="submit" loading={loading} fullWidth>Send Enquiry</Button>
        </form>
      </div>
    </section>
  );
}
