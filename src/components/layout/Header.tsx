import { Navigation } from "./Navigation";
import { getBaseUrl } from "../../lib/utils";

export function Header() {
  const baseUrl = getBaseUrl();
  
  return (
    <header 
      className="sticky top-0 z-50 bg-cover"
      style={{ backgroundImage: `url(${baseUrl}images/header-bg.jpg)` }}
    >
      <div className="relative bg-linear-45 from-white lg:from-38% md:from-45% via-green-600 lg:via-32% md:via-25% to-transparent lg:to-30%">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
