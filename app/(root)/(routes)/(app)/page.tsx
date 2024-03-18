"use client";
import { Cta } from "@/components/dashboard/cta";
import { Faq } from "@/components/dashboard/faq";
import { FeaturedOn } from "@/components/dashboard/featured_on";
import { Features } from "@/components/dashboard/features";
import { Features2 } from "@/components/dashboard/features_2";
import { Hero } from "@/components/dashboard/hero";
import { Price } from "@/components/dashboard/price";
import { Reviews } from "@/components/dashboard/reviews";
import { Steps } from "@/components/dashboard/steps";
import { Testimonial } from "@/components/dashboard/testimonial";

function Page() {
  return (
    <div>
      <Hero />
      <Reviews />
      <FeaturedOn />
      <Testimonial />
      <Steps />
      <Features />
      <Features2 />
      <div id="pricing" className="h-20"></div>
      <Price />
      <Faq />
      <Cta />
    </div>
  );
}

export default Page;
