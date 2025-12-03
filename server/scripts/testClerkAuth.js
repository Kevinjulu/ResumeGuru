#!/usr/bin/env node
// Simple test script to exercise clerkAuthMiddleware by calling the local server
// Usage:
//   node server/scripts/testClerkAuth.js <token>
// or set TEST_CLERK_TOKEN env var and run without args.

const http = require('http');

const token = process.argv[2] || process.env.TEST_CLERK_TOKEN;
if (!token) {
  console.error('Provide a Clerk token as the first arg or set TEST_CLERK_TOKEN env var');
  process.exit(1);
}

const port = process.env.PORT || 5000;
const options = {
  hostname: '127.0.0.1',
  port: port,
  path: '/api/resumes',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      console.log('body:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('body (raw):', data);
    }
  });
});

req.on('error', (e) => {
  console.error('request error', e.message);
});

req.end();
