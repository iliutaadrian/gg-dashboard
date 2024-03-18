"use client";
import { Footer } from "@/components/dashboard/footer";
import { Navbar } from "@/components/menu/navbar";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col justify-between">
      <Navbar />
      <div className={" pt-28 flex flex-col items-center"}>
        <div className={" h-full"}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
