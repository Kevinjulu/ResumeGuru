#!/usr/bin/env node
/**
 * Test Clerk authentication with a mock token
 * Usage: node server/scripts/testClerkToken.js <token_or_skip>
 */

const http = require("http");

// A simple mock JWT token for testing (not valid, just for structure)
const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1Njc4OTAiLCJpYXQiOjE1MTYyMzkwMjJ9.mock";

async function testAPI(endpoint, method = "GET", token = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: "127.0.0.1",
      port: 5000,
      path: endpoint,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`\n${method} ${endpoint}`);
        console.log(`Status: ${res.statusCode}`);
        if (token) {
          console.log(`Token: ${token.substring(0, 20)}...`);
        }
        if (data) {
          try {
            console.log("Response:", JSON.parse(data));
          } catch {
            console.log("Response:", data.substring(0, 100));
          }
        }
        resolve({ status: res.statusCode, data });
      });
    });

    req.on("error", (err) => {
      console.error("Request error:", err.message);
      resolve({ status: 0, error: err.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log("\n=== Clerk Authentication Test ===\n");
  console.log("Server URL: http://127.0.0.1:5000");
  console.log("Env vars loaded in dev server: see .env.local\n");

  console.log("Test 1: API without token");
  await testAPI("/api/resumes");

  console.log("\n\nTest 2: API with mock token");
  await testAPI("/api/resumes", "GET", mockToken);

  console.log("\n\n=== Test Complete ===\n");
}

runTests().catch(console.error);
