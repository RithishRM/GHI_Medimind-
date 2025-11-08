// src/components/NavBar.jsx
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    // Make Navbar sticky
    <nav className="bg-blue-700 text-white p-4 flex justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold">🌍 MediMind GHI</h1>
      {/* Remove the old links, since they are in the sidebar now */}
      {/* You can add user profile, settings, etc. here */}
      <div>
        <span className="font-semibold">Global Health Dashboard</span>
      </div>
    </nav>
  );
}

// src/pages/Patients.jsx
// I recommend renaming this file to `CountryList.jsx`
// ... (add a search bar for extra polish!)
// ...
