"use client";

export const Footer = () => {
  return (
    <div className="flex border-t-2 my-20 border-muted-foreground justify-center">
      <div className="md:max-w-5xl text-sm w-full flex flex-col items-center md:flex-row md:items-start gap-5 py-10 px-5">
        <div className="flex flex-col md:w-1/3 md:text-left w-full text-center">
          <h1 className="text-3xl text-primary">Tube Mind Sync</h1>
          <h1>© 2023. All rights reserved.</h1>
        </div>
        <div className="flex flex-col md:w-1/4 md:text-left w-full text-center">
          <h1 className="text-xl text-muted-foreground">Links</h1>
          <a href="/">Pricing</a>
          <a href="/">Licenses</a>
          <a href="/">Affiliates</a>
        </div>
        <div className="flex flex-col md:w-1/4 md:text-left w-full text-center">
          <h1 className="text-xl text-muted-foreground">Legal</h1>
          <a href="/">Terms of Service</a>
          <a href="/">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};
