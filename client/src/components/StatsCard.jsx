// frontend/src/components/StatsCard.js
import React from "react";
import { TrendingUp, Users, Wallet, CheckCircle } from "lucide-react";

const iconMap = {
  "Total Expenditure": <Wallet className="w-6 h-6 text-blue-600" />,
  "Households Worked": <Users className="w-6 h-6 text-green-600" />,
  "Avg Wage Rate": <TrendingUp className="w-6 h-6 text-orange-500" />,
  "Completed Works": <CheckCircle className="w-6 h-6 text-purple-600" />,
};

const StatsCard = ({ title, value, unit }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg rounded-2xl p-5 flex flex-col justify-between items-center text-center transition-all transform hover:-translate-y-1">
      {/* Icon */}
      <div className="mb-2">{iconMap[title]}</div>

      {/* Title */}
      <h3 className="text-gray-500 text-sm font-semibold tracking-wide">
        {title}
      </h3>

      {/* Value */}
      <p className="text-3xl font-extrabold text-blue-700 mt-2">
        {value ? value.toLocaleString() : "-"}
        {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
      </p>

      {/* Accent Bar */}
      <div className="w-16 h-1 mt-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
    </div>
  );
};

export default StatsCard;
