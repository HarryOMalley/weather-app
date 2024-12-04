import React, { useEffect, useState } from "react";
import { Weather } from "./utils/api";
const WeatherWidget = ({ weather }: { weather: Weather }) => {

  console.log(weather);

  return (
    <div className="flex flex-col text-center p-6 rounded-lg">
      <h1 className="text-4xl">{weather.location.city}, {weather.location.country}</h1>
      <div className="flex flex-row text-center justify-center">
        <p className="text-8xl font-bold pr-4">{weather.temp.average}º</p>

        <div className="flex flex-col pl-4 justify-center items-left">
          <p className="text-xl">{weather.date.weekday} {weather.date.day} {weather.date.month}</p>
          <p className="capitalize text-md">{weather.conditions.description}</p>
        </div>

      </div>
    </div>
  );
};

export default WeatherWidget;

