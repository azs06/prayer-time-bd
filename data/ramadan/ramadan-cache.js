import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const cacheDir = path.join(os.homedir(), ".prayer-time-bd");
const cacheFile = path.join(cacheDir, "ramadan-cache.json");

// Ensure the cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Ensure the cache file exists
if (!fs.existsSync(cacheFile)) {
  fs.writeFileSync(cacheFile, "{}");
}

// Save cache to file
export function saveCache(cache) {
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

export function getCache() {
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    cache = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  }
  return cache;
}
