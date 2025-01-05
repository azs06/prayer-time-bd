#!/usr/bin/env node
const { createPromptModule } = require("inquirer");
const { loadConfig, saveConfig } = require("./config");
const districtData = require("./districts.json");
const { schedule } = require("./calendar");
const { adjustTime, isRamadan, getClosestSchedule } = require("./util");
const yargs = require("yargs");

schedule.year = new Date().getFullYear();
process.stdout.setEncoding("utf8");

const prompt = createPromptModule();

function validateDistrict(district) {
  const validDistricts = districtData.districts.map((d) => d.name);
  return validDistricts.includes(district);
}

function validateDate(dateString) {
   // Check if the string matches the format YYYY-MM-DD
   const regex = /^\d{4}-\d{2}-\d{2}$/;
   if (!regex.test(dateString)) {
     return false; // Doesn't match the format
   }
 
   // Parse the string into a Date object
   const date = new Date(dateString);
 
   // Check if the date is valid
   const [year, month, day] = dateString.split("-").map(Number);
   return (
     date.getFullYear() === year &&
     date.getMonth() === month - 1 &&
     date.getDate() === day
   );
}

async function selectDistrict() {
  const districts = districtData.districts.map((d) => ({
    name: `${d.name}`,
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
  const argv = yargs
    .option("district", {
      alias: "d",
      type: "string",
      description: "Specify the district name",
    })
    .option("date", {
      alias: "t",
      type: "string",
      description: "Specify the date (YYYY-MM-DD)",
    })
    .help().argv;

  // Load saved district or ask user to select
  let config = loadConfig();
  let selectedDistrict = argv.district || config.selectedDistrict;

  if (!selectedDistrict) {
    selectedDistrict = await selectDistrict();
  }
  
  if(!validateDistrict(selectedDistrict)) {
    console.log("Invalid district name");
    console.log("Please select a valid district");
    selectedDistrict = await selectDistrict();
  }
  // Get district adjustments
  const adjustments = getDistrictAdjustments(selectedDistrict);

  if(!validateDate(argv.date)) {
    console.log("Invalid date format");
    process.exit
  }

  // Get today's schedule and apply adjustments
  const date = argv.date ? new Date(argv.date) : new Date();
  const baseSchedule = getClosestSchedule(schedule, date);
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
