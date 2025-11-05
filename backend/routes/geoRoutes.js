// backend/routes/geoRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/geo?lat=xx&lon=yy
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  try {
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon,
        format: "json",
        addressdetails: 1,
      },
    });

    const address = geoRes.data.address || {};
    const state =
      address.state ||
      address.region ||
      address["state_district"] ||
      address.county ||
      address.city ||
      address.town ||
      address.village ||
      "";

    const district =
      address.county ||
      address.state_district ||
      address.city_district ||
      address.suburb ||
      address.town ||
      address.city ||
      "";

    let finalState = state;
    if (!finalState && district && /delhi/i.test(district)) {
      finalState = "Delhi";
    }

    if (!finalState) {
      console.warn("⚠️ Could not determine state for:", lat, lon, address);
      // Fallback to a default
      return res.json({
        state: "DELHI",
        district: district || "DELHI",
        lat,
        lon,
        note: "⚠️ Defaulted to DELHI due to missing state info",
      });
    }

    res.json({
      state: finalState.toUpperCase(),
      district: (district || "").toUpperCase(),
      lat,
      lon,
    });
  } catch (err) {
    console.error("Geo lookup failed:", err.message);
    res.status(500).json({ message: "Failed to get location" });
  }
});


export default router;
