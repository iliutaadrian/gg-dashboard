"use client";
import { Cta } from "@/components/dashboard/cta";
import { Faq } from "@/components/dashboard/faq";
import { FeaturedOn } from "@/components/dashboard/featured_on";
import { Features } from "@/components/dashboard/features";
import { Footer } from "@/components/dashboard/footer";
import { Hero } from "@/components/dashboard/hero";
import { Price } from "@/components/dashboard/price";

function Page() {
  return (
    <div>
      <Hero />
      <FeaturedOn />
      <Features />
      <Price />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}

export default Page;
