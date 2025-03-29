import { useState, useEffect } from "react";
import axios from "axios";

export default function WeatherLandingPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      setWeather(response.data);
      fetchHistory();
    } catch (error) {
      alert("City not found or API error");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/history");
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Weather App</h1>
      <div className="flex gap-4">
        <input
          type="text"
          className="px-4 py-2 rounded-lg text-black"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-white text-blue-600 rounded-lg font-bold"
          onClick={fetchWeather}
        >
          Get Weather
        </button>
      </div>
      {weather && (
        <div className="mt-6 bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">{weather.city}, {weather.country}</h2>
          <p className="text-lg">{weather.description}</p>
          <p className="text-xl font-bold">{weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} m/s</p>
        </div>
      )}
      <div className="mt-8 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Search History</h3>
        <ul className="bg-white text-black p-4 rounded-lg shadow-lg">
          {history.map((item, index) => (
            <li key={index} className="border-b last:border-none py-2">
              {item.city}, {item.country} - {item.temperature}°C
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
