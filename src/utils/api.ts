import getWeatherIcon from "../components/icons";

/// set api key
const apiKey = ""

export interface DateSummary {
  date: Date;
  day: number;
  weekday: string;
  month: string;
  year: number;
  hour: number;
  minute: number;
  seconds: number;
}

export interface Sun {
  rise: Date;
  set: Date;
}

export interface Temperature {
  average: number;
  feels_like: number;
  min: number;
  max: number;
  kf: number;
  units: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  percentage: number;
}

export interface Pressure {
  value: number;
  unit: string;
}

export interface Humidity {
  value: number;
  unit: string;
}

export interface Conditions {
  summary: string;
  description: string;
  icon: Object;
}

export interface Location {
  lat: number;
  lon: number;
  city: string;
  state: string;
  country: string;
}

export interface Weather {
  date: DateSummary;
  location: Location;
  sun?: Sun;
  temp: Temperature;
  wind: Wind;
  clouds: Clouds;
  pressure: Pressure;
  humidity: Humidity;
  conditions: Conditions;
}


class WeatherAPI {

  constructor() {
  }

  async getLocation(city: string, country: string, state?: string): Promise<Location[]> {
    const locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=10&appid=${apiKey}`;
    let resp = await fetch(locationUrl);
    let data = await resp.json();
    console.log(data);

    return data.map((entry: any) => {
      return this.parseLocation(entry);

    });
  }

  parseLocation(data: any): Location {
    return {
      lat: data.lat,
      lon: data.lon,
      city: data.name,
      state: data.state,
      country: data.country,
    };
  }

  parseDate(dt: number): DateSummary {

    let date = new Date(dt * 1000);

    return {
      date: date,
      day: date.getDate(),
      weekday: date.toLocaleDateString(undefined, { weekday: "long" }),
      month: date.toLocaleDateString(undefined, { month: "short" }),
      year: date.getFullYear(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      seconds: date.getSeconds(),
    };

  }

  parseSun(data: any): Sun | null {

    if (!data.sunrise || !data.sunset) return null;

    return {
      rise: new Date(data.sunrise * 1000),
      set: new Date(data.sunset * 1000),
    };
  }

  parseTemp(data: any): Temperature {
    return {
      average: Math.round(data.temp),
      feels_like: Math.round(data.feels_like),
      min: Math.round(data.temp_min),
      max: Math.round(data.temp_max),
      kf: data.kf,
      units: "C",
    };
  }

  parseWind(data: any): Wind {
    return {
      speed: data.speed,
      deg: data.deg,
      gust: data.gust,
    };
  }

  parseClouds(data: any): Clouds {
    return {
      percentage: data.all,
    };
  }

  parsePressure(data: any): Pressure {
    return {
      value: data.pressure,
      unit: "hPa",
    };
  }

  parseHumidity(data: any): Humidity {
    return {
      value: data.humidity,
      unit: "%",
    };
  }

  parseConditions(data: any): Conditions {
    return {
      summary: data.main,
      description: this.capitalize(data.description),
      icon: getWeatherIcon(data.id),
    };
  }


  parseWeather(location: Location, data: any): Weather {
    let date = this.parseDate(data.dt);

    let sun = this.parseSun(data.sys);
    let temp = this.parseTemp(data.main);
    let wind = this.parseWind(data.wind);
    let clouds = this.parseClouds(data.clouds);
    let pressure = this.parsePressure(data.main);
    let humidity = this.parseHumidity(data.main);
    let conditions = this.parseConditions(data.weather[0]);

    let weather: Weather = {
      date: date,
      location: location,
      temp: temp,
      wind: wind,
      clouds: clouds,
      pressure: pressure,
      humidity: humidity,
      conditions: conditions,
    }

    if (sun) weather.sun = sun;

    return weather;
  }

  capitalize(string: string): string {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getWeather(location: Location, units: string = "metric"): Promise<Weather> {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${apiKey}`;

    let resp = await fetch(weatherApiUrl);
    let data = await resp.json();
    const weather: Weather = this.parseWeather(location, data);
    console.log("Current weather", weather);
    return weather;
  }

  async getLongForecast(location: Location, days: number = 7, units: string = "metric"): Promise<Weather[]> {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location.lat}&lon=${location.lon}&cnt=${days}&units=${units}&appid=${apiKey}`

    let resp = await fetch(forecastApiUrl);
    let data = await resp.json();

    let weather: Weather[] = data.list.map((entry: any): Weather => {
      return this.parseWeather(location, entry);
    });

    console.log("Long forecast", weather);

    return weather;
  }


  async getForecast(location: Location, units: string = "metric"): Promise<Weather[]> {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${apiKey}`;

    let resp = await fetch(forecastApiUrl);
    let data = await resp.json();

    let weather: Weather[] = data.list.map((entry: any): Weather => {
      return this.parseWeather(location, entry)
    });
    console.log("3 hour forecast", weather);
    return weather;
  }

  async getDailyForecast(location: Location, units: string = "metric"): Promise<Weather[]> {
    let data = await this.getForecast(location, units);

    const daily: Weather[] = [];
    // loop through and make sure there is 1 entry per day, preferably at noon
    data.forEach((entry) => {
      // ignore any entries for today that are not at noon
      //if (entry.date.day === new Date().getDate() && entry.date.hour !== 12) return;
      // if it is today, set the weekday to "Today"
      if (entry.date.day === new Date().getDate()) {
        entry.date.weekday = "Today";
      }

      const day = entry.date.day;
      const existingEntry = daily.find((item) => item.date.day === day);

      if (existingEntry) {
        if (existingEntry.date.hour === 12) return;
        if (entry.date.hour === 12 || entry.date.hour > existingEntry.date.hour) {
          const index = daily.indexOf(existingEntry);
          daily[index] = entry;
        }
      } else {
        daily.push(entry);
      }
    });

    console.log("Daily forecast", daily);

    return daily;
  }
}

export default WeatherAPI;
