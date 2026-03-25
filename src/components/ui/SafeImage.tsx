"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { PLACEHOLDERS } from "@/utils/placeholders";

export function SafeImage({
  src,
  alt,
  fallbackSrc,
  ...props
}: Omit<ImageProps, "onError"> & { fallbackSrc?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc || PLACEHOLDERS.fallback)}
    />
  );
}
