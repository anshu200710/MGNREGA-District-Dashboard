// frontend/src/components/CompareCard.js
import React, { useState } from "react";
import { fetchMGNREGAData } from "../api";
import StatsCard from "./StatsCard";

const CompareCard = ({ states }) => {
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [district1, setDistrict1] = useState("");
  const [district2, setDistrict2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const compare = async () => {
    if (!district1 || !district2) {
      setMessage("Please enter both district names to compare.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const [res1, res2] = await Promise.all([
        fetchMGNREGAData({ district: district1 }),
        fetchMGNREGAData({ district: district2 }),
      ]);
      const data1 = res1.records?.[0] || res1.data?.[0];
      const data2 = res2.records?.[0] || res2.data?.[0];

      if (!data1 || !data2) {
        setMessage("No data found for one or both districts.");
        setFirst(null);
        setSecond(null);
      } else {
        setFirst(data1);
        setSecond(data2);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch comparison data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
        ⚖️ Compare Two Districts
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter District 1"
          value={district1}
          onChange={(e) => setDistrict1(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 outline-none rounded-xl px-4 py-2 w-56 shadow-sm"
        />
        <input
          type="text"
          placeholder="Enter District 2"
          value={district2}
          onChange={(e) => setDistrict2(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 outline-none rounded-xl px-4 py-2 w-56 shadow-sm"
        />
        <button
          onClick={compare}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          Compare
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {message && !loading && (
        <p className="text-center text-red-500 font-medium">{message}</p>
      )}

      {first && second && (
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-inner">
            <h3 className="text-center font-semibold text-gray-700 mb-4">
              {first.district_name}, {first.state_name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatsCard title="Total Expenditure" value={first.Total_Exp} unit="Cr" />
              <StatsCard title="Households Worked" value={first.Total_Households_Worked} />
              <StatsCard
                title="Avg Wage Rate"
                value={first.Average_Wage_rate_per_day_per_person}
                unit="₹"
              />
              <StatsCard title="Completed Works" value={first.Number_of_Completed_Works} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white shadow-inner">
            <h3 className="text-center font-semibold text-gray-700 mb-4">
              {second.district_name}, {second.state_name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatsCard title="Total Expenditure" value={second.Total_Exp} unit="Cr" />
              <StatsCard title="Households Worked" value={second.Total_Households_Worked} />
              <StatsCard
                title="Avg Wage Rate"
                value={second.Average_Wage_rate_per_day_per_person}
                unit="₹"
              />
              <StatsCard title="Completed Works" value={second.Number_of_Completed_Works} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareCard;
