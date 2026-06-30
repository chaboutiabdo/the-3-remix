import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  blurDataUrl?: string;
  aspectClassName?: string;
}

/**
 * Progressive / blur-up image with native lazy loading and async decoding.
 * Falls back to a shimmer skeleton until the image fully loads.
 */
export function LazyImage({
  className,
  blurDataUrl,
  aspectClassName,
  alt = "",
  loading = "lazy",
  decoding = "async",
  onLoad,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden", aspectClassName)}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-accent/40 to-muted"
          style={
            blurDataUrl
              ? {
                  backgroundImage: `url(${blurDataUrl})`,
                  backgroundSize: "cover",
                  filter: "blur(20px)",
                }
              : undefined
          }
        />
      )}
      <img
        {...props}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
}
