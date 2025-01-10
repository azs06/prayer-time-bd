import fs from "node:fs";
const cacheFile = "ramadan-cache.json";


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
