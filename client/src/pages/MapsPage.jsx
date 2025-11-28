// src/pages/MapsPage.jsx
import React, { useState } from "react";
import axios from "axios";

function MapsPage() {
  const [business, setBusiness] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async (newSearch = true) => {
    if (!business || !city) {
      alert("Please enter both fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/search`, {
        business,
        city,
        page: newSearch ? 1 : page,
      });

      const data = res.data.data || [];

      if (newSearch) {
        setResults(data);
        setPage(2);
      } else {
        setResults((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
      }

      setHasMore(data.length > 0);
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!results.length) return;

    const headers = ["Name", "Address", "Phone", "Website", "Rating", "Total Ratings"];
    const csvRows = [
      headers.join(","),
      ...results.map((r) =>
        [
          `"${r.name}"`,
          `"${r.address}"`,
          `"${r.phone}"`,
          `"${r.website}"`,
          r.rating,
          r.total_ratings,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${business}_${city}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
        Google Maps Data Scraper
      </h1>

      {/* (rest of your existing JSX is unchanged) */}
      {/* ---- paste your original JSX body here ---- */}
    </div>
  );
}

export default MapsPage;
