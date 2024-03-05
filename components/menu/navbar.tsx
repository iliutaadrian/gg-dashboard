"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export const Navbar = () => {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
  ];

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <HamburgerMenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        {/* <Dialog */}
        {/*   as="div" */}
        {/*   className="lg:hidden" */}
        {/*   open={mobileMenuOpen} */}
        {/*   onClose={setMobileMenuOpen} */}
        {/* > */}
        {/*   <div className="fixed inset-0 z-50" /> */}
        {/*   <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"> */}
        {/*     <div className="flex items-center justify-between"> */}
        {/*       <a href="#" className="-m-1.5 p-1.5"> */}
        {/*         <span className="sr-only">Your Company</span> */}
        {/*         <img */}
        {/*           className="h-8 w-auto" */}
        {/*           src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" */}
        {/*           alt="" */}
        {/*         /> */}
        {/*       </a> */}
        {/*       <button */}
        {/*         type="button" */}
        {/*         className="-m-2.5 rounded-md p-2.5 text-gray-700" */}
        {/*         onClick={() => setMobileMenuOpen(false)} */}
        {/*       > */}
        {/*         <span className="sr-only">Close menu</span> */}
        {/*         <XMarkIcon className="h-6 w-6" aria-hidden="true" /> */}
        {/*       </button> */}
        {/*     </div> */}
        {/*     <div className="mt-6 flow-root"> */}
        {/*       <div className="-my-6 divide-y divide-gray-500/10"> */}
        {/*         <div className="space-y-2 py-6"> */}
        {/*           {navigation.map((item) => ( */}
        {/*             <a */}
        {/*               key={item.name} */}
        {/*               href={item.href} */}
        {/*               className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" */}
        {/*             > */}
        {/*               {item.name} */}
        {/*             </a> */}
        {/*           ))} */}
        {/*         </div> */}
        {/*         <div className="py-6"> */}
        {/*           <a */}
        {/*             href="#" */}
        {/*             className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" */}
        {/*           > */}
        {/*             Log in */}
        {/*           </a> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </Dialog.Panel> */}
        {/* </Dialog> */}
      </header>
      <nav className="fixed z-20 inset-x-0 top-0 px-10 shadow-neonLight align-middle flex flex-row justify-between items-center w-full h-16 bg-background">
        <Link
          href={"/"}
          className="text-2xl font-bold text-primary min-w-[200px]"
        >
          Tube Mind Sync
        </Link>
        <div className="md:hidden text-muted-foreground">
          <MobileMenu />
        </div>
        <div className="hidden md:flex flex-row gap-5 align-middle items-center justify-end w-full">
          <Link
            href={"/settings"}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Settings
          </Link>
          <Link
            href={"/settings"}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Openai Key
          </Link>

          {!isSignedIn ? (
            <Link href={"/sign-in"} className="">
              <Button variant="defaultLight">Login/Register</Button>
            </Link>
          ) : (
            <div className="flex flex-row justify-evenly items-center gap-5">
              <UserButton />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
