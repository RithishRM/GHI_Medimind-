import express from "express";
import axios from "axios";
import NodeCache from "node-cache";

const router = express.Router();
// Cache for 1 hour, as this data is more specific
const cache = new NodeCache({ stdTTL: 3600 }); 

const WB_API_URL = "https://api.worldbank.org/v2/";

// These indicators are correct. The problem was our query.
const INDICATORS = {
  obesity: "SH.STA.OWGH.ZS",   // Overweight (BMI >= 25)
  diabetes: "SH.STA.DIAB.ZS",  // Diabetes
  hypertension: "SH.STA.HYPT.ZS", // Hypertension
};

/**
 * Fetches the most recent *non-null* value for a *specific country*.
 */
const fetchIndicator = async (indicatorCode, countryCode) => {
  try {
    // Cache key now includes the country
    const cacheKey = `wb_${countryCode}_${indicatorCode}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving ${indicatorCode} for ${countryCode} from cache`);
      return cachedData;
    }

    // Fetch 5 recent values for the specific country (e.g., 'IND' for India)
    const url = `${WB_API_URL}country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=5`;
    
    console.log(`Attempting to fetch: ${url}`);
    const response = await axios.get(url);

    // Check for a valid response
    if (!Array.isArray(response.data) || !response.data[1] || !Array.isArray(response.data[1])) {
      console.warn(`No valid data array for ${indicatorCode} in ${countryCode}.`);
      return null;
    }

    // Loop through the 5 recent values to find a non-null one
    const allRecentData = response.data[1];
    let latestValidData = null;

    for (const entry of allRecentData) {
      if (entry.value !== null) {
        latestValidData = entry; // Found a valid, non-null value
        break; // Stop looping
      }
    }

    if (latestValidData) {
      const result = {
        indicator: latestValidData.indicator.id,
        value: latestValidData.value,
        year: latestValidData.date,
        country: latestValidData.country.value, // Add country name to response
      };
      cache.set(cacheKey, result);
      return result;
    }

    console.warn(`Data for ${indicatorCode} in ${countryCode} had all null values.`);
    return null; // All 5 recent values were null

  } catch (err) {
    console.error(`Error fetching ${indicatorCode} for ${countryCode}:`, err.message || "An unknown error occurred");
    return null;
  }
};

// --- NEW ENDPOINT ---
// This now expects a country code, e.g., /api/comorbidities/IND
// We are removing the old '/' route.
router.get("/:countryCode", async (req, res) => {
  try {
    const { countryCode } = req.params;
    if (!countryCode) {
      return res.status(400).json({ message: "Country code is required." });
    }

    console.log(`Fetching comorbidity data for ${countryCode}...`);

    const requests = [
      fetchIndicator(INDICATORS.obesity, countryCode),
      fetchIndicator(INDICATORS.diabetes, countryCode),
      fetchIndicator(INDICATORS.hypertension, countryCode),
    ];
    
    const [obesity, diabetes, hypertension] = await Promise.all(requests);

    res.json({
      obesity,
      diabetes,
      hypertension,
    });
  } catch (error) {
    console.error("Error fetching comorbidity data:", error);
    res.status(500).json({ message: "Error fetching comorbidity data" });
  }
});

export default router;;