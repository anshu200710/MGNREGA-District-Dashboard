// backend/cron/scheduler.js
import cron from "node-cron";
import { fetchAndStoreMGNREGAData } from "../utils/fetchMGNREGA.js";

const states = [
  "UTTAR PRADESH",
  "BIHAR",
  "RAJASTHAN",
  "MADHYA PRADESH",
  "MAHARASHTRA",
];

export const startScheduler = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("⏰ Running scheduled MGNREGA data update...");
    for (const state of states) {
      await fetchAndStoreMGNREGAData(state);
    }
  });
};
