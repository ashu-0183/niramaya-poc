import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { About } from "@/components/site/About";
import { Conditions } from "@/components/site/Conditions";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Navbar } from "@/components/site/Navbar";
import { Profile } from "@/components/site/Profile";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { scrollToId, useLenis } from "@/lib/smooth";

export default function Landing() {
  useLenis();
  const [service, setService] = useState("");
  const book = (key) => {
    if (typeof key === "string" && key) setService(key);
    scrollToId("contact");
  };

  return (
    <MotionConfig reducedMotion="user">
      <Navbar onBook={() => book()} />
      <main>
        <Hero onBook={() => book()} />
        <Marquee />
        <About />
        <Services onBook={book} />
        <Conditions />
        <Profile />
        <Testimonials />
        <Contact service={service} setService={setService} />
      </main>
      <Footer onBook={() => book()} />
      <WhatsAppButton />
      <Toaster position="top-center" richColors />
    </MotionConfig>
  );
}
