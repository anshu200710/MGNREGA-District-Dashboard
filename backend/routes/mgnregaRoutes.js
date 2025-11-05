import express from "express";
import DistrictData from "../models/DistrictData.js";
import { normalizeState, normalizeDistrict } from "../utils/normalize.js";
import { fetchAndStoreMGNREGAData } from "../utils/fetchMGNREGA.js";

const router = express.Router();

/**
 * GET /api/mgnrega?state=DELHI&district=SHAHDARA
 * Fetch MGNREGA data (from DB cache or API)
 */
router.get("/", async (req, res) => {
  try {
    let { state, district } = req.query;

    // Use the requested values initially
    let current_state = state;
    let current_district = district;

    // 1. Handle initial fallback if no query params provided
    if (!current_state) {
      current_state = "UTTAR PRADESH";
      current_district = "VARANASI";
      console.log("🌍 Defaulting to:", { state: current_state, district: current_district });
    }

    console.log("📍 Request for:", { state: current_state, district: current_district });

    let normalizedState = normalizeState(current_state);
    let normalizedDistrict = normalizeDistrict(current_district);

    let records = [];

    // 2. Try DB first (for the requested location)
    records = await DistrictData.find({
      state_name: normalizedState,
      ...(normalizedDistrict ? { district_name: normalizedDistrict } : {}),
    });

    // 3. If no cached data, fetch fresh data
    if (!records.length) {
      console.log("🌀 No cached data found, attempting to fetch from API...");

      const apiRecords = await fetchAndStoreMGNREGAData(normalizedState, normalizedDistrict);

      // 4. CRITICAL CHECK: If API returned 0 records (e.g., Delhi, urban areas)
      if (apiRecords.length === 0) {
        console.warn(`⚠️ API returned 0 records for ${normalizedState}/${normalizedDistrict}. Falling back to a working location.`);

        // --- Switch to a KNOWN-GOOD default location ---
        current_state = "UTTAR PRADESH";
        current_district = "GHAZIABAD"; // Using Ghaziabad as it worked in your test
        normalizedState = normalizeState(current_state);
        normalizedDistrict = normalizeDistrict(current_district);

        // Fetch/Cache the fallback data (This ensures the fallback data is always available)
        records = await DistrictData.find({
          state_name: normalizedState,
          ...(normalizedDistrict ? { district_name: normalizedDistrict } : {}),
        });

        if (!records.length) {
          console.log("🌀 Fallback data not cached, fetching UTTAR PRADESH/GHAZIABAD...");
          await fetchAndStoreMGNREGAData(normalizedState, normalizedDistrict);
        }

      } else {
        // Data was fetched and cached by fetchAndStoreMGNREGAData. 
        // We update the records variable to include the newly fetched data.
        records = apiRecords;
      }
    }

    // 5. Final fetch from DB (for a clean response object, using the FINAL location)
    const finalRecords = await DistrictData.find({
      state_name: normalizedState,
      ...(normalizedDistrict ? { district_name: normalizedDistrict } : {}),
    });

    res.status(200).json({
      success: true,
      count: finalRecords.length,
      location: { state: normalizedState, district: normalizedDistrict }, // Return the actual location the data is for
      records: finalRecords,
    });
  } catch (err) {
    console.error("❌ Error in /api/mgnrega:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;