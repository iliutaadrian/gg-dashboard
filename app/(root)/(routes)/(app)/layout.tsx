"use client";
import { MenuList } from "@/components/menu/menu-list";
import { Navbar } from "@/components/menu/navbar";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className={" pt-20 h-full flex flex-col items-center"}>
        <div className={" h-full"}>{children}</div>
      </div>
    </div>
  );
}
