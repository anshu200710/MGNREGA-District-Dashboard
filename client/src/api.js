import axios from "axios";

// ✅ Use the root URL (no /api here)
const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Get current user's geo location (lat, lon, state, district)
 */
export const fetchGeoLocation = async () => {
  try {
    // Try to get coordinates from the browser
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const { latitude, longitude } = position.coords;

    // ✅ Only one "/api" in the final URL
    const res = await axios.get(`${API_BASE}/api/geo`, {
      params: { lat: latitude, lon: longitude },
      timeout: 10000,
    });

    console.log("📍 Detected location:", res.data);
    return res.data; // { state, district, lat, lon }
  } catch (err) {
    console.warn("⚠️ Geolocation denied or failed:", err.message);

    // Fallback to default location (Varanasi)
    const defaultLat = 25.3176;
    const defaultLon = 82.9739;

    const res = await axios.get(`${API_BASE}/api/geo`, {
      params: { lat: defaultLat, lon: defaultLon },
    });
    return res.data;
  }
};

/**
 * Fetch MGNREGA data from backend (normalized and cached by backend)
 */
export const fetchMGNREGAData = async (filters = {}) => {
  try {
    console.log("🔍 Fetching MGNREGA with filters:", filters);

    // ✅ Only one "/api" in the URL
    const res = await axios.get(`${API_BASE}/api/mgnrega`, {
      params: filters,
      timeout: 20000,
    });

    console.log(
      `✅ MGNREGA API response: ${res.status} (${res.data?.count || 0} records)`
    );
    return res.data;
  } catch (err) {
    console.error(
      "❌ MGNREGA API error:",
      err.response?.data || err.message || err
    );
    return { success: false, count: 0, data: [] };
  }
};
