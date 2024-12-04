import React from "react"

import { DateSummary, Temperature, Conditions } from "../utils/api.js";


const Day = ({ day, temp, conditions }: { day: DateSummary, temp: Temperature, conditions: Conditions }) => {

  return (
    <>
      <div className="flex w-full h-full flex-col items-center justify-between pt-4 pb-4">
        <h1 className="text-xl font-semibold">{temp.average}º</h1>
        <img src={conditions.icon} className="w-1/2" />
        <h1 className="text-xl">{day.weekday}</h1>
      </div>
    </>
  );
}

export default Day;
