import { Container } from "@/components/LandingPage/Container";
import { Hero } from "@/components/LandingPage/Hero";
import { SectionTitle } from "@/components/LandingPage/SectionTitle";
import { Benefits } from "@/components/LandingPage/Benefits";
import { Video } from "@/components/LandingPage/Video";
import { Testimonials } from "@/components/LandingPage/Testimonials";
import { Faq } from "@/components/LandingPage/Faq";
import { Cta } from "@/components/LandingPage/Cta";
import PricingTable from "@/components/LandingPage/PricingTable"
import HomeLayout from "@/components/LandingPage/HomeLayout";

import { benefitOne, benefitTwo } from "@/components/LandingPage/data";
export default function Home() {
  return (
    <HomeLayout>
      <Container>
        <Hero />
        <SectionTitle
          id="features"
          preTitle="NenoPress Benefits"
          title="Why Choose NenoPress for Your Blog?"
        >
          NenoPress is the ultimate blogging tool, powered by advanced AI,
          to generate, optimize, and publish high-quality content seamlessly.
          Simplify your workflow today!
        </SectionTitle>

        <Benefits data={benefitOne} />
        <Benefits imgPos="right" data={benefitTwo} />

        <SectionTitle
          id="pricing"
          preTitle="Our Pricing"
          title="Choose the Perfect Plan for Your Blogging Needs"
        >
          Explore NenoPress&apos;s flexible pricing options designed to suit bloggers of all levels.
          Start transforming your content creation journey today!
        </SectionTitle>
        <PricingTable />

        <SectionTitle
          id="video"
          preTitle="See NenoPress in Action"
          title="Discover How NenoPress Can Revolutionize Your Blogging"
        >
          Watch this demo to learn how NenoPress can help you effortlessly generate and publish content.
        </SectionTitle>

        <Video videoId="EEcqtK80nkI" />

        <SectionTitle
          id="testimonials"
          preTitle="What Our Users Say"
          title="Trusted by Bloggers Worldwide"
        >
          Hear directly from our users about how NenoPress has revolutionized their blogging workflow.
          From effortless content creation to increased productivity, they share their experiences.
        </SectionTitle>

        <Testimonials />

        <SectionTitle id="faqs" preTitle="FAQ" title="Got Questions? We’ve Got Answers">
          Here, you’ll find answers to common questions about NenoPress.
          Addressing these now can save you time and help you get started faster.
        </SectionTitle>
        <Faq />
        <Cta />
      </Container>
    </HomeLayout>
  );
}