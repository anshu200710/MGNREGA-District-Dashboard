export const normalizeState = (state, keepDelhi = false) => {
  if (!state) return "";
  const s = state.toUpperCase();

  // Special handling
  if (keepDelhi && s === "DELHI") return "DELHI";

  const map = {
    "DELHI": "NCT OF DELHI",
    "JAMMU AND KASHMIR": "JAMMU & KASHMIR",
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": "DADRA & NAGAR HAVELI",
  };

  return map[s] || s;
};

export const normalizeDistrict = (district) => {
  if (!district) return "";
  const map = {
    "EAST DELHI": "EAST DELHI",
    "WEST DELHI": "WEST DELHI",
    "NORTH DELHI": "NORTH DELHI",
    "SOUTH DELHI": "SOUTH DELHI",
    "NORTH WEST DELHI": "NORTH WEST DELHI",
    "NORTH EAST DELHI": "NORTH EAST DELHI",
    "SOUTH WEST DELHI": "SOUTH WEST DELHI",
    "SOUTH EAST DELHI": "SOUTH EAST DELHI",
    "SHAHDARA": "SHAHDARA",
  };
  return map[district.toUpperCase()] || district.toUpperCase();
};
