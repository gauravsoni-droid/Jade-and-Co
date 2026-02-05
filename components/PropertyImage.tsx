"use client";

import Image from "next/image";
import { useState } from "react";

interface PropertyImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
}

export default function PropertyImage({ src, fallbackSrc, alt }: PropertyImageProps) {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  // Use unoptimized for external images to avoid optimization issues
  const isExternalImage = imageSrc?.includes("unsplash.com") || imageSrc?.includes("http");

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover"
      priority
      unoptimized={isExternalImage}
      onError={handleError}
      sizes="100vw"
    />
  );
}
