// src/app/page.tsx

import Hero from "../components/Hero";
import OurSafetyServices from "../components/OurSafetyServices";
import OurTrustedClients from "../components/OurTrustedClients";
import WhyChooseMe from "../components/WhyChooseMe";
import Requerment from "../components/Requerment";
import Reviews from "../components/Reviews";
import FAQAndTestimonials from "../components/FAQ";
import ContactSection from "../components/ContactSection";
import FiverrReview from "../components/FiverrReview";

export default function Home() {
  return (
    <>
      <Hero />
      
      <OurSafetyServices/>
      <OurTrustedClients/>
      <WhyChooseMe/>
      <Requerment/>
    <Reviews/>
    <FAQAndTestimonials/>
    <FiverrReview/>
    <ContactSection/>
      {/* <Services />
      <Portfolio /> */}
      
</>
  );
}