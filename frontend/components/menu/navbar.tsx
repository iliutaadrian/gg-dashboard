"use client";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
import { Grid, X, Home, FileText, Moon } from "lucide-react";

export const Navbar = () => {
  const navigation = [
    { name: "GG Docs", title: "GG Docs", href: "/", icon: Home },
    { name: "GG Tests", title: "GG Tests", href: "/tests", icon: FileText }
  ];
  
  const pathname = usePathname();
  const [userLoaded, setUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Simulate user load on initial render
  useEffect(() => {
    setUserLoaded(true);
  }, []);
  
  // Function to handle navigation with page reload
  const handleNavigation = (href: string) => {
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
    <nav className="fixed z-20 inset-x-0 top-0 w-full h-16 bg-background shadow-sm backdrop-blur supports-backdrop-blur:bg-background/60">
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
        
        {/* Right side controls: menu button and user */}
        <div className="flex items-center space-x-4">
          {/* Grid menu button (9 dots) */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Grid size={20} />}
          </button>
          
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
        
        {/* Menu dropdown */}
        {menuOpen && (
          <div className="absolute top-16 right-0 w-64 bg-background rounded-md shadow-lg border border-border z-30">
            <div className="p-4 space-y-4">
              {/* Navigation links in menu */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Navigation</h3>
                {navigation.map((item) => {
                  const isActive = 
                    (item.href === "/" && pathname === "/") || 
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                    
                  return (
                    <a
                      key={item.name}
                      href="#"
                      onClick={() => {
                        setMenuOpen(false);
                        handleNavigation(item.href);
                      }}
                      className={`
                        flex items-center py-2 px-3 text-sm transition-colors rounded-md
                        ${isActive 
                          ? 'text-primary bg-primary/10' 
                          : 'text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon size={16} className="mr-2" />
                      {item.title}
                    </a>
                  );
                })}
              </div>
              
              {/* Theme toggle in menu */}
              <div className="pt-2 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Appearance</h3>
                <div className="flex items-center justify-between py-2 px-3">
                  <div className="flex items-center">
                    <Moon size={16} className="mr-2" />
                    <span className="text-sm">Theme</span>
                  </div>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
