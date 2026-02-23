import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/tropiLogo004.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "560px auto",
          opacity: 0.05,
          filter: "grayscale(100%)",
        }}
      />

      <div className="relative z-10">
        <SiteHeader />

        {/* 👇 offset for fixed header (h-20 = 80px) */}
        <main className="pt-20">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
