import { cron } from "convex/server";

export const everyMinute = cron("*/1 * * * *", () => {
  console.log("This cron job runs every minute");
});
