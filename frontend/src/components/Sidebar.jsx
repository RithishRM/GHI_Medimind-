import { Link, useLocation } from "react-router-dom";
// Import the icons
import { 
  BsGrid1X2Fill, 
  BsGlobeAmericas, 
  BsBarChartLineFill 
} from "react-icons/bs";

// Helper to conditionally apply styles
const getLinkClass = (path, currentPath) => {
  return path === currentPath
    ? "bg-blue-100 text-blue-700 font-semibold" // Active link
    : "text-gray-600 hover:bg-gray-100"; // Inactive link
};

export default function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="w-64 bg-white shadow-md p-4 h-screen sticky top-0">
      <ul className="space-y-2 mt-4">
        {/* 1. New Dashboard Link */}
        <li>
          <Link 
            to="/" 
            className={`flex items-center gap-3 py-2 px-3 rounded ${getLinkClass("/", location.pathname)}`}
          >
            <BsGrid1X2Fill />
            Dashboard
          </Link>
        </li>
        
        {/* 2. Real-Time Outbreaks (new path) */}
        <li>
          <Link 
            to="/outbreaks" 
            className={`flex items-center gap-3 py-2 px-3 rounded ${getLinkClass("/outbreaks", location.pathname)}`}
          >
            <BsGlobeAmericas />
            Real-Time Outbreaks
          </Link>
        </li>
        
        {/* 3. Risk Analytics */}
        <li>
          <Link 
            to="/analytics" 
            className={`flex items-center gap-3 py-2 px-3 rounded ${getLinkClass("/analytics", location.pathname)}`}
          >
            <BsBarChartLineFill />
            Risk Analytics
          </Link>
        </li>
      </ul>
    </aside>
  );
}
