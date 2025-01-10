import { saveCache, getCache } from "./ramadan-cache.js";
import fetch from "node-fetch";

// Cache object to store API responses
const cache = getCache();
/**
 * Function to check if a given date is during Ramadan for a specific location.
 * @param {string} date - Date in DD-MM-YYYY format.
 * @param {string} city - Name of the city.
 * @param {string} country - Name of the country.
 * @returns {Promise<boolean>} - Resolves to true if the date is during Ramadan, false otherwise.
 */
export async function isRamadan(date, city="Dhaka", country="BD") {
    // Validate date format
    if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        throw new Error(`Invalid date format. Use DD-MM-YYYY. Provided: ${date}`);
    }

    // Extract month and year for API request
    const [day, month, year] = date.split("-");
    const cacheKey = `${year}-${month}-${day}-${city}-${country}`.toLowerCase();

    // Check cache
    if (typeof cache[cacheKey] !== "undefined" || cache[cacheKey] !== null) {
        return cache[cacheKey]
    }

    try {
        // Build API endpoint URL
        const apiUrl = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
        console.log("MAKING API CALL!!")
        // Fetch data from API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Find the specific date in the API response
        const entry = data.data.find((d) => d.date.gregorian.date === date);
        if (!entry) {
            throw new Error("Date not found in API response.");
        }

        // Extract Hijri month
        const hijriMonth = entry.date.hijri.month.number;

        // Ramadan is the 9th month of the Islamic calendar
        const isRamadan = hijriMonth === 9;

        // Cache the result
        cache[cacheKey] = isRamadan;
        console.log("saving cache");
        saveCache(cache);

        return isRamadan;
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        throw new Error("Could not determine if the date is during Ramadan.");
    }
}