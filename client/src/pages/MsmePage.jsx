// src/pages/MsmePage.jsx
import React, { useState } from "react";
import axios from "axios";
import { STATE_DISTRICT_DATA } from "../assets/assets"; // 👈 adjust path if needed


// List of state names
const STATE_LIST = STATE_DISTRICT_DATA.states.map((s) => s.state);

// Helper to get districts for a given state
const getDistrictsForState = (stateName) => {
  const entry = STATE_DISTRICT_DATA.states.find((s) => s.state === stateName);
  return entry ? entry.districts : [];
};

const ACTIVITY_OPTIONS = [
  { value: "", label: "All activities" },
  { value: "FOOD", label: "Food / Snacks / Restaurants" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "RETAIL", label: "Retail / Shops" },
  { value: "AUTO", label: "Auto / Garage / Motors" },
  { value: "TEXTILE", label: "Textile / Garments" },
  { value: "HEALTHCARE", label: "Healthcare / Clinics / Labs / Pharmacy" },
  { value: "EDUCATION", label: "Coaching / Schools / Training Centres" },
  { value: "CONSTRUCTION", label: "Construction / Building Materials" },
  { value: "HARDWARE", label: "Hardware / Tools / Electricals" },
  { value: "IT_SERVICES", label: "IT Services / Software / Web Development" },
  { value: "FINANCE", label: "Finance / CA / Consultancy Services" },
  { value: "BEAUTY", label: "Salon / Beauty / Spa" },
  { value: "TRANSPORT", label: "Transport / Logistics / Courier" },
  { value: "HOSPITALITY", label: "Hotels / Guest Houses / Lodging" },
  { value: "AGRICULTURE", label: "Agriculture / Seeds / Fertilizers" },
  { value: "ELECTRONICS", label: "Electronics / Mobiles / Accessories" },
  { value: "FURNITURE", label: "Furniture / Interiors / Home Decor" },
  { value: "EVENTS", label: "Events / Wedding / Photography" },
  { value: "MEDICAL_EQUIPMENT", label: "Medical Equipment / Supplies" },
  { value: "REAL_ESTATE", label: "Real Estate / Property Services" },
  { value: "PRINTING", label: "Printing / Graphics / Advertising" },
  { value: "SPORTS", label: "Sports / Fitness / Gym" },
  { value: "CHEMICALS", label: "Chemicals / Laboratory / Industrial" },
  { value: "JEWELLERY", label: "Jewellery / Gold / Silver" },
  { value: "HANDICRAFTS", label: "Handicrafts / Artisans / Handmade Products" },
  { value: "SERVICES", label: "General Services / Repair / Maintenance" },
  { value: "PHOTOGRAPHY", label: "Photography / Videography" },
  { value: "STATIONERY", label: "Stationery / Books / Printing Supplies" },
  { value: "BAKERY", label: "Bakery / Sweets / Confectionery" },
  { value: "MECHANICAL", label: "Mechanical / Industrial Fabrication" },
  { value: "PLUMBING", label: "Plumbing / Electrical Repair" },
  { value: "FISHERIES", label: "Fisheries / Poultry / Dairy" },
];

