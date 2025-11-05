// frontend/src/components/DistrictSelector.js
import React from "react";

const DistrictSelector = ({
  states,
  selectedState,
  onStateChange,
  selectedDistrict,
  districts,
  onDistrictChange,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl p-6 flex flex-wrap gap-4 justify-center mt-6">
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600 mb-1">
          State
        </label>
        <select
          className="border border-gray-300 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:bg-white"
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600 mb-1">
          District
        </label>
        <select
          className="border border-gray-300 bg-gray-50 text-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:bg-white"
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DistrictSelector;
