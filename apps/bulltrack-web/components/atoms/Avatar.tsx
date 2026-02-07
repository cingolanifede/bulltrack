"use client";

import Image from "next/image";
import { useState } from "react";

type AvatarProps = {
  size?: number;
  showBadge?: boolean;
  className?: string;
  src?: string | null;
};

export function Avatar({
  size = 56,
  showBadge = true,
  className = "",
  src: propSrc,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackSrc = "/icons/avatar.png";
  const imageSrc = propSrc && !imageError ? propSrc : fallbackSrc;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="overflow-hidden rounded-full bg-avatar-bg"
        style={{ width: size, height: size }}
      >
        <Image
          src={imageSrc}
          alt="User avatar"
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      {showBadge && (
        <div
          className="absolute bottom-0 right-0 rounded-full border-[2.5px] border-white bg-primary"
          style={{ width: 16, height: 16 }}
        />
      )}
    </div>
  );
}
