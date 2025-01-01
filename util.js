// Utility functions
const isRamadan = (date) => {
  // Ramadan 2025 dates (example - update with actual dates)
  const ramadanStart = new Date("2025-03-01");
  const ramadanEnd = new Date("2025-03-30");
  const checkDate = new Date(date);
  return checkDate >= ramadanStart && checkDate <= ramadanEnd;
};

const getTodaySchedule = () => {
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const day = today.getDate().toString().padStart(2, "0");

  const monthData = prayerSchedule2025.months.find((m) => m.name === month);
  if (!monthData) return null;

  const daySchedule = monthData.schedule.find(
    (s) => parseInt(s.date) === parseInt(day)
  );
  return daySchedule;
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

module.exports = {
    isRamadan,
    getTodaySchedule,
    getNextPrayer,
}