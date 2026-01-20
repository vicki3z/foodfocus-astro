import { Navigation } from "./Navigation";
import { Tag } from "../ui/Tag";
import { getBaseUrl } from "../../lib/utils";

interface Magazine {
  title: string;
  date: string;
  image: string;
  imageAlt?: string;
  link: string;
  magazineNo: string;
}

interface Props {
  magazine?: Magazine;
}

export function HeroHeader({ magazine }: Props) {
  const baseUrl = getBaseUrl();
  
  return (
    <header 
      className="relative overflow-hidden bg-cover"
      style={{ backgroundImage: `url(${baseUrl}images/header-bg.jpg)` }}
    >
      {/* Navigation Bar - Transparent */}
      <div className="relative bg-linear-45 from-white lg:from-38% md:from-45% via-green-600 lg:via-32% md:via-25% to-transparent lg:to-30%">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>

      {/* Hero Section - Transparent, shares background with nav */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-44 py-12">
          <div className="flex gap-8 lg:gap-16">
            {/* Left: Magazine Cover */}
            <div>
              {magazine ? (
                <a
                  href={magazine.link}
                  className="group relative block max-w-xs shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={magazine.image}
                    alt={magazine.imageAlt || magazine.title}
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      {new Date(magazine.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="w-full max-w-xs aspect-[3/4] bg-white/10 rounded-lg animate-pulse" />
              )}
            </div>

            {/* Right: Content */}
            <div className="flex flex-col gap-6 text-white text-center lg:text-left">
              <div>
                <Tag variant="primary" size="sm">
                  Latest Issue
                </Tag>
              </div>

              <div className="flex flex-col gap-2 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  Food Focus Thailand
                </h1>
                <p className="text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                  The No. 1 industry-focused magazine for food & beverage
                  professionals
                </p>
              </div>

              {/* Email Subscription Form */}
              <form
                action="https://www.foodfocusthailand.com/email.php"
                method="POST"
                className="relative"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="py-4 pl-4 pr-28 rounded-lg text-[#2d3319] placeholder:text-gray-400 bg-white focus:outline-none min-w-96"
                />
                <button
                  type="submit"
                  className="absolute cursor-pointer px-4 py-2 top-2 right-36  bg-[#3A5F47] hover:bg-[#3A5F47] text-white font-medium rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
