export async function displayConsole(
    date,
    selectedDistrict,
    adjustedSchedule,
    ramadan = false
  ) {
    // Clear console and display header
    console.log("\n=================================");
    console.log(`Prayer Schedule for ${date}`);
    console.log(`District: ${selectedDistrict}`);
    console.log("=================================\n");
    console.log(`Sunrise: ${adjustedSchedule.sunrise}`);
    console.log("---------------------------------");
    // Display times
    console.log("Prayer Times:");
    console.log("---------------------------------");
    console.log(`Fazr:    ${adjustedSchedule.fazr}`);
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
  }