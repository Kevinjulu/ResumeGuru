import { ConvexHttpClient } from "convex/browser";

async function main() {
  const url = process.env.CONVEX_URL;
  if (!url) {
    console.error("Missing CONVEX_URL. Set it to your Convex deployment URL.");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);

  try {
    const result = await client.mutation("seed:seed", {});
    console.log("Convex seed complete:", result);
  } catch (err) {
    console.error("Convex seed failed:", err);
    process.exit(1);
  }
}

main();

