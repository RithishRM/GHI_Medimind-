import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-12 p-6 text-center text-gray-500">
      <p className="text-sm">
        Data sources: World Health Organization (WHO) & The World Bank Open Data.
      </p>
      <p className="text-xs mt-1">
        © {new Date().getFullYear()} MediMind GHI - All rights reserved.
      </p>
    </footer>
  );
}