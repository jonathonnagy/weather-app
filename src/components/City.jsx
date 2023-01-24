import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const City = () => {
  const navigate = useNavigate();
  const { cityName } = useParams();
  const [cityData, setCityData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");

  const icon = cityData.weather?.map((e) => e.icon);

  console.log(cityData);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=c3189249f4afdf526538f6f3f81e3750&units=metric`
      )
      .then((response) => {
        setCityData(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setError(error.response.data.message);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&cnt=16&appid=c3189249f4afdf526538f6f3f81e3750&units=metric`
      )
      .then((response) => {
        setForecastData(response.data);
      });
  },[cityName]);

  return (
    <>
      {error ? (
        <div className="w-full h-screen bg-slate-500 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">
            {error.toUpperCase()}
            {"... :("}
          </h1>
          <button
            className="sm:absolute sm:left-1 sm:top-1 m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => navigate("/")}
          >
            {<ArrowBackIcon />} Back
          </button>
        </div>
      ) : (
        <div className="relative w-full p-5 md:p-0 md:h-screen bg-slate-500 flex items-center flex-col md:overflow-hidden">
          <div className="md:absolute md:top-28 bg-slate-300 rounded-xl my-3 md:py-20 md:px-40">
            <h1 className="font-bold text-center text-3xl">
              This is {cityData.name}'s forecast!
            </h1>
            <div className="flex flex-col  items-center">
              <div className="bg-gray-500 rounded-2xl mt-9 px-24 py-8">
                <div className="flex justify-center items-center">
                  <p className="font-bold text-3xl">
                    {Math.round(cityData.main?.temp)}°C
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                    alt=""
                  />
                </div>
                {cityData.weather?.map((e) => (
                  <p className="font-bold text-center">{e.description}</p>
                ))}
              </div>
              <div className="mt-10 space-y-5">
                <p>
                  <b>Feels like:</b> {Math.round(cityData.main?.feels_like)} °C
                </p>
                <p>
                  <b>Humidity:</b> {cityData.main?.humidity} %
                </p>
                <p>
                  <b>Pressure:</b> {cityData.main?.pressure} hPa
                </p>
                <p>
                  <b>Max temp:</b> {Math.round(cityData.main?.temp_max)} °C
                </p>
                <p>
                  <b>Min temp:</b> {Math.round(cityData.main?.temp_min)} °C
                </p>
              </div>
            </div>
          </div>

          <button
            className="sm:absolute sm:left-1 sm:top-1 m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => navigate("/")}
          >
            {<ArrowBackIcon />}
          </button>

          <h2 className="md:absolute md:bottom-96 text-3xl font-bold">
            Forecast for 16 days:
          </h2>
          <div className="md:absolute md:bottom-10 md:flex md:m-5 md:w-full md:overflow-scroll">
            {forecastData.list?.map((day) => (
              <div className="relative bg-slate-300 rounded-xl p-2 my-3 m-5">
                <img
                  className="absolute top-0 right-0"
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt=""
                />
                <div className="flex justify-center">
                  <h2 className="m-2 ">
                    <b>
                      <u>
                        {new Date(day.dt * 1000).toISOString().split("T")[0]}
                      </u>
                    </b>
                  </h2>
                </div>
                <div key={day.dt} className="flex flex-col sm:flex-row">
                  <div className="w-52 flex flex-col justify-center pl-14">
                    <p>
                      <b>Day:</b> {Math.round(day.temp.day)}°C
                    </p>
                    <p>
                      <b>Min temp:</b> {Math.round(day.temp.min)}°C
                    </p>
                    <p>
                      <b>Max temp:</b> {Math.round(day.temp.max)}°C
                    </p>
                    <p>
                      <b>Pressure:</b> {day.pressure} hPa
                    </p>
                    <p>
                      <b>Humidity:</b> {day.humidity}%
                    </p>
                    <p>
                      <b>Expected:</b> {day.weather[0].description}
                    </p>
                  </div>
                  <div className="forecast-chart relative left-10">
                    <VictoryChart domainPadding={50} width={300}>
                      <VictoryAxis dependentAxis tickFormat={(x) => `${x}°C`} />
                      <VictoryBar
                        style={{
                          data: {
                            fill: ({ datum }) =>
                              datum.temp > 0 ? "#EA633F" : "#3461eb",
                          },
                          labels: {
                            fontSize: 15,
                            fill: ({ datum }) =>
                              datum.temp > 0 ? "#EA633F" : "#3461eb",
                          },
                        }}
                        categories={{
                          x: ["min", "max", ".", "."],
                        }}
                        data={[
                          { minMax: 1, temp: Math.round(day.temp.min) },
                          { minMax: 2, temp: Math.round(day.temp.max) },
                        ]}
                        // data accessor for x values
                        x="minMax"
                        // data accessor for y values
                        y="temp"
                        labels={({ datum }) => `${datum.temp}°C`}
                      />
                    </VictoryChart>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default City;
