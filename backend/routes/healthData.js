import express from "express";
import axios from "axios"; // Use axios instead of rss-parser
import NodeCache from "node-cache";

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // cache for 1 hour

// NEW: The official WHO REST API endpoint for Disease Outbreak News
const WHO_API_URL = "https://www.who.int/api/emergencies/diseaseoutbreaknews";

router.get("/", async (req, res) => {
  try {
    const cachedData = cache.get("outbreaks");
    if (cachedData) {
      console.log("Serving outbreaks from cache");
      return res.json(cachedData);
    }

    console.log("Fetching new outbreaks from WHO API");
    
    // NEW: Use axios to fetch from the API
    // The '$orderby=PublicationDate desc' part sorts the news to get the newest first
    // The '$top=20' part limits it to the 20 most recent articles
    const response = await axios.get(`${WHO_API_URL}?$orderby=PublicationDate desc&$top=20`);

    // NEW: Map the JSON response to our simple format
    // The data is in a "value" array in the response
    const data = response.data.value.map((item) => ({
      title: item.Title,
      link: item.ItemDefaultUrl, // This is the new field for the URL
      published: item.PublicationDate,
      summary: item.Summary.replace(/<[^>]*>?/gm, ''), // Clean up HTML
    }));

    cache.set("outbreaks", data);
    res.json(data);

  } catch (error) {
    console.error("Error fetching outbreak data:", error.message);
    res.status(500).json({ message: "Error fetching outbreak data" });
  }
});

export default router;