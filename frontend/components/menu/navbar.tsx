"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { MobileMenu } from "./mobile-menu";

export const Navbar = () => {
  const navigation = [
    { name: "GG Docs", title: "GG Docs", href: "/" },
    { name: "GG Tests", title: "GG Tests", href: "/tests" }
  ];
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <nav className="fixed z-20 inset-x-0 top-0 px-10 shadow-neonLight w-full h-14 bg-background flex align-middle">
      <div className="flex flex-row align-middle items-center w-full max-w-6xl mx-auto justify-between">
        <Link href={"/"} className="text-lg font-bold text-primary min-w-[150px]">
          gg <span className="text-foreground">dashboard</span>
        </Link>

        <div className="flex gap-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${item.href === currentPath ? 'text-primary' : 'text-muted-foreground'} w-20 text-sm hover:text-primary flex gap-5`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="md:hidden text-muted-foreground">
          <MobileMenu navigation={navigation} />
        </div>

        <div className="hidden text-sm md:flex flex-row gap-5 align-middle items-center justify-end w-full">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};
