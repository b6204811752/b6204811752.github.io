/**
 * IndexNow Submission Script - carrentalranchi.com
 * Run with: node ping-indexnow.js
 * Run every time you update or publish new pages to notify search engines instantly
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const KEY = "a8b3f9c2e1d4567890abcdef12345678";
const HOST = "www.carrentalranchi.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read all URLs from sitemap.xml dynamically
const sitemapPath = path.join(__dirname, 'sitemap.xml');
let URLS = [];

if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const matches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    if (matches) {
        URLS = matches.map(match => match.replace(/<\/?loc>/g, ''));
    }
}

if (URLS.length === 0) {
    console.error("No URLs found in sitemap.xml to submit.");
    process.exit(1);
}

// IndexNow allows maximum 10,000 URLs per request
// URLS length will easily fit in 1 request

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
});

const options = {
  hostname: "api.indexnow.org",
  path: "/indexnow",
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  },
};

console.log(`Submitting ${URLS.length} URLs to IndexNow...`);

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  if (res.statusCode === 200 || res.statusCode === 202) {
    console.log("✅ SUCCESS - URLs submitted to IndexNow (Bing, Yandex, etc.)");
  } else if (res.statusCode === 422) {
    console.log("⚠️  Some URLs are not on the declared host or invalid.");
  } else {
    console.log(`Response code: ${res.statusCode}`);
  }
});

req.on("error", (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(payload);
req.end();
