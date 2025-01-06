import { readFileSync } from "fs";

export const districtData = JSON.parse(readFileSync("./districts.json", "utf8"));


