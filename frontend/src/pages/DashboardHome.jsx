import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COUNTRIES } from "../data/countries";
import OutbreakCard from "../components/OutbreakCard"; 

const fetchCountryData = async (countryCode) => {
  // Use the environment variable for the API URL
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/comorbidities/${countryCode}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    name: COUNTRIES.find(c => c.code === countryCode)?.name || countryCode,
    diabetes: data.diabetes?.value || 0,
    obesity: data.obesity?.value || 0,
  };
};

export default function DashboardHome() {
  const [outbreaks, setOutbreaks] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use the environment variable for the API URL
        const outbreakRes = await fetch(`${process.env.REACT_APP_API_URL}/api/health`);
        const allOutbreaks = await outbreakRes.json();
        if (Array.isArray(allOutbreaks)) {
          setOutbreaks(allOutbreaks.slice(0, 3)); 
        }

        const promises = COUNTRIES.map(country => fetchCountryData(country.code));
        const results = await Promise.all(promises);
        setRiskData(results.filter(data => data !== null));

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const topDiabetes = [...riskData].sort((a, b) => b.diabetes - a.diabetes)[0];
  const topObesity = [...riskData].sort((a, b) => b.obesity - a.obesity)[0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Global Intelligence Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Latest Outbreaks</h2>
            <Link to="/outbreaks" className="text-blue-600 hover:underline">View All</Link>
          </div>
          {isLoading ? (
            <p>Loading outbreaks...</p>
          ) : (
            outbreaks.map(item => (
              <OutbreakCard key={item.link} outbreak={item} />
            ))
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold">High-Risk Regions</h2>
          
          {topDiabetes && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Highest Diabetes Risk</h3>
              <p className="text-3xl font-bold text-blue-600">{topDiabetes.name}</p>
              <p className="text-lg text-gray-700">{topDiabetes.diabetes.toFixed(1)}% Prevalence</p>
            </div>
          )}

          {topObesity && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-sm font-medium text-gray-500">Highest Overweight Risk</h3>
              <p className="text-3xl font-bold text-orange-600">{topObesity.name}</p>
              <p className="text-lg text-gray-700">{topObesity.obesity.toFixed(1)}% Prevalence</p>
            </div>
          )}
          
          <Link to="/analytics" className="block w-full text-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            View Full Analytics Report
          </Link>
        </div>
      </div>
    </div>
  );
}