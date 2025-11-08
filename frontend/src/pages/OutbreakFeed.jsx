import { useEffect, useState } from "react";
import OutbreakCard from "../components/OutbreakCard";

export default function OutbreakFeed() {
  const [outbreaks, setOutbreaks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use the environment variable for the API URL
    fetch(`${process.env.REACT_APP_API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOutbreaks(data);
        } else {
          throw new Error("Invalid data format received from server.");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching outbreak data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 mt-10 text-xl">
        Loading latest outbreak news...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 mt-10">
        <h1 className="text-2xl font-bold">Failed to load data</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Real-Time Disease Outbreaks</h1>
      <p className="text-lg text-gray-600 mb-6">
        Source: World Health Organization (WHO)
      </p>

      <div className="space-y-6">
        {outbreaks.map((item, idx) => (
          <OutbreakCard
            key={item.link || idx}
            outbreak={item}
          />
        ))}
      </div>
    </div>
  );
}