import Table from "cli-table3";

export async function displayTable(
  date,
  selectedDistrict,
  adjustedSchedule,
  ramadan = false
) {
  // Clear console
  console.clear();

  // Display header
  console.log("\n=================================");
  console.log(`Prayer Schedule for ${date}`);
  console.log(`District: ${selectedDistrict}`);
  console.log("=================================\n");

  // Create a table for prayer times excluding Sunrise
  const prayerTable = new Table({
    head: ["Prayer", "Time"],
    colWidths: [15, 15],
  });

  prayerTable.push(
    ["Fazr", adjustedSchedule.fazr],
    ["Juhoor", adjustedSchedule.juhoor],
    ["Asr", adjustedSchedule.asr],
    ["Magrib", adjustedSchedule.magrib_iftar],
    ["Isha", adjustedSchedule.isha]
  );

  console.log("Prayer Times:");
  console.log("---------------------------------");
  console.log(prayerTable.toString());

  // Create a separate table for Sunrise
  const sunriseTable = new Table({
    head: ["Event", "Time"],
    colWidths: [15, 15],
  });

  sunriseTable.push(["Sunrise", adjustedSchedule.sunrise]);

  console.log("\nSunrise Time:");
  console.log("---------------------------------");
  console.log(sunriseTable.toString());

  if (ramadan) {
    // Create a table for Ramadan timings
    const ramadanTable = new Table({
      head: ["Ramadan Timing", "Time"],
      colWidths: [15, 15],
    });

    ramadanTable.push(
      ["Sehri Ends", adjustedSchedule.sehri],
      ["Iftar Time", adjustedSchedule.magrib_iftar]
    );

    console.log("\nRamadan Timings:");
    console.log("---------------------------------");
    console.log(ramadanTable.toString());
  }

  console.log("\n=================================");
  console.log("Options:");
  console.log('1. Press "c" to change district');
  console.log('2. Press "q" to quit');
  console.log("=================================\n");
}