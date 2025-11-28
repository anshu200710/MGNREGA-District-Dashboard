// backend/routes/msmeRoutes.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const MSME_RESOURCE_ID =
  process.env.MSME_RESOURCE_ID || "8b68ae56-84cf-4728-a0a6-1be11028dea7";
const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// helper to clean pincode like "110018.0" -> "110018"
function normalizePincode(pin) {
  if (!pin) return "";
  const s = String(pin);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

// 🔍 helper: get Google Maps details (name, phone, website) for one MSME unit
async function getGoogleDetailsForUnit(unit) {
  if (!GOOGLE_API_KEY) {
    console.warn("⚠️ GOOGLE_API_KEY not set, skipping Google lookup");
    return {
      googleName: null,
      googleAddress: null,
      googlePhone: null,
      googleIntlPhone: null,
      googleWebsite: null,
      googlePlaceId: null,
    };
  }

  const pin = normalizePincode(unit.pincode);

  // try several query variations to improve match rate
  const queries = [
    `${unit.enterpriseName} ${unit.communicationAddress} ${unit.district} ${unit.state} ${pin}`,
    `${unit.enterpriseName} ${unit.district} ${unit.state} ${pin}`,
    `${unit.enterpriseName} ${unit.district} ${unit.state}`,
  ];

  for (const q of queries) {
    try {
      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        q
      )}&key=${GOOGLE_API_KEY}`;

      console.log("🌐 Google TextSearch query:", q);

      const searchRes = await fetch(textSearchUrl);
      const searchData = await searchRes.json();

      if (!searchData.results || searchData.results.length === 0) {
        console.log("🔎 No Google result for:", q, "status:", searchData.status);
        continue; // try next query
      }

      const best = searchData.results[0];
      const placeId = best.place_id;

      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website&key=${GOOGLE_API_KEY}`;

      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();

      if (!detailsData.result) {
        console.log("⚠️ No details.result for placeId:", placeId);
        return {
          googleName: null,
          googleAddress: null,
          googlePhone: null,
          googleIntlPhone: null,
          googleWebsite: null,
          googlePlaceId: placeId || null,
        };
      }

      const r = detailsData.result;

      console.log("✅ Google match:", {
        q,
        name: r.name,
        addr: r.formatted_address,
        phone: r.formatted_phone_number,
        website: r.website,
      });

      return {
        googleName: r.name || null,
        googleAddress: r.formatted_address || null,
        googlePhone: r.formatted_phone_number || null,
        googleIntlPhone: r.international_phone_number || null,
        googleWebsite: r.website || null,
        googlePlaceId: placeId || null,
      };
    } catch (err) {
      console.error("❌ Google lookup error for query:", q, err);
      // try next query
      continue;
    }
  }

  // if all queries failed
  return {
    googleName: null,
    googleAddress: null,
    googlePhone: null,
    googleIntlPhone: null,
    googleWebsite: null,
    googlePlaceId: null,
  };
}

// POST /api/msme/search
// body: { activity, location, page }
// location must be "DISTRICT, STATE" (e.g. "AHMADABAD, GUJARAT")
router.post("/search", async (req, res) => {
  try {
    const { activity = "", location = "", page = 1 } = req.body || {};

    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: "Location must be 'DISTRICT, STATE'" });
    }

    if (!DATA_GOV_API_KEY) {
      return res
        .status(500)
        .json({ success: false, message: "DATA_GOV_API_KEY not configured" });
    }

    const [districtRaw, stateRaw] = location.split(",");
    if (!districtRaw || !stateRaw) {
      return res.status(400).json({
        success: false,
        message: "Use format 'DISTRICT, STATE' (e.g. AHMADABAD, GUJARAT)",
      });
    }

    const district = districtRaw.trim().toUpperCase();
    const state = stateRaw.trim().toUpperCase();

    console.log(
      `🔍 MSME search: state=${state}, district=${district}, activity=${activity}, page=${page}`
    );

    const limit = 1000;
    const offset = (page - 1) * limit;

    const baseUrl = `https://api.data.gov.in/resource/${MSME_RESOURCE_ID}`;
    const params = new URLSearchParams({
      "api-key": DATA_GOV_API_KEY,
      format: "json",
      limit: String(limit),
      offset: String(offset),
    });

    // required filters
    params.append("filters[State]", state);
    params.append("filters[District]", district);
    // ⚠️ don't send Activities filter, filter locally

    const url = `${baseUrl}?${params.toString()}`;
    const apiRes = await fetch(url);
    const apiData = await apiRes.json();

    const records = apiData.records || [];

    let units = records.map((r) => ({
      enterpriseName: r.EnterpriseName || "N/A",
      state: r.State || "N/A",
      district: r.District || "N/A",
      pincode: r.Pincode || "N/A",
      registrationDate: r.RegistrationDate || "N/A",
      activities: r.Activities || "N/A",
      communicationAddress: r.CommunicationAddress || "N/A",
    }));

    // local activity keyword filter (substring search in activities JSON string)
    if (activity) {
      const needle = activity.toLowerCase();
      units = units.filter(
        (u) => u.activities && u.activities.toLowerCase().includes(needle)
      );
    }

    console.log(`✅ MSME: ${units.length} rows after activity filter`);

    // 🔁 ENRICH EVERY UNIT WITH GOOGLE DATA
    const enriched = await Promise.all(
      units.map(async (u) => {
        const googleData = await getGoogleDetailsForUnit(u);
        return { ...u, ...googleData };
      })
    );

    // stats for frontend
    const stats = {
      totalGov: records.length,
      googleAttempted: units.length,
      googleMatched: enriched.filter((u) => u.googlePlaceId).length,
      phoneWithNumber: enriched.filter((u) => u.googlePhone).length,
    };

    const hasMore = units.length === limit;

    return res.json({ success: true, data: enriched, hasMore, stats });
  } catch (err) {
    console.error("❌ MSME route error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
