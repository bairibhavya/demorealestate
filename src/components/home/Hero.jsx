import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, Building2, MapPinned, SlidersHorizontal } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay = 0) => ({ initial: reduced ? false : {opacity:0,y:42}, animate:{opacity:1,y:0}, transition:{duration:.85,delay,ease:[.22,1,.36,1]} });
  return <section className="hero editorial-hero">
    <div className="editorial-grid" aria-hidden="true" />
    <div className="editorial-orb" aria-hidden="true" />
    <div className="hero-container editorial-container">
      <motion.div {...rise(0)} className="editorial-eyebrow"><span className="eyebrow-line" /> REAL ESTATE, REIMAGINED <span className="eyebrow-number">01 / 03</span></motion.div>
      <motion.h1 {...rise(.12)} className="editorial-title">Find space for<br/><em>what's next.</em></motion.h1>
      <motion.p {...rise(.24)} className="editorial-intro">Discover apartments, villas, plots and investment opportunities — presented with clarity, designed around your next move.</motion.p>
      <motion.div {...rise(.36)} className="editorial-actions">
        <Link to="/properties" className="editorial-primary">Explore properties <ArrowUpRight size={19}/></Link>
        <Link to="/contact" className="editorial-secondary">Talk to an advisor <ArrowUpRight size={17}/></Link>
      </motion.div>
      <motion.div {...rise(.48)} className="editorial-features">
        <div><Building2 size={22}/><span>Homes & apartments</span></div>
        <div><MapPinned size={22}/><span>Plots & land</span></div>
        <div><SlidersHorizontal size={22}/><span>Search your way</span></div>
      </motion.div>
    </div>
    <div className="editorial-side-label" aria-hidden="true">A BETTER WAY TO DISCOVER PROPERTY</div>
    <a href="#featured" className="editorial-scroll" aria-label="Scroll to featured properties"><ArrowDown size={18}/> SCROLL TO EXPLORE</a>
  </section>;
}
