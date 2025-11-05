# 🌾 MGNREGA Dashboard

### 🎯 Problem
MGNREGA ka open data public hai but raw CSV/API format me hota hai.
Users ke liye apne district ka employment & expenditure data samajhna mushkil hai.

### 💡 Solution
Ye dashboard automatically user ki location detect karta hai,
data.gov.in ke official API se data fetch karta hai,
aur MongoDB me store karke visualize karta hai (React frontend).

### 🛠️ Tech Stack
- Frontend: React + TailwindCSS + Recharts
- Backend: Node.js + Express
- Database: MongoDB
- API: data.gov.in MGNREGA dataset
- Deployment (optional): Docker + Nginx

### 📊 Features
- Auto geolocation detection
- Live MGNREGA stats (state & district level)
- Cached MongoDB data (fast response)
- Trend charts & comparison view

### ⚙️ How to Run
1. Clone repo
2. Add `.env` with:
