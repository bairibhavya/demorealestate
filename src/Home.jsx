import Hero from "../components/home/Hero";
import FeaturedProperties from "../components/home/FeaturedProperties";
import BusinessVerticals from "../components/home/BusinessVerticals";
import Process from "../components/home/Process";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <BusinessVerticals />
      <Process />
      <CTA />
    </>
  );
}