import { readFileSync } from "fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISTRICS_DATA_FILE = path.join(__dirname, "districts.json");

export const districtData = JSON.parse(
  readFileSync(DISTRICS_DATA_FILE, "utf8")
);

export function validateDistrict(district) {
  const validDistricts = districtData.districts.map((d) => d.name);
  return validDistricts.includes(district);
}
