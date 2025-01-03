const { createPromptModule } = require("inquirer");
const { loadConfig, saveConfig } = require("./config");
const districtData = require("./districts.json");
const { schedule } = require("./calendar");
const { adjustTime, getTodaySchedule, isRamadan } = require("./util");

schedule.year = new Date().getFullYear();

const prompt = createPromptModule();

async function selectDistrict() {
  const districts = districtData.districts.map((d) => ({
    name: `${d.name} (${d.bengali_name})`,
    value: d.name,
  }));

  const { district } = await prompt([
    {
      type: "list",
      name: "district",
      message: "Select your district:",
      choices: districts,
      default: loadConfig().selectedDistrict,
    },
  ]);

  saveConfig({ selectedDistrict: district });
  return district;
}

function getDistrictAdjustments(districtName) {
  const district = districtData.districts.find((d) => d.name === districtName);
  return district ? district.adjustments : { suhoor: 0, iftar: 0 };
}

function getAdjustedSchedule(baseSchedule, adjustments) {
  const adjusted = { ...baseSchedule };
  adjusted.sehri = adjustTime(baseSchedule.sehri, adjustments.suhoor);
  adjusted.magrib_iftar = adjustTime(
    baseSchedule.magrib_iftar,
    adjustments.iftar
  );
  return adjusted;
}

async function main() {
  // Load saved district or ask user to select
  let config = loadConfig();
  let selectedDistrict = config.selectedDistrict;

  if (!selectedDistrict) {
    selectedDistrict = await selectDistrict();
  }

  // Get district adjustments
  const adjustments = getDistrictAdjustments(selectedDistrict);

  // Get today's schedule and apply adjustments
  const baseSchedule = getTodaySchedule(schedule);
  const adjustedSchedule = getAdjustedSchedule(
    baseSchedule.schedule,
    adjustments
  );

  // Clear console and display header
  console.clear();
  console.log("\n=================================");
  console.log(`Prayer Schedule for ${baseSchedule.date}`);
  console.log(`District: ${selectedDistrict}`);
  console.log("=================================\n");

  // Display times
  console.log("Prayer Times:");
  console.log("---------------------------------");
  console.log(`Fazr:    ${adjustedSchedule.fazr}`);
  console.log(`Sunrise: ${adjustedSchedule.sunrise}`);
  console.log(`Juhoor:  ${adjustedSchedule.juhoor}`);
  console.log(`Asr:     ${adjustedSchedule.asr}`);
  console.log(`Magrib:  ${adjustedSchedule.magrib_iftar}`);
  console.log(`Isha:    ${adjustedSchedule.isha}`);

  if (isRamadan(new Date())) {
    console.log("\nRamadan Timings:");
    console.log("---------------------------------");
    console.log(`Sehri Ends: ${adjustedSchedule.sehri}`);
    console.log(`Iftar Time: ${adjustedSchedule.magrib_iftar}`);
  }

  console.log("\n=================================");
  console.log("Options:");
  console.log('1. Press "c" to change district');
  console.log('2. Press "q" to quit');
  console.log("=================================\n");

  // Handle user input
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", async (data) => {
    const key = data.toString().toLowerCase();
    if (key === "c") {
      selectedDistrict = await selectDistrict();
      main(); // Refresh display with new district
    } else if (key === "q") {
      process.exit();
    }
  });
}

// Start the application
main().catch(console.error);
