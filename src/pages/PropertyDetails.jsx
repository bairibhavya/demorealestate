import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Building2, MapPin, MoveUpRight, Ruler, Search, MessageCircle } from "lucide-react";
import { supabase } from "../services/supabase";
import fallbackImage from "../assets/images/property2.jpeg";
import "./PropertyDetails.css";

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const whatsappNumber = (import.meta.env.VITE_CONTACT_WHATSAPP || "").replace(/\D/g, "");

function displayPrice(price) {
  if (price === null || price === undefined || price === "") return "Price on request";
  const number = Number(price);
  return Number.isFinite(number) ? `₹ ${currency.format(number)}` : `₹ ${price}`;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setProperty(null);
    setGallery([]);
    setSelectedImage("");
    setSuggested([]);

    async function load() {
      const { data, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!active) return;
      if (propertyError || !data) {
        setError(propertyError?.message || "This property could not be found.");
        setLoading(false);
        return;
      }

      setProperty(data);
      setSelectedImage(data.thumbnail || "");
      setLoading(false);

      // Optional gallery: its failure should never hide the property details.
      const [{ data: images }, { data: otherProperties }] = await Promise.all([
        supabase.from("property_images").select("id,image_url").eq("property_id", id),
        supabase
          .from("properties")
          .select("id,title,location,price,thumbnail,property_type,status")
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      if (!active) return;
      setGallery(images || []);
      setSuggested([...(otherProperties || [])].sort((a, b) =>
        Number(b.property_type === data.property_type) - Number(a.property_type === data.property_type)
      ).slice(0, 4));
    }

    load();
    return () => { active = false; };
  }, [id]);

  const photos = useMemo(() => {
    const all = [property?.thumbnail, ...gallery.map((image) => image.image_url)].filter(Boolean);
    return [...new Set(all)];
  }, [property?.thumbnail, gallery]);

  if (loading) {
    return <main className="pd-page"><div className="pd-message">Loading property details…</div></main>;
  }
  if (error || !property) {
    return <main className="pd-page"><div className="pd-message"><p>{error || "Property not found"}</p><Link to="/properties">Browse properties <ArrowRight size={16} /></Link></div></main>;
  }

  const isPlot = /plot|land/i.test(property.property_type || "");
  const features = [
    { key: "type", icon: Building2, label: property.property_type || "Property" },
    ...(!isPlot && Number(property.bedrooms) > 0 ? [{ key: "beds", icon: BedDouble, label: `${property.bedrooms} Beds` }] : []),
    ...(!isPlot && Number(property.bathrooms) > 0 ? [{ key: "baths", icon: Bath, label: `${property.bathrooms} Baths` }] : []),
    ...(property.area ? [{ key: "area", icon: Ruler, label: `${property.area} Sq.ft` }] : []),
  ];

  const message = `Hi RealEstate Demo,\n\nI'm interested in this property.\n\nProperty: ${property.title}\nLocation: ${property.location || "Not specified"}\nPrice: ${displayPrice(property.price)}\n\nPlease share more details.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="pd-page">
      <div className="pd-shell">
        <div className="pd-toolbar">
          <button type="button" className="pd-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={17} /> Back
          </button>
          <nav aria-label="Breadcrumb" className="pd-breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/properties">Properties</Link><span>/</span><span>Details</span>
          </nav>
        </div>

        <div className="pd-image-wrap">
          <img className="pd-cover" src={selectedImage || photos[0] || fallbackImage} alt={property.title} />
          <span className="pd-image-badge">{property.status || "Property"}</span>
        </div>
        {photos.length > 1 && (
          <div className="pd-thumbnails" aria-label="Property photos">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo}
                className={`pd-thumbnail ${selectedImage === photo ? "is-selected" : ""}`}
                onClick={() => setSelectedImage(photo)}
                aria-label={`View property photo ${index + 1}`}
                aria-pressed={selectedImage === photo}
              >
                <img src={photo} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <article className="pd-detail-card">
          <div className="pd-overview">
            <div className="pd-title-group">
              <span className="pd-kicker">PROPERTY DETAILS</span>
              <h1>{property.title}</h1>
              <p className="pd-location"><MapPin size={16} /> {property.location || "Location on request"}</p>
            </div>
            <div className="pd-price-group">
              <span>Asking price</span>
              <strong>{displayPrice(property.price)}</strong>
            </div>
          </div>

          <div className="pd-features">
            {features.map(({ key, icon: Icon, label }) => <span key={key}><Icon size={17} />{label}</span>)}
          </div>

          {property.description && (
            <div className="pd-description">
              <h2>About this property</h2>
              <p>{property.description}</p>
            </div>
          )}

          <div className="pd-actions">
            {whatsappNumber && <a className="pd-button pd-button--primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> WhatsApp enquiry
            </a>}
            <Link className="pd-button pd-button--secondary" to="/contact" state={{ property_id: property.id, property_name: property.title }}>
              Enquire now <MoveUpRight size={17} />
            </Link>
          </div>
        </article>

        <section className="pd-related" aria-labelledby="pd-related-title">
          <div className="pd-related-heading">
            <div>
              <span className="pd-kicker">KEEP EXPLORING</span>
              <h2 id="pd-related-title">Explore More Properties</h2>
              <p>Discover other options that might be right for you.</p>
            </div>
            <Link to="/properties" className="pd-view-all">View all properties <ArrowRight size={17} /></Link>
          </div>

          {suggested.length ? (
            <div className="pd-related-grid">
              {suggested.map((item) => (
                <Link to={`/property/${item.id}`} key={item.id} className="pd-related-card">
                  <div className="pd-related-image">
                    <img src={item.thumbnail || fallbackImage} alt={item.title || "Property"} loading="lazy" />
                    <span>{item.property_type || "Property"}</span>
                  </div>
                  <div className="pd-related-body">
                    <h3>{item.title}</h3>
                    <p><MapPin size={14} /> {item.location || "Location on request"}</p>
                    <div className="pd-related-bottom"><strong>{displayPrice(item.price)}</strong><ArrowRight size={18} /></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="pd-related-empty"><Search size={22} /><p>Looking for more options?</p><Link to="/properties">Browse all properties <ArrowRight size={16} /></Link></div>
          )}
        </section>
      </div>
    </main>
  );
}
