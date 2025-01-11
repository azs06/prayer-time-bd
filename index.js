#!/usr/bin/env node
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "./config.js";
import { districtData } from "./data.js";
import { schedule } from "./calendar.js";
import { isRamadan } from "./ramadan.js";
import { getPrayerTimes } from "./core.js";
import { hideBin } from "yargs/helpers";
import { formatDate, validateDate } from "./util.js";
import { displayTable, displayConsole } from "./display.js";
import yargs from "yargs";
import ora from "ora";

const spinner = ora("Loading Prayer Times");
const y = yargs(hideBin(process.argv));

schedule.year = new Date().getFullYear();

function validateDistrict(district) {
  const validDistricts = districtData.districts.map((d) => d.name);
  return validDistricts.includes(district);
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

async function display(
  date,
  selectedDistrict,
  adjustedSchedule,
  ramadan = false
) {
  
  displayTable(date, selectedDistrict, adjustedSchedule, ramadan)
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

  const date = argv.date ? new Date(argv.date) : new Date();
  const adjustedSchedule = getPrayerTimes(date, selectedDistrict);

  spinner.start();
  setTimeout(async () => {
    let ramadan = false;
    try {
      ramadan = await isRamadan(formatDate(new Date()));
    } catch (error) {
      console.error("Failed to check Ramadan status:", error);
      throw new Error(error);
    }
    spinner.stop();
    await display(date, selectedDistrict, adjustedSchedule, ramadan);
  }, 1000);
}

// Start the application
main().catch(console.error);

export { getPrayerTimes };
