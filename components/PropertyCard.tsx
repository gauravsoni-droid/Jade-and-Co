"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type React from "react";
import { Property } from "@/data/properties";
import { UltravoxCallOverlay } from "./UltravoxCallOverlay";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [callState, setCallState] = useState<{
    joinUrl: string;
    listingId: string;
    listingName: string;
  } | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleGetCall = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch("/api/ultravox/get-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: property.id,
          listingName: property.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Ultravox outbound call");
      }

      const data = (await response.json()) as { joinUrl?: string };

      if (!data.joinUrl) {
        throw new Error("Ultravox did not return a join URL");
      }

      setCallState({
        joinUrl: data.joinUrl,
        listingId: property.id,
        listingName: property.name,
      });
    } catch (error) {
      console.error("Error triggering Ultravox outbound call:", error);
      alert("Sorry, we couldn't start the call. Please try again in a moment.");
    }
  };

  // Fallback placeholder image
  const placeholderImage = `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=80`;
  const imageSrc = imageError ? placeholderImage : property.image;

  return (
    <>
      <Link href={`/properties/${property.slug}`} className="block group">
        <motion.div
          className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image Container */}
          <div className="relative h-64 w-full overflow-hidden bg-gray-200">
            <Image
              src={imageSrc}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                setImageError(true);
              }}
            />
            
            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="text-center px-6 space-y-4">
                <p className="text-white text-lg font-medium">
                  Interested in this property?
                  <br />
                  Let our agent give you a call
                </p>
                <button
                  onClick={handleGetCall}
                  className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Get a Call
                </button>
              </div>
            </motion.div>
          </div>

          {/* Property Info */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.name}</h3>
            <p className="text-gray-600 mb-3">{property.location}</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</p>
          </div>
        </motion.div>
      </Link>

      {callState && (
        <UltravoxCallOverlay
          joinUrl={callState.joinUrl}
          listingId={callState.listingId}
          listingName={callState.listingName}
          onClose={() => setCallState(null)}
        />
      )}
    </>
  );
}
