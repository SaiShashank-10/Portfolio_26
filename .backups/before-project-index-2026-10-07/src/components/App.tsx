import SmoothScroll from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import HeroTicker from "./hero/HeroTicker";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";
import { COPY } from "@/lib/data";
export default function App() {
  return (
    <SmoothScroll>
      <a className="skip-link" href="#main">
        {COPY.ui.skip}
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <HeroTicker />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <RevealObserver />
    </SmoothScroll>
  );
}
