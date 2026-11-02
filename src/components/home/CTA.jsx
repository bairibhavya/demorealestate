import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './CTA.css';
export default function CTA(){
  const reduced=useReducedMotion();
  return <section className="cta editorial-cta"><div className="cta-overlay"><motion.div className="cta-content" initial={reduced?false:{opacity:0,y:64}} whileInView={{opacity:1,y:0}} viewport={{once:false,amount:.25}} transition={{duration:.8,ease:[.22,1,.36,1]}}>
    <span>YOUR NEXT CHAPTER STARTS HERE</span>
    <h2>Make your next move <em>matter.</em></h2>
    <p>Whether you're searching for a home, land or a new investment, explore your options and start a conversation.</p>
    <div className="cta-buttons"><Link to="/contact" className="editorial-primary">Get in touch <ArrowUpRight size={18}/></Link><Link to="/properties" className="editorial-secondary">Browse listings <ArrowUpRight size={18}/></Link></div>
  </motion.div></div></section>;
}
