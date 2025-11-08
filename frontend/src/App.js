import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer"; // <-- IMPORT FOOTER
import DashboardHome from "./pages/DashboardHome"; // <-- IMPORT NEW HOME
import OutbreakFeed from "./pages/OutbreakFeed";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.jsx"; 

export default function App() {
  return (
    <>
      <NavBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-100 min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<DashboardHome />} /> {/* <-- NEW HOME */}
            <Route path="/outbreaks" element={<OutbreakFeed />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
          
          <Footer /> {/* <-- ADD FOOTER */}
        </main>
      </div>
    </>
  );
}
