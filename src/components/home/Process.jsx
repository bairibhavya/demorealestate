import { motion } from "framer-motion";
import {
  Search,
  MapPinned,
  FileCheck,
  Home
} from "lucide-react";

import "./Process.css";

const steps = [

  {
    icon:<Search size={34}/>,
    title:"Choose Property",
    text:"Browse premium flats and luxury villas from trusted builders."
  },

  {
    icon:<MapPinned size={34}/>,
    title:"Site Visit",
    text:"Visit shortlisted properties with our expert guidance."
  },

  {
    icon:<FileCheck size={34}/>,
    title:"Documentation",
    text:"Transparent documentation and complete legal assistance."
  },

  {
    icon:<Home size={34}/>,
    title:"Move In",
    text:"Complete your interiors and move into your dream home."
  }

];

export default function Process(){

return(

<section className="process">

<div className="section-title">

<span>OUR PROCESS</span>

<h2>

Simple • Transparent • Hassle Free

</h2>

<p>

We make your home buying journey smooth from start to finish.

</p>

</div>

<div className="process-grid">

{steps.map((step,index)=>(

<motion.div

key={step.title}

className="process-card"

initial={{opacity:0,y:60}}

whileInView={{opacity:1,y:0}}

transition={{duration:.5,delay:index*.08}}

viewport={{once:true}}

>

<div className="process-number">

0{index+1}

</div>

<div className="process-icon">

{step.icon}

</div>

<h3>

{step.title}

</h3>

<p>

{step.text}

</p>

</motion.div>

))}

</div>

</section>

);

}