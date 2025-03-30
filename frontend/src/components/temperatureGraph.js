// temperatureGraph.jsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// This logic expects Kelvin by default. If you fetch in Kelvin, keep these; 
// if you fetch in Metric, you can skip conversions or adapt them.
const kelvinToCelsius = (temp) => temp ? (temp - 273.15).toFixed(2) : 0;
const kelvinToFahrenheit = (temp) => temp ? ((temp - 273.15) * 9/5 + 32).toFixed(2) : 0;

const TemperatureGraph = ({ data }) => {
  const [unit, setUnit] = useState("C"); // Default to Celsius

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>⚠️ No temperature data available.</p>;
  }

  // For the old code, you might be doing dt_txt splits, etc.
  // We'll assume your data items look like: { dt_txt, main: { temp: <Kelvin> } }
  // If you’re fetching in Kelvin, keep the conversions. If you’re fetching in metric,
  // remove the conversions or adapt them.
  const minTemp = Math.min(...data.map(entry => 
    unit === "C"
      ? kelvinToCelsius(entry.main?.temp)
      : kelvinToFahrenheit(entry.main?.temp)
  ));
  const maxTemp = Math.max(...data.map(entry => 
    unit === "C"
      ? kelvinToCelsius(entry.main?.temp)
      : kelvinToFahrenheit(entry.main?.temp)
  ));

  // Build chart data
  const chartData = data.map(entry => ({
    // Example: split dt_txt into [date, time]
    // "2023-09-01 15:00:00" => "15:00:00"
    time: entry.dt_txt ? entry.dt_txt.split(' ')[1] : "N/A",
    Temperature: parseFloat(
      unit === "C"
        ? kelvinToCelsius(entry.main?.temp)
        : kelvinToFahrenheit(entry.main?.temp)
    )
  }));

  return (
    <div>
      <button 
        onClick={() => setUnit(unit === "C" ? "F" : "C")} 
        style={{ marginBottom: "10px", padding: "5px 10px", cursor: "pointer" }}
      >
        Switch to {unit === "C" ? "Fahrenheit (°F)" : "Celsius (°C)"}
      </button>

      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            domain={[Math.floor(minTemp) - 2, Math.ceil(maxTemp) + 2]}
            label={{
              value: unit === "C" ? "°C" : "°F",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Temperature" stroke="#ff4d4d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureGraph;
