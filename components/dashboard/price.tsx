"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CheckIcon, XIcon } from "lucide-react";

export function Price() {
  const prices = [
    {
      name: "Starter",
      price: 10,
      initial_price: 29,
      popular: false,
      link: "https://buy.stripe.com/5kA0g9wXf4aY2P3aJh",
      facilities_yes: [
        "NextJS boilerplate",
        "SEO & Blog",
        "Mailgun emails",
        "Stripe payments",
        "MongoDB / Supabase",
        "Google Oauth & Magic Links",
        "Components & animations",
      ],
      facilities_no: [
        "ChatGPT prompts for terms & privacy",
        "Discord community",
        "Lifetime updates",
      ],
    },
    {
      name: "Pro",
      price: 100,
      initial_price: 299,
      popular: true,
      link: "https://buy.stripe.com/5kA0g9wXf4aY2P3aJh",
      facilities_yes: [
        "NextJS boilerplate",
        "SEO & Blog",
        "Mailgun emails",
        "Stripe payments",
        "MongoDB / Supabase",
        "Google Oauth & Magic Links",
        "Components & animations",
        "ChatGPT prompts for terms & privacy",
        "Lifetime updates",
        "Discord community",
      ],
      facilities_no: [],
    },
  ];
  return (
    <div
      className=" md:max-w-5xl mx-auto py-10 flex flex-col items-center"
      id="pricing"
    >
      <h1 className="text-2xl md:text-4xl font-bold text-primary text-center">
        Pricing
      </h1>
      <h1 className="text-xl font-medium text-center">
        Conversations Redefined, Boundaries Unleashed
      </h1>
      <div className="mt-4 px-3 text-sm text-center">
        <ul className="flex flex-col md:flex-row gap-10">
          {prices.map((price, index) => (
            <li
              key={index}
              className={cn(
                "p-5 flex  flex-col gap-5 relative items-center rounded-lg shadow-neon bg-background/50 hover:bg-background group w-md max-w-md",
                price.popular ? "border-2 border-primary" : "",
              )}
            >
              {price.popular && (
                <span className="absolute px-3 top-[-10px] bg-primary rounded-lg">
                  Popular
                </span>
              )}
              <div className="text-4xl text-primary">{price.name}</div>
              <div className="flex items-center mb-2">
                <h3 className="text-3xl font-semibold group-hover:text-primary">
                  <span className="text-xl text-muted-foreground line-through mr-2">
                    ${price.initial_price}
                  </span>
                  ${price.price}
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {price.facilities_yes.map((facility, index) => (
                  <p className="flex items-center" key={index}>
                    <CheckIcon className="w-6 h-6 text-primary mr-2" />
                    {facility}
                  </p>
                ))}
                {price.facilities_no.map((facility, index) => (
                  <p
                    className="flex items-center text-muted-foreground"
                    key={index}
                  >
                    <XIcon className="w-6 h-6 text-primary mr-2" />
                    {facility}
                  </p>
                ))}
              </div>
              <Button className="w-full cursor-pointer" link={price.link}>
                Get Started
              </Button>
              <div className="text-sm text-muted-foreground">
                Pay once. Build unlimited projects!
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
