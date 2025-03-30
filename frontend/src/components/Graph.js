import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import "./Graph.css";

// Custom tooltip for Temperature chart
const TemperatureTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const isPredicted = data.day && data.day !== new Date().toLocaleDateString();

  return (
    <div className="custom-tooltip">
      {isPredicted ? (
        <p>Predicted Temperature: {Math.round(data.temperature)} °C</p>
      ) : (
        <p>Temperature: {Math.round(data.temperature)} °C</p>
      )}
    </div>
  );
};

// Custom tooltip for Humidity chart
const HumidityTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const isPredicted = data.day && data.day !== new Date().toLocaleDateString();

  return (
    <div className="custom-tooltip">
      {isPredicted ? (
        <p>Predicted Humidity: {Math.round(data.humidity)}</p>
      ) : (
        <p>Humidity: {Math.round(data.humidity)}</p>
      )}
    </div>
  );
};

const Graph = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [todayDetails, setTodayDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const response = await axios.get(url);
      const data = response.data.list;

      const formattedData = [];
      const predictedDataArr = [];

      for (let i = 0; i < 5; i++) {
        const dailyData = data.slice(i * 8, (i + 1) * 8);
        const dayData = {
          day: new Date(dailyData[0].dt * 1000).toLocaleDateString(),
          temperature:
            dailyData.reduce((acc, curr) => acc + (curr.main.temp - 273.15), 0) /
            dailyData.length,
          humidity:
            dailyData.reduce((acc, curr) => acc + curr.main.humidity, 0) /
            dailyData.length,
          details: dailyData.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString(),
            temperature: item.main.temp - 273.15,
            humidity: item.main.humidity,
            weather: item.weather[0].description,
          })),
        };

        if (i < 2) {
          formattedData.push(dayData);
        } else {
          predictedDataArr.push(dayData);
        }

        if (i === 0) {
          setTodayDetails(dayData.details);
        }
      }

      setWeatherData(formattedData);
      setPredictedData(predictedDataArr);
    } catch (error) {
      setError("Error fetching weather data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData();
    }
  }, [lat, lon]);

  return (
    <div className="graph-container">
      {isLoading && <p>Loading data...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <div>
          <h3>Time vs Temperature</h3>
          <ResponsiveContainer width="80%" height={400}>
            <LineChart data={[...weatherData, ...predictedData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day">
                <Label value="Days" offset={0} position="bottom" />
              </XAxis>
              <YAxis>
                <Label
                  value="Temperature (°C)"
                  angle={-90}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={<TemperatureTooltip />} />
              <Legend />
              <Line
                className="recharts-line-temperature"
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                strokeWidth={3}
              />
              {predictedData.length > 0 && (
                <Line
                  className="recharts-line-predicted"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff7300"
                  strokeWidth={3}
                  dot={false}
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          <h3>Time vs Humidity</h3>
          <ResponsiveContainer width="80%" height={400}>
            <LineChart data={[...weatherData, ...predictedData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day">
                <Label value="Days" offset={0} position="bottom" />
              </XAxis>
              <YAxis>
                <Label
                  value="Humidity (%)"
                  angle={-90}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={<HumidityTooltip />} />
              <Legend />
              <Line
                className="recharts-line-humidity"
                type="monotone"
                dataKey="humidity"
                stroke="#82ca9d"
                strokeWidth={3}
              />
              {predictedData.length > 0 && (
                <Line
                  className="recharts-line-predicted"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#ffb6c1"
                  strokeWidth={3}
                  dot={false}
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Graph;