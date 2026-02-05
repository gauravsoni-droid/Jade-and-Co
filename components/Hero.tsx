"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero-section" className="relative w-full h-screen flex items-center justify-center overflow-hidden -mt-20">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        {/* Fallback image if video doesn't load */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans text-white leading-tight font-normal">
            DISCOVER YOUR PERFECT PROPERTY NOW
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="#properties"
              className="inline-block px-5 py-2.5 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-gray-900 transition-colors text-base"
            >
              Buy a Property
            </Link>
            <Link
              href="#sell"
              className="inline-block px-5 py-2.5 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-gray-900 transition-colors text-base"
            >
              Sell a Property
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
