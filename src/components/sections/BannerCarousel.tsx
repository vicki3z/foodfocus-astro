import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import {
  fetchBannersByPosition,
  type Banner,
  type BannerPosition,
} from "../../lib/banner-client";

interface BannerCarouselProps {
  /**
   * Banners are fetched live from WordPress so scheduled banners appear
   * without a rebuild.
   */
  graphqlUrl: string;
  position: BannerPosition;
  autoplayDelay?: number;
  className?: string;
}

export function BannerCarousel({
  graphqlUrl,
  position,
  autoplayDelay = 5000,
  className = "",
}: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [banners, setBanners] = useState<Banner[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBannersByPosition(graphqlUrl, position)
      .then((fetchedBanners) => {
        if (!cancelled) setBanners(fetchedBanners);
      })
      .catch(() => {
        if (!cancelled) setBanners([]);
      });

    return () => {
      cancelled = true;
    };
  }, [graphqlUrl, position]);

  const isLoading = banners === null;
  const count = banners?.length ?? 0;

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Slides may arrive asynchronously (runtime fetch), so re-initialize embla
  // whenever the resolved banner list changes to make sure it measures the
  // slides that now exist in the DOM.
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, banners]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || count <= 1) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [emblaApi, autoplayDelay, count]);

  // Reserve height while loading to avoid layout shift, then collapse to
  // nothing if there are no banners.
  if (isLoading) {
    return (
      <div className={`relative ${className}`} aria-hidden="true">
        <div className="overflow-hidden rounded-lg">
          <div className="w-full max-w-285 aspect-[1140/200] bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              {banner.link ? (
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={banner.image}
                    alt={banner.imageAlt || banner.title}
                    className="w-full h-auto max-w-285"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </a>
              ) : (
                <img
                  src={banner.image}
                  alt={banner.imageAlt || banner.title}
                  className="w-full h-auto max-w-285"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === selectedIndex
                  ? "bg-[var(--color-primary)]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
