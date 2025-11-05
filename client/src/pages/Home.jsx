import React, { useEffect, useState } from "react";
import { fetchGeoLocation, fetchMGNREGAData } from "../api";
import StatsCard from "../components/StatsCard";
import DistrictSelector from "../components/DistrictSelector";
import TrendChart from "../components/TrendChart";
import CompareCard from "../components/CompareCard";

const Home = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [geoDetected, setGeoDetected] = useState(false);

  // Fetch MGNREGA data
  const fetchData = async (filters = {}) => {
    setLoading(true);
    setMessage("");
    setShowMessage(false);
    try {
      const res = await fetchMGNREGAData(filters);
      const records = Array.isArray(res?.data) ? res.data : res?.records || [];

      // 🌟 NEW: Get the final location from the backend response
            const finalLocation = res?.location || filters;

            // 🌟 NEW: Synchronize the frontend state with the final location used by the backend
            // This is crucial for reflecting the fallback location (e.g., Varanasi instead of Delhi)
            setState(finalLocation.state || "");
            setDistrict(finalLocation.district || "");

      if (records.length === 0) {
        if (filters.state?.toUpperCase().includes("DELHI")) {
          setMessage("⚠️ MGNREGA data is not available for urban regions like Delhi.");
        } else {
          setMessage("No MGNREGA data found for your district.");
        }
        setShowMessage(true);
      }

      setData(records);
      console.log("✅ Loaded records:", records.length);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Failed to load data. Please try again later.");
      setShowMessage(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // // Detect location only when user clicks
  // const handleDetectLocation = async () => {
  //   setLoading(true);
  //   try {
  //     const geo = await fetchGeoLocation();
  //     if (geo) {
  //       setState(geo.state);
  //       setDistrict(geo.district);
  //       setGeoDetected(true);
  //       console.log("📍 Detected location:", geo);
  //       await fetchData({ state: geo.state, district: geo.district });
  //     }
  //   } catch (err) {
  //     console.error("Location fetch failed:", err);
  //     setMessage("⚠️ Failed to detect location, please select manually.");
  //     setShowMessage(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  useEffect(() => {
  const autoDetect = async () => {
    setLoading(true);
    try {
      const geo = await fetchGeoLocation();
      if (geo) {
        setState(geo.state);
        setDistrict(geo.district);
        setGeoDetected(true);
        console.log("📍 Auto-detected:", geo);
        await fetchData({ state: geo.state, district: geo.district });
      }
    } catch (err) {
      console.error("Auto location fetch failed:", err);
      setMessage("⚠️ Failed to auto-detect location, please select manually.");
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  autoDetect();
}, []);

  const uniqueStates = [...new Set((data || []).map((d) => d.state_name))];
  const uniqueDistricts = [...new Set((data || []).map((d) => d.district_name))];
  const first = data[0] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          🌾 MGNREGA Dashboard
        </h1>

        {/* Warning / Message Box */}
        {showMessage && message && (
          <div className="max-w-2xl mx-auto mb-6 flex items-start bg-yellow-100 text-yellow-900 border border-yellow-400 rounded-xl shadow-md p-4 relative">
            <span className="mr-2 text-xl">⚠️</span>
            <p className="flex-1">{message}</p>
            <button
              className="ml-3 text-yellow-800 font-bold hover:text-yellow-600"
              onClick={() => setShowMessage(false)}
            >
              ×
            </button>
          </div>
        )}

        {/* Detect Location Button
        {!geoDetected && (
          <div className="text-center mb-6">
            <button
              onClick={handleDetectLocation}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Detecting..." : "📍 Detect My Location"}
            </button>
          </div>
        )} */}

        {/* State/District Selector */}
        {geoDetected && (
          <div className="flex justify-center mb-6">
            <DistrictSelector
              states={uniqueStates}
              selectedState={state}
              onStateChange={(val) => fetchData({ state: val })}
              selectedDistrict={district}
              districts={uniqueDistricts}
              onDistrictChange={(val) => fetchData({ district: val })}
            />
          </div>
        )}

        {/* Data Display */}
        {loading ? (
          <p className="text-center text-gray-500 mt-8 animate-pulse">
            Loading data...
          </p>
        ) : !data.length && !loading ? (
          !showMessage && (
            <p className="text-center text-red-500 mt-8">No data found.</p>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <StatsCard
                title="Total Expenditure"
                value={first.Total_Exp}
                unit="Cr"
                accent="bg-blue-100"
              />
              <StatsCard
                title="Households Worked"
                value={first.Total_Households_Worked}
                accent="bg-orange-100"
              />
              <StatsCard
                title="Avg Wage Rate"
                value={first.Average_Wage_rate_per_day_per_person}
                unit="₹"
                accent="bg-green-100"
              />
              <StatsCard
                title="Completed Works"
                value={first.Number_of_Completed_Works}
                accent="bg-purple-100"
              />
            </div>

            <div className="mt-10">
              <TrendChart data={data} />
            </div>

            <div className="mt-10">
              <CompareCard states={uniqueStates} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
