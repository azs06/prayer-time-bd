import { readFileSync } from "fs";

export const districtData = JSON.parse(
  readFileSync("./districts.json", "utf8")
);

export function validateDistrict(district) {
  const validDistricts = districtData.districts.map((d) => d.name);
  return validDistricts.includes(district);
}
