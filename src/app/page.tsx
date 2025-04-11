import Script from 'next/script'
import Hero from "@/components/Hero";
import FAQ from "@/components/FAQ";
import Container from "@/components/Container";
import CTA from "@/components/CTA";
import FeatureCards from "@/components/FeaturedCards";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomePage: React.FC = () => {
  return (
    <>
      <Script defer data-domain="namekon.elidayjuma.com" src="https://analytics.elidayjuma.com/js/script.js" />
      <Header />
      <Hero />
      <FeatureCards />
      <Container>
        <FAQ />
        <CTA />
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
