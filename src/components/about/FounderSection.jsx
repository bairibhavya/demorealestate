import { motion } from "framer-motion";
import "./FounderSection.css";

const stats=[

{
number:"150+",
title:"Projects"
},

{
number:"350+",
title:"Happy Clients"
},

{
number:"30+",
title:"Builder Partners"
},

{
number:"100%",
title:"Client Satisfaction"
}

];

export default function FounderSection(){

return(

<section className="founder">

<div className="founder-grid">

<motion.div

className="founder-image"

initial={{opacity:0,x:-60}}

whileInView={{opacity:1,x:0}}

transition={{duration:.8}}

viewport={{once:true}}

>

<img

src="/images/Founder.jpeg"

alt="Founder"

/>

</motion.div>

<motion.div

className="founder-content"

initial={{opacity:0,x:60}}

whileInView={{opacity:1,x:0}}

transition={{duration:.8}}

viewport={{once:true}}

>

<span>

OUR FOUNDER

</span>

<h2>

MASTANVALI SHAIK

</h2>

<h4>

Founder & Managing Director

</h4>

<p>

At RealEstate Demo our mission is simple:
deliver trustworthy real estate services
with complete transparency while helping
families invest confidently.

</p>

<blockquote>

"Every home we help you buy is a
relationship we build for life."

</blockquote>

<div className="founder-stats">

{stats.map((item)=>(

<div

key={item.title}

className="stat-card"

>

<h3>

{item.number}

</h3>

<span>

{item.title}

</span>

</div>

))}

</div>

</motion.div>

</div>

</section>

);

}