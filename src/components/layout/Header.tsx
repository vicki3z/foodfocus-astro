import { Navigation } from "./Navigation";
import { useState } from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[url(/images/header-bg.jpg)] bg-cover">
      <div className="relative bg-linear-45 from-white lg:from-38% md:from-45% via-green-600 lg:via-32% md:via-25% to-transparent lg:to-30%">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
