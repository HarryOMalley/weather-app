import React, { useState, useEffect } from 'react'
import WeatherWidget from './WeatherWidget'
import Day from './components/Day'
import Week from './components/Week'
import WeatherAPI, { WeatherData, Location } from './utils/api'

const App: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData>();
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [city, setCity] = useState<string>('Manchester'); // Example for string type
  const [country, setCountry] = useState<string>('GB'); // Example for string type
  const [state, setState] = useState<string>(''); // Example for string type
  const [units, setUnits] = useState<string>('metric'); // Example for string type
  const [location, setLocation] = useState<Location>(); // Example for string type

  const api = new WeatherAPI();

  const getWeather = async () => {

    if (!location) return;

    const response = await api.getWeather(location, units);
    setCurrentWeather(response);
  }

  const getForecast = async () => {
    if (!location) return;
    const response = await api.getDailyForecast(location, units);
    setForecast(response);
  }


  useEffect(() => {
    console.log("Getting location");

    api.getLocation(city, country, state).then((response) => {
      console.log(response);
      setLocation(response[0]);
    });
  }, [city, state, country]);

  useEffect(() => {
    console.log("Setting up weather fetching routines for location", location);
    if (!api) return;

    getWeather();
    getForecast();

    const interval = setInterval(() => {
      getWeather()
        .catch((err) => {
          console.error(err);
        });

      getForecast()
        .catch((err) => {
          console.error(err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [location, units]);

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
  //       <p>{error}</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex items-center justify-evenly h-screen bg-gradient-to-r from-blue-950 to-gray-900 text-white">

        <div className="w-1/2">
          {currentWeather && <WeatherWidget weather={currentWeather} />}
        </div>
        <div className="w-1/2">
          {forecast && <Week weather={forecast} />}
        </div>

      </div>
    </>

  )
}

export default App;
