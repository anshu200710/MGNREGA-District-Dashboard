// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mgnregaRoutes from "./routes/mgnregaRoutes.js";
import geoRoutes from "./routes/geoRoutes.js";
import { startScheduler } from "./cron/scheduler.js";
import msmeRoutes from "./routes/msmeRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/mgnrega", mgnregaRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/msme", msmeRoutes);


app.get("/", (req, res) => {
  res.send("🌾 MGNREGA API is running...");
});

// Start scheduler
startScheduler();

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
