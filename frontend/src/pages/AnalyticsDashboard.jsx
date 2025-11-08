import { useEffect, useState } from "react";
import { COUNTRIES } from "../data/countries";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const fetchCountryData = async (countryCode) => {
  try {
    // Use the environment variable for the API URL
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/comorbidities/${countryCode}`);
    if (!res.ok) throw new Error(`Failed for ${countryCode}`);
    const data = await res.json();
    return {
      code: countryCode,
      name: COUNTRIES.find(c => c.code === countryCode)?.name || countryCode,
      diabetes: data.diabetes?.value || 0,
      obesity: data.obesity?.value || 0,
      hypertension: data.hypertension?.value || 0,
    };
  } catch (err) {
    console.error(err);
    return null; 
  }
};

const KpiCard = ({ title, value, unit, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}<span className="text-lg">{unit}</span></p>
  </div>
);

export default function AnalyticsDashboard() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      const promises = COUNTRIES.map(country => fetchCountryData(country.code));
      const results = await Promise.all(promises);
      const validData = results.filter(data => data !== null);
      
      if (validData.length === 0) {
        setError("Failed to load any country data.");
      } else {
        const topDiabetes = [...validData].sort((a, b) => b.diabetes - a.diabetes)[0];
        const topObesity = [...validData].sort((a, b) => b.obesity - a.obesity)[0];
        const topHypertension = [...validData].sort((a, b) => b.hypertension - a.hypertension)[0];
        setKpi({ topDiabetes, topObesity, topHypertension });
      }
      
      setChartData(validData);
      setIsLoading(false);
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500 mt-10 text-xl">Loading analytics...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600 mt-10">...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Comparative Risk Analytics</h1>
      <p className="text-lg text-gray-600 mb-6">Source: The World Bank Open Data</p>

      {kpi && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            title={`Highest Diabetes Risk: ${kpi.topDiabetes.name}`}
            value={kpi.topDiabetes.diabetes.toFixed(1)}
            unit="%"
            color="text-blue-600"
          />
          <KpiCard 
            title={`Highest Overweight Risk: ${kpi.topObesity.name}`}
            value={kpi.topObesity.obesity.toFixed(1)}
            unit="%"
            color="text-orange-600"
          />
          <KpiCard 
            title={`Highest Hypertension Risk: ${kpi.topHypertension.name}`}
            value={kpi.topHypertension.hypertension.toFixed(1)}
            unit="%"
            color="text-red-600"
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Comorbidity Prevalence by Country (%)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="diabetes" fill="#3b82f6" />
            <Bar dataKey="obesity" fill="#f59e0b" />
            <Bar dataKey="hypertension" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}