import axios from "axios";
import DistrictData from "../models/DistrictData.js";

const API_KEY = process.env.DATA_GOV_API_KEY || "579b464db66ec23bdd000001228af32c5e13417751c484e9fbd6a924";
const API_URL = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const defaultFinYear = "2024-2025";

export const fetchAndStoreMGNREGAData = async (state, district = "", finYear = defaultFinYear) => {
  try {
    const encodedFinYear = encodeURIComponent(finYear);
    const encodedState = encodeURIComponent(state.trim());
    const encodedDistrict = district ? encodeURIComponent(district.trim()) : "";

    // Construct URL exactly like the working government one
    let url = `${API_URL}?api-key=${API_KEY}&format=json&limit=500&filters[fin_year]=${encodedFinYear}&filters[state_name]=${encodedState}`;
    if (encodedDistrict) url += `&filters[district_name]=${encodedDistrict}`;

    console.log("🌐 Fetching from:", url);

    const res = await axios.get(url, { timeout: 20000 });
    const records = res.data?.records || [];

    console.log(`✅ Got ${records.length} records`);

    if (!records.length) return [];

    for (const record of records) {
      await DistrictData.findOneAndUpdate(
        { district_code: record.district_code, fin_year: record.fin_year },
        record,
        { upsert: true, new: true }
      );
    }

    return records;
  } catch (err) {
    console.error("❌ MGNREGA fetch error:", err.message);
    return [];
  }
};
