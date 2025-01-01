// prayerSchedule.js
const { schedule } = require("./calendar.js");
const { isRamadan } = require("./util.js");

schedule.year = new Date().getFullYear();

function getTodaySchedule() {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDate = today.getDate();

  // Find the current month's data
  const monthData = schedule.months.find((m) => m.name === currentMonth);
  if (!monthData) {
    return null;
  }

  // Find the closest date in the schedule
  let closestSchedule = monthData.schedule[0];
  let closestDiff = Math.abs(currentDate - parseInt(closestSchedule.date));

  for (const daySchedule of monthData.schedule) {
    const diff = Math.abs(currentDate - parseInt(daySchedule.date));
    if (diff < closestDiff) {
      closestDiff = diff;
      closestSchedule = daySchedule;
    }
  }

  return {
    date: `${currentMonth} ${currentDate}, ${schedule.year}`,
    schedule: closestSchedule,
  };
}

function displaySchedule() {
  const result = getTodaySchedule();
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
