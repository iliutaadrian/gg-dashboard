"use client";

import { UserButton } from "@clerk/nextjs";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { MobileMenu } from "./mobile-menu";

export const Navbar = () => {
  const navigation = [{ name: "Settings", href: "/settings", icon: GearIcon }];

  return (
    <nav className="fixed z-20 inset-x-0 top-0 px-10 shadow-neonLight align-middle flex flex-row justify-between items-center w-full h-12 bg-background">
      <Link href={"/"} className="text-lg font-bold text-primary min-w-[200px]">
        GG Dashboard
      </Link>
      <div className="md:hidden text-muted-foreground">
        <MobileMenu navigation={navigation} />
      </div>

      <div className="hidden text-sm md:flex flex-row gap-5 align-middle items-center justify-end w-full">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm hover:text-primary"
          >
            <item.icon className="w-5 h-5 hover:text-primary" />
          </Link>
        ))}
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};
