"use client";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
import { MobileMenu } from "./mobile-menu";

export const Navbar = () => {
  const navigation = [
    { name: "GG Docs", title: "GG Docs", href: "/" },
    { name: "GG Tests", title: "GG Tests", href: "/tests" }
  ];
  
  const pathname = usePathname();
  const [userLoaded, setUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate user load on initial render
  useEffect(() => {
    setUserLoaded(true);
  }, []);
  
  // Function to handle navigation with page reload
  const handleNavigation = (href) => {
    if (href === pathname) return false;
    
    // Set loading state
    setIsLoading(true);
    
    // Short delay to ensure the loading state is visible
    setTimeout(() => {
      // Force a full page reload
      window.location.href = href;
    }, 100);
    
    return false;
  };
  
  return (
    <nav className="fixed z-20 inset-x-0 top-0 w-full h-16 bg-background border-b border-muted-foreground shadow-sm backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
        {/* Loading overlay with blur and spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-30">
            {/* Spinner */}
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}
        
        <a 
          href="#"
          onClick={() => handleNavigation("/")}
          className="flex items-center font-bold text-lg text-primary transition-colors"
        >
          gg <span className="text-foreground ml-1">dashboard</span>
        </a>
        
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const isActive = 
              (item.href === "/" && pathname === "/") || 
              (item.href !== "/" && pathname.startsWith(item.href));
              
            return (
              <a
                key={item.name}
                href="#"
                onClick={() => handleNavigation(item.href)}
                className={`
                  relative py-2 px-1 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {item.title}
              </a>
            );
          })}
        </div>
        
        <div className="md:hidden">
          <MobileMenu navigation={navigation} />
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          <div className="h-6 w-px bg-border" />
          
          {/* User button with placeholder */}
          <div className="relative h-8 w-8">
            {/* Placeholder circle that always shows */}
            <div className="absolute inset-0 rounded-full bg-muted animate-pulse" />
            
            {/* Actual UserButton - will load on top of placeholder */}
            <div className={userLoaded ? "opacity-100" : "opacity-0"}>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
