import { schedule } from "./calendar.js";
import { adjustTime, getClosestSchedule } from "./util.js";

schedule.year = new Date().getFullYear();
import { districtData } from "./data.js";

function getDistrictAdjustments(districtName) {
  const district = districtData.districts.find((d) => d.name === districtName);
  return district ? district.adjustments : { suhoor: 0, iftar: 0 };
}

function getAdjustedSchedule(baseSchedule, adjustments) {
  const adjusted = { ...baseSchedule };
  adjusted.sehri = adjustTime(baseSchedule.sehri, adjustments.suhoor);
  adjusted.magrib_iftar = adjustTime(
    baseSchedule.magrib_iftar,
    adjustments.iftar
  );
  return adjusted;
}

export const getPrayerTimes = (date, district) => {
  const adjustments = getDistrictAdjustments(district);
  const baseSchedule = getClosestSchedule(schedule, date);
  return getAdjustedSchedule(baseSchedule.schedule, adjustments);
};
