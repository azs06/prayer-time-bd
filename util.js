// Utility functions
const isRamadan = async (date) => {
  // Ramadan 2025 dates (example - update with actual dates)
  const checkDate = new Date(date);
  const formattedDate = checkDate
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("-");
  const [day, month, year] = formattedDate.split("-");
  const apiUrl = `https://api.aladhan.com/v1/currentIslamicMonth`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  // Check if the Hijri month is Ramadan
  const isRamadan = data.data === 9;
  return isRamadan;
};

function getClosestSchedule(schedule, today = new Date()) {
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

export {
  isRamadan,
  getTodaySchedule,
  getNextPrayer,
  getClosestSchedule,
  adjustTime,
};
