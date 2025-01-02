const { schedule } = require("./calendar.js");
const { isRamadan, getTodaySchedule } = require("./util.js");

schedule.year = new Date().getFullYear();


function displaySchedule() {
  const result = getTodaySchedule(schedule);
  if (!result) {
    console.log("Schedule not available for today.");
    return;
  }

  const { date } = result;
  const isRamadanTime = isRamadan(new Date(date));

  // Clear console and display header
  console.clear();
  console.log("\n=================================");
  console.log(`Prayer Schedule for ${date}`);
  console.log("=================================\n");

  // Display times
  console.log("Regular Prayer Times:");
  console.log("---------------------------------");
  console.log(`Fazr:    ${result.schedule.fazr}`);
  console.log(`Sunrise: ${result.schedule.sunrise}`);
  console.log(`Juhoor:  ${result.schedule.juhoor}`);
  console.log(`Asr:     ${result.schedule.asr}`);
  console.log(`Magrib:  ${result.schedule.magrib_iftar}`);
  console.log(`Isha:    ${result.schedule.isha}`);

  // Display Ramadan-specific times if applicable
  if (isRamadanTime) {
    console.log("\nRamadan Timings:");
    console.log("---------------------------------");
    console.log(`Sehri Ends: ${result.schedule.sehri}`);
    console.log(`Iftar Time: ${result.schedule.magrib_iftar}`);
  }

  console.log("\n=================================\n");
}

// Export functions if you want to use them in other files
module.exports = {
  displaySchedule,
  getTodaySchedule,
  isRamadan,
};

// If running this file directly
if (require.main === module) {
  displaySchedule();
}