function MsmePage() {
  const [activity, setActivity] = useState("");
  const [stateName, setStateName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async (newSearch = true) => {
    if (!stateName || !districtName) {
      alert("Please select both State and District.");
      return;
    }

    const location = `${districtName}, ${stateName}`;

    setLoading(true);
    try {
      const currentPage = newSearch ? 1 : page;

      const res = await axios.post(`${API_URL}/api/msme/search`, {
        activity,
        location,
        page: currentPage,
      });

      if (!res.data.success) {
        alert(res.data.message || "Error from server");
        setLoading(false);
        return;
      }

      const data = res.data.data || [];
      const more = res.data.hasMore ?? data.length > 0;

      if (newSearch) {
        setResults(data);
        setPage(2);
      } else {
        setResults((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
      }

      setHasMore(more);
      setStats(res.data.stats || null);
    } catch (err) {
      console.error(err);
      alert("Error fetching MSME data");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!results.length) return;

    const headers = [
      "Enterprise Name",
      "State",
      "District",
      "Pincode",
      "Registration Date",
      "Activities",
      "Communication Address",
      "Google Name",
      "Google Address",
      "Google Phone",
      "Google Website",
    ];

    const csvRows = [
      headers.join(","),
      ...results.map((r) =>
        [
          `"${r.enterpriseName}"`,
          `"${r.state}"`,
          `"${r.district}"`,
          `"${r.pincode}"`,
          `"${r.registrationDate}"`,
          `"${r.activities}"`,
          `"${r.communicationAddress}"`,
          `"${r.googleName || ""}"`,
          `"${r.googleAddress || ""}"`,
          `"${r.googlePhone || ""}"`,
          `"${r.googleWebsite || ""}"`,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MSME_${districtName}_${stateName}.csv`;
    a.click();
  };

  const totalGov = stats?.totalGov ?? results.length;
const districtsForState = stateName ? getDistrictsForState(stateName) : [];


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            MSME UDYAM Lookup
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select State & District, optionally filter by Activity, and view
            registered MSME units with Google Maps name, phone & website (when available).
          </p>
        </header>

        {/* Filters */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={stateName}
                onChange={(e) => {
                  setStateName(e.target.value);
                  setDistrictName("");
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Select state</option>
                {STATE_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                disabled={!stateName}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">
                  {stateName ? "Select district" : "Select state first"}
                </option>
                {districtsForState.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Activity (optional)
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.value || "ALL"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <div className="flex items-end">
              <button
                onClick={() => handleSearch(true)}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${loading
                    ? "bg-emerald-400 text-white cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Searching…
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Search MSMEs
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        {stats && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 font-medium">
                Total MSME records
              </p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {totalGov}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 font-medium">
                Google Maps checked
              </p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {stats.googleAttempted}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Matched:{" "}
                <span className="font-semibold text-slate-700">
                  {stats.googleMatched}
                </span>
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 font-medium">
                Phone numbers found
              </p>
              <p className="text-2xl font-semibold text-emerald-600 mt-1">
                {stats.phoneWithNumber}
              </p>
            </div>
          </section>
        )}

        {/* Actions row */}
        {results.length > 0 && (
          <section className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <b>{results.length}</b> results
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-sm"
              >
                ⬇️ Download CSV
              </button>
              {hasMore && !loading && (
                <button
                  onClick={() => handleSearch(false)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-sm"
                >
                  🔁 Load More
                </button>
              )}
            </div>
          </section>
        )}

        {/* Results table */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Results</span>
            <span>{results.length} entries</span>
          </div>

          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Enterprise",
                  "State",
                  "District",
                  "Pincode",
                  "Reg. Date",
                  "Activities",
                  "Address",
                  "Google Name",
                  "Google Phone",
                  "Google Website",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 border-b border-slate-200 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const initials = (r.enterpriseName || "NA")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const hasPhone = !!r.googlePhone;
                const hasWebsite = !!r.googleWebsite;

                return (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-semibold text-slate-600">
                          {initials}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-xs md:text-sm truncate max-w-[220px]">
                            {r.enterpriseName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600 whitespace-nowrap">
                      {r.state}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600 whitespace-nowrap">
                      {r.district}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600 whitespace-nowrap">
                      {r.pincode}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600 whitespace-nowrap">
                      {r.registrationDate}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      <div className="max-w-[260px] leading-snug line-clamp-3">
                        {r.activities}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      <div className="max-w-[260px] leading-snug line-clamp-3">
                        {r.communicationAddress}
                      </div>
                    </td>

                    {/* Google Name */}
                    <td className="px-4 py-3 align-top text-xs text-slate-600">
                      {r.googleName || "N/A"}
                    </td>

                    {/* Google Phone */}
                    <td className="px-4 py-3 align-top">
                      {hasPhone ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {r.googlePhone}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Google Website */}
                    <td className="px-4 py-3 align-top">
                      {hasWebsite ? (
                        <a
                          href={r.googleWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                        >
                          Visit site
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          N/A
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {results.length === 0 && !loading && (
            <div className="py-10 text-center text-sm text-slate-400">
              No MSME units found. Select State & District and search.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MsmePage;
