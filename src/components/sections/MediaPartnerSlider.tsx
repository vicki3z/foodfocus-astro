import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

interface MediaPartner {
  title: string;
  logo: string;
  logoAlt?: string;
  link?: string;
}

interface MediaPartnerSliderProps {
  partners: MediaPartner[];
  autoplayDelay?: number;
  className?: string;
}

export function MediaPartnerSlider({
  partners,
  autoplayDelay = 3000,
  className = "",
}: MediaPartnerSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: "start",
  });

  // Autoplay
  useEffect(() => {
    if (!emblaApi || partners.length <= 6) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [emblaApi, autoplayDelay, partners.length]);

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <div className={`relative px-16 ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-24">
          {partners.map((partner, index) => (
            <div key={index} className="flex-[0_0_auto] max-w-[100px]">
              {partner.link ? (
                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <img
                    src={partner.logo}
                    alt={partner.logoAlt || partner.title}
                    className="w-full h-auto object-contain max-w-[100px]"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.logoAlt || partner.title}
                  className="w-full h-auto object-contain max-w-[100px]"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
