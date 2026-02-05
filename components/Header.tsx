"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UltravoxCallOverlay } from "./UltravoxCallOverlay";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [inboundJoinUrl, setInboundJoinUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const isPropertyPage = pathname?.startsWith("/properties/");

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        // Check if scrolled past the hero section (with 50px threshold for smoother transition)
        const scrolled = window.scrollY > heroBottom - 50;
        setIsScrolled(scrolled);
      } else {
        // If no hero section exists (like on property detail pages), default to scrolled state
        setIsScrolled(true);
        return;
      }
    };

    // Initial check
    handleScroll();

    // Add scroll event listener with throttling for better performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCallNow = async () => {
    try {
      const response = await fetch("/api/ultravox/call-now", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create Ultravox inbound call");
      }

      const data = (await response.json()) as { joinUrl?: string };

      if (!data.joinUrl) {
        throw new Error("Ultravox did not return a join URL");
      }

      // Store joinUrl and show in-page call overlay instead of opening wss:// in a new tab
      setInboundJoinUrl(data.joinUrl);
    } catch (error) {
      console.error("Error triggering Ultravox inbound call:", error);
      alert("Sorry, we couldn't start the call. Please try again in a moment.");
    }
  };

  const headerContent = isPropertyPage ? (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Company Name */}
          <Link
            href="/"
            className="text-2xl font-serif text-white hover:text-gray-200 transition-colors"
          >
            Jade & Co
          </Link>

          {/* Call Now Button */}
          <button
            onClick={handleCallNow}
            className="px-6 py-3 font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Call Now
          </button>
        </div>
      </div>
    </header>
  ) : (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Company Name */}
          <Link
            href="/"
            className={`text-2xl font-serif transition-all duration-300 ${
              isScrolled
                ? "text-gray-900 hover:text-gray-700 text-xl"
                : "text-white hover:text-gray-200"
            }`}
          >
            Jade & Co
          </Link>

          {/* Call Now Button */}
          <button
            onClick={handleCallNow}
            className={`px-6 py-3 font-medium rounded-md transition-all duration-300 shadow-sm ${
              isScrolled
                ? "bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5 text-sm"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            Call Now
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <>
      {headerContent}
      {inboundJoinUrl && (
        <UltravoxCallOverlay
          joinUrl={inboundJoinUrl}
          onClose={() => setInboundJoinUrl(null)}
        />
      )}
    </>
  );
}
