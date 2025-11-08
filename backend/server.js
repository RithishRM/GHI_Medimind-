import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthData.js";
import comorbidityRoutes from "./routes/comorbiditiesData.js";
// import resistanceRoutes from "./routes/resistanceData.js"; // <-- DELETE THIS LINE

const app = express();

const vercelFrontendURL = "https://YOUR_FRONTEND_APP_NAME.vercel.app"; 

const corsOptions = {
  // Allow requests from your future Vercel app and from localhost (for development)
  origin: [vercelFrontendURL, "http://localhost:3000"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/comorbidities", comorbidityRoutes);
// app.use("/api/resistance", resistanceRoutes); // <-- DELETE THIS LINE

// AFTER:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
