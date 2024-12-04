import thunderstormsDay from "./icons/thunderstorms-day.svg";
import thunderstormsNight from "./icons/thunderstorms-night.svg";
import thunderstormsDayExtremeRain from "./icons/thunderstorms-day-extreme-rain.svg";
import drizzle from "./icons/drizzle.svg";
import partlyCloudyDayDrizzle from "./icons/partly-cloudy-day-drizzle.svg";
import overcastDayDrizzle from "./icons/overcast-day-drizzle.svg";
import partlyCloudyDayRain from "./icons/partly-cloudy-day-rain.svg";
import rain from "./icons/rain.svg";
import overcastRain from "./icons/overcast-rain.svg";
import sleet from "./icons/sleet.svg";
import snow from "./icons/snow.svg";
import mist from "./icons/mist.svg";
import smoke from "./icons/smoke.svg";
import hazeDay from "./icons/haze-day.svg";
import dustDay from "./icons/dust-day.svg";
import fogDay from "./icons/fog-day.svg";
import windAlert from "./icons/wind-alert.svg";
import tornado from "./icons/tornado.svg";
import clearDay from "./icons/clear-day.svg";
import clearNight from "./icons/clear-night.svg";
import partlyCloudyDay from "./icons/partly-cloudy-day.svg";
import partlyCloudyNight from "./icons/partly-cloudy-night.svg";
import cloudy from "./icons/cloudy.svg";
import overcast from "./icons/overcast.svg";
import notAvailable from "./icons/not-available.svg";
const weatherIconMap = {
  // Group 2xx: Thunderstorm
  200: thunderstormsDay,
  201: thunderstormsDay,
  202: thunderstormsDayExtremeRain,
  210: thunderstormsDay,
  211: thunderstormsDay,
  212: thunderstormsDayExtremeRain,
  221: thunderstormsDayExtremeRain,
  230: thunderstormsDay,
  231: thunderstormsDay,
  232: thunderstormsDayExtremeRain,

  // Group 3xx: Drizzle
  300: drizzle,
  301: drizzle,
  302: drizzle,
  310: partlyCloudyDayDrizzle,
  311: overcastDayDrizzle,
  312: overcastDayDrizzle,
  313: partlyCloudyDayDrizzle,
  314: overcastDayDrizzle,
  321: partlyCloudyDayDrizzle,

  // Group 5xx: Rain
  500: partlyCloudyDayRain,
  501: rain,
  502: rain,
  503: overcastRain,
  504: overcastRain,
  511: sleet,
  520: partlyCloudyDayDrizzle,
  521: rain,
  522: rain,
  531: overcastRain,

  // Group 6xx: Snow
  600: partlyCloudyDayRain,
  601: snow,
  602: snow,
  611: sleet,
  612: sleet,
  613: sleet,
  615: snow,
  616: sleet,
  620: partlyCloudyDayRain,
  621: snow,
  622: snow,

  // Group 7xx: Atmosphere
  701: mist,
  711: smoke,
  721: hazeDay,
  731: dustDay,
  741: fogDay,
  751: dustDay,
  761: dustDay,
  762: dustDay,
  771: windAlert,
  781: tornado,

  // Group 800: Clear
  800: {
    day: clearDay,
    night: clearNight,
  },

  // Group 80x: Clouds
  801: {
    day: partlyCloudyDay,
    night: partlyCloudyNight,
  },
  802: {
    day: partlyCloudyDay,
    night: partlyCloudyNight,
  },
  803: cloudy,
  804: overcast,

  // Default (fallback)
  default: notAvailable,
};


/**
 * Get the icon for a given weather code and time of day.
 * @param {number} code - The OpenWeatherMap weather condition code.
 * @param {string} timeOfDay - "day" or "night".
 * @returns {string} - The imported SVG icon.
 */
function getWeatherIcon(code, timeOfDay = "day") {
  const icon = weatherIconMap[code];

  if (!icon) {
    return weatherIconMap.default; // Fallback icon if code is not mapped
  }

  if (typeof icon === "object") {
    // Return day or night icon for codes with time-specific variations
    return icon[timeOfDay] || weatherIconMap.default;
  }

  return icon;
}

export default getWeatherIcon;
