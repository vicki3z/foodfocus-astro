import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      const res = await fetch("https://www.foodfocusthailand.com/email.php", {
        method: "POST",
        body: formData.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

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
          <div className="flex flex-col items-center lg:flex-row lg:items-start gap-8 lg:gap-16">
            {/* Left: Magazine Cover */}
            <div className="flex-shrink-0">
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
            <div className="flex flex-col gap-6 text-white text-center lg:text-left w-full lg:w-auto">
              <div>
                <Tag variant="primary" size="sm">
                  Latest Issue
                </Tag>
              </div>

              <div className="flex flex-col gap-2 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  Food Focus Thailand
                </h1>
                <p className="text-lg mb-8">
                  The No. 1 industry-focused magazine for food & beverage
                  professionals
                </p>
              </div>

              {/* Email Subscription Form */}
              {status === "success" ? (
                <p className="text-white/90 bg-white/10 rounded-lg px-4 py-3 max-w-md mx-auto lg:mx-0">
                  Thanks for subscribing!
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 max-w-md mx-auto lg:mx-0"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="flex-1 px-4 py-3 rounded-lg text-[#2d3319] placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="px-6 py-3 bg-[#3A5F47] hover:bg-[#2d4a38] disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
                    >
                      {status === "loading" ? "Subscribing…" : "Subscribe"}
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-red-300 text-sm">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
