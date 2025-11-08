import { useEffect, useState } from "react";
import { COUNTRIES } from "../data/countries";

/**
 * A helper function to parse the country name from an outbreak title.
 */
function getCountryFromTitle(title) {
  const parts = title.split(/–|in/);
  const potentialCountry = parts.length > 1 ? parts[parts.length - 1].trim() : null;

  if (potentialCountry) {
    const found = COUNTRIES.find(c => potentialCountry.includes(c.name));
    return found; 
  }
  return null;
}

/**
 * A sub-component to display the intelligence briefing.
 */
const IntelligenceBriefing = ({ comorbidity, countryName }) => {
  // ... (JSX is the same as before) ...
  const highRiskComorbidity = comorbidity.diabetes?.value > 10 
    ? "high diabetes prevalence" 
    : comorbidity.obesity?.value > 50 ? "high overweight prevalence" : null;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
      <h4 className="text-md font-bold text-gray-800">
        Comorbidity Risk for {countryName}
      </h4>
      <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
        
        {comorbidity.diabetes && (
          <li>
            Region has a **{comorbidity.diabetes.value.toFixed(1)}%** diabetes prevalence
            (Year: {comorbidity.diabetes.year}).
          </li>
        )}
        {comorbidity.obesity && (
          <li>
            Region has a **{comorbidity.obesity.value.toFixed(1)}%** overweight prevalence
            (Year: {comorbidity.obesity.year}).
          </li>
        )}
        {comorbidity.hypertension && (
          <li>
            Region has a **{comorbidity.hypertension.value.toFixed(1)}%** hypertension prevalence
            (Year: {comorbidity.hypertension.year}).
          </li>
        )}

        {highRiskComorbidity && (
          <li className="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            **Alert:** This outbreak is in a population with {highRiskComorbidity}.
          </li>
        )}
      </ul>
    </div>
  );
};


export default function OutbreakCard({ outbreak }) {
  const { title, link, published, summary } = outbreak;
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState(null); 

  useEffect(() => {
    const fetchIntelligence = async () => {
      const country = getCountryFromTitle(title);
      
      if (country) {
        setIsLoading(true);
        setContext(null);
        try {
          // Use the environment variable for the API URL
          const comorbidityRes = await fetch(`${process.env.REACT_APP_API_URL}/api/comorbidities/${country.code}`);

          if (!comorbidityRes.ok) {
            throw new Error('Failed to fetch intelligence data');
          }

          const comorbidityData = await comorbidityRes.json();

          setContext({
            comorbidity: comorbidityData,
            countryName: country.name
          });

        } catch (err) {
          console.error(`Failed to fetch context for ${country.name}:`, err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchIntelligence();
  }, [title]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-red-600">
      <h2 className="text-xl font-bold text-blue-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-3">
        Published: {new Date(published).toLocaleDateString("en-US", { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })}
      </p>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline mt-2 inline-block"
      >
        Read Full Report...
      </a>
      
      {isLoading && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 animate-pulse">
          Loading regional comorbidity data...
        </div>
      )}

      {context && (
        <IntelligenceBriefing 
          comorbidity={context.comorbidity} 
          countryName={context.countryName}
        />
      )}
    </div>
  );
}