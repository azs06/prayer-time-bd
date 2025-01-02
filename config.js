const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "userConfig.json");
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, "{}");
}

const RAMADAN_START_DATE = "2021-04-13";
const RAMADAN_END_DATE = "2021-05-12";

// Function to load user preferences
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      return config;
    }
  } catch (error) {
    console.error("Error loading config:", error);
  }
  return { selectedDistrict: "Dhaka District" };
}

// Function to save user preferences
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving config:", error);
  }
}

module.exports = {
  RAMADAN_START_DATE,
  RAMADAN_END_DATE,
  loadConfig,
  saveConfig,
};
