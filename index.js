#!/usr/bin/env node
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "./config.js";
import { districtData } from "./data.js";
import { schedule } from "./calendar.js";
import { isRamadan } from "./ramadan.js";
import { getPrayerTimes } from "./core.js";
import { hideBin } from "yargs/helpers";
import { formatDate } from "./util.js";
import yargs from "yargs";
import ora from "ora";

const spinner = ora("Loading Prayer Times");
const y = yargs(hideBin(process.argv));

schedule.year = new Date().getFullYear();

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

  const { district } = await inquirer.prompt([
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

async function display(date, selectedDistrict, adjustedSchedule) {
  // Clear console and display header
  //console.clear();
  let ramadan = false;
  try {
    ramadan = await isRamadan(formatDate(new Date()));
  } catch (error) {
    console.error("Failed to check Ramadan status:", error);
    throw new Error(error);
  }
  console.log("\n=================================");
  console.log(`Prayer Schedule for ${date}`);
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

  if (ramadan) {
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

async function main() {
  const argv = y
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

  if (argv.date && !validateDate(argv.date)) {
    console.log("Invalid date format");
    process.exit;
    return;
  }

  // Validate user input district and provide options otherwise
  let config = loadConfig();
  if (argv.district) {
    if (validateDistrict(argv.district)) {
      saveConfig({ selectedDistrict: argv.district });
    } else if (!config.selectedDistrict) {
      console.log("Invalid district name");
      console.log("Please select a valid district");
      await selectDistrict();
    }
  }

  let selectedDistrict =
    loadConfig()?.selectedDistrict || (await selectDistrict());

  // Get today's schedule and apply adjustments
  const date = argv.date ? new Date(argv.date) : new Date();
  // const baseSchedule = getClosestSchedule(schedule, date);
  const adjustedSchedule = getPrayerTimes(date, selectedDistrict);

  await display(date, selectedDistrict, adjustedSchedule);
  //const ramadan = await isRamadan(formatDate(new Date()));
}

// Start the application
main().catch(console.error);

export { getPrayerTimes };
