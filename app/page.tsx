// src/app/page.tsx
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import OurSafetyServices from "./components/OurSafetyServices";
import OurTrustedClients from "./components/OurTrustedClients";
import WhyChooseMe from "./components/WhyChooseMe";
import Reviews from "./components/Reviews";
import Requerment from "./components/Requerment";
import FAQAndTestimonials from "./components/FAQAndTestimonials";
import ContactSection from "./components/ContactSection";

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
    <ContactSection/>
      {/* <Services />
      <Portfolio /> */}
    </>
  );
}