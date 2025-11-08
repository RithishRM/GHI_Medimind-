import React from 'react';
// We removed 'Link' from here because it's no longer used

export default function NavBar() {
  return (
    // Make Navbar sticky
    <nav className="bg-blue-700 text-white p-4 flex justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold">🌍 MediMind GHI</h1>
      {/* We removed the old links, since they are in the sidebar now */}
      <div>
        <span className="font-semibold">Global Health Dashboard</span>
      </div>
    </nav>
  );
}
