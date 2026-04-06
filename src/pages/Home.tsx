import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import AboutSection from "@/components/public/AboutSection";
import MenuPreview from "@/components/public/MenuPreview";
import Testimonials from "@/components/public/Testimonials";
import ReservationSection from "@/components/public/ReservationSection";
import FloatingMenuButton from "@/components/public/FloatingMenuButton";
import Footer from "@/components/public/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <AboutSection />
      <MenuPreview />
      <Testimonials />
      <ReservationSection />
      <FloatingMenuButton />
      <Footer />
    </main>
  );
}
