// frontend/src/components/TrendChart.js
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TrendChart = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No trend data available
      </p>
    );

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">
        📊 Expenditure vs Persondays Trend
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="fin_year"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
              color: "#374151",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: "13px", color: "#374151" }}
          />

          <Line
            type="monotone"
            dataKey="Total_Exp"
            stroke="url(#colorExp)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Expenditure (Cr)"
          />
          <Line
            type="monotone"
            dataKey="Total_Persondays_Generated"
            stroke="url(#colorDays)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Persondays Generated"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
