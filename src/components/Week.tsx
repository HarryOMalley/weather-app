
import React from 'react';
import Day from './Day';
import { Weather } from '../utils/api';

const Week = ({ weather }: { weather: Weather[] }) => {

  console.log(weather);

  return (
    <div className="grid grid-cols-3 justify-center gap-4">
      {weather.map((day, index) => (
        <Day key={index} day={day.date} temp={day.temp} conditions={day.conditions} />
      ))}
    </div>
  );


};

export default Week;

