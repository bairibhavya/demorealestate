import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, ShieldCheck, Search, MessageCircle, CheckCircle2 } from 'lucide-react';
import './About.css';

const reveal = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.55 } };
const benefits = [
  { icon: Search, title: 'Find the right property', text: 'Browse plots, apartments, villas and commercial properties in one place.' },
  { icon: ShieldCheck, title: 'Make informed decisions', text: 'Explore clear property information, locations and key highlights.' },
  { icon: MessageCircle, title: 'Connect directly', text: 'Ask questions, request details and arrange a site visit with ease.' }
];
export default function About() {
  return <main className="market-about">
    <section className="market-about-hero">
      <div className="market-about-shell market-about-hero-grid">
        <motion.div {...reveal}>
          <span className="market-about-eyebrow">ABOUT REALESTATE DEMO</span>
          <h1>Property search,<br/><span>made simpler.</span></h1>
          <p>Explore residential and investment properties with clear details, practical filters and an easier way to connect with the right people.</p>
          <div className="market-about-actions"><Link to="/properties" className="market-about-button">Explore properties <ArrowRight size={18}/></Link><Link to="/contact" className="market-about-outline">Contact us</Link></div>
          <div className="market-about-trust"><CheckCircle2 size={18}/> Property-first discovery <span>•</span> Simple enquiries <span>•</span> Clear information</div>
        </motion.div>
        <motion.div {...reveal} className="market-about-visual"><img src="/images/properties/property1.jpeg" alt="Modern residential property"/><div className="market-about-visual-note"><MapPin size={18}/> Discover properties by location</div></motion.div>
      </div>
    </section>
    <section className="market-about-section"><div className="market-about-shell">
      <motion.div {...reveal} className="market-about-section-intro"><span className="market-about-eyebrow">WHAT WE DO</span><h2>Everything you need to start your property search.</h2><p>Whether you're exploring your first home, comparing investments or searching for land, our platform helps you narrow down your options.</p></motion.div>
      <div className="market-about-cards">{benefits.map(({icon:Icon,title,text})=><motion.article {...reveal} key={title} className="market-about-card"><div className="market-about-icon"><Icon size={26}/></div><h3>{title}</h3><p>{text}</p></motion.article>)}</div>
    </div></section>
    <section className="market-about-bottom"><div className="market-about-shell market-about-bottom-grid"><motion.div {...reveal}><span className="market-about-eyebrow">EXPLORE WITH CONFIDENCE</span><h2>Find a place that fits your next chapter.</h2><p>Compare opportunities across different property types, locations and budgets, then reach out when you're ready.</p><Link to="/properties" className="market-about-button">Browse listings <ArrowRight size={18}/></Link></motion.div><motion.div {...reveal} className="market-about-types"><div><Building2/><span>Apartments & villas</span></div><div><MapPin/><span>Plots & land</span></div><div><Search/><span>Commercial spaces</span></div></motion.div></div></section>
  </main>;
}
