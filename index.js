const { schedule } = require("./calendar.js");
const { isRamadan, getTodaySchedule } = require("./util.js");

schedule.year = new Date().getFullYear();


function displaySchedule() {
  const result = getTodaySchedule(schedule);
  if (!result) {
    console.log("Schedule not available for today.");
    return;
  }

  const { date, schedule } = result;
  const isRamadanTime = isRamadan();

  // Clear console and display header
  console.clear();
  console.log("\n=================================");
  console.log(`Prayer Schedule for ${date}`);
  console.log("=================================\n");

  // Display times
  console.log("Regular Prayer Times:");
  console.log("---------------------------------");
  console.log(`Fazr:    ${schedule.fazr}`);
  console.log(`Sunrise: ${schedule.sunrise}`);
  console.log(`Juhoor:  ${schedule.juhoor}`);
  console.log(`Asr:     ${schedule.asr}`);
  console.log(`Magrib:  ${schedule.magrib_iftar}`);
  console.log(`Isha:    ${schedule.isha}`);

  // Display Ramadan-specific times if applicable
  if (isRamadanTime) {
    console.log("\nRamadan Timings:");
    console.log("---------------------------------");
    console.log(`Sehri Ends: ${schedule.sehri}`);
    console.log(`Iftar Time: ${schedule.magrib_iftar}`);
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
