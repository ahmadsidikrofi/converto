'use client'
import HeroSection from "@/components/landing/HeroSection"
import ValueProp from "@/components/landing/ValueProp"
import FeatureShowcase from "@/components/landing/FeatureShowcase"
import HowItWorks from "@/components/landing/HowItWorks"
import PrivacyDeepDive from "@/components/landing/PrivacyDeepDive"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-background selection:bg-rose-500/30">
      <HeroSection />
      <ValueProp />
      <FeatureShowcase />
      <HowItWorks />
      <PrivacyDeepDive />
      <Footer />
    </main>
  );
}

