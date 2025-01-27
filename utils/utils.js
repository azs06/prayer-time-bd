function getClosestSchedule(schedule, today = new Date()) {
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDate = today.getDate();

  // Find the current month's data
  const monthData = schedule.months.find((m) => m.name === currentMonth);
  if (!monthData) return null;

  // Find the latest schedule entry with date <= currentDate
  let closestSchedule = null;
  let maxValidDate = -Infinity;

  for (const daySchedule of monthData.schedule) {
    const scheduleDate = parseInt(daySchedule.date, 10);
    if (scheduleDate <= currentDate && scheduleDate > maxValidDate) {
      maxValidDate = scheduleDate;
      closestSchedule = daySchedule;
    }
  }

  // Fallback to first entry if none found (shouldn't happen with valid data)
  if (!closestSchedule) closestSchedule = monthData.schedule[0];

  return {
    date: `${currentMonth} ${currentDate}, ${schedule.year}`,
    schedule: closestSchedule,
  };
}
  
  const getTodaySchedule = (schedule) => {
    if (!schedule || !schedule.months) return {};
    return getClosestSchedule(schedule);
  };
  
  const getNextPrayer = (schedule) => {
    if (!schedule) return null;
  
    const now = new Date();
    const prayers = [
      { name: "Sehri", time: schedule.sehri },
      { name: "Fazr", time: schedule.fazr },
      { name: "Sunrise", time: schedule.sunrise },
      { name: "Juhoor", time: schedule.juhoor },
      { name: "Asr", time: schedule.asr },
      { name: "Magrib/Iftar", time: schedule.magrib_iftar },
      { name: "Isha", time: schedule.isha },
    ];
  
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  
    for (const prayer of prayers) {
      if (prayer.time > currentTime) {
        return prayer;
      }
    }
  
    return prayers[0]; // Return first prayer of next day if all prayers passed
  };
  
  function adjustTime(timeStr, minutesToAdd) {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
  
    let totalMinutes = hours * 60 + minutes;
    totalMinutes += minutesToAdd;
  
    let newHours = Math.floor(totalMinutes / 60);
    let newMinutes = totalMinutes % 60;
  
    // Handle day wrap-around
    if (newHours >= 12) {
      newHours = newHours % 12;
      if (newHours === 0) newHours = 12;
      if (period === "AM") period = "PM";
    }
    if (newHours === 0) newHours = 12;
  
    return `${newHours}:${String(newMinutes).padStart(2, "0")} ${period}`;
  }
  
  function padNumber(number, maxLength, fillString) {
    return `${number}`.padStart(maxLength, fillString);
  }
  
  /*
  @params date: Date 
  @returns dateString: DD-MM-YYYY
  */
  function formatDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Add 1 to get the correct month
    const day = dateObj.getDate(); // Use getDate() to get the day of the month
    return `${padNumber(day, 2, '0')}-${padNumber(month, 2, '0')}-${year}`;
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
  
  
  
  export {
    getTodaySchedule,
    getNextPrayer,
    getClosestSchedule,
    adjustTime,
    formatDate,
    validateDate,
  };
  