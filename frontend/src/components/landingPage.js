import { useState, useEffect } from "react";
import axios from "axios";

export default function WeatherLandingPage() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    console.log("fetchWeather called");
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Geolocation coordinates:", latitude, longitude);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`;
        console.log("Weather API URL:", url);
        try {
          const response = await axios.get(url);
          const data = response.data;
          console.log("Fetched weather data:", data);
          console.log("setWeather called");
          setWeather({
            city: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
          });
        } catch (error) {
          console.error("Weather data fetch error:", error);
          alert("Weather data fetch error");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to access your location. Please allow location access.");
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Weather App</h1>
      {!weather && <p>Loading your location and weather...</p>}
      {weather && (
        <div className="mt-6 bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">{weather.city}, {weather.country}</h2>
          <p className="text-lg">{weather.description}</p>
          <p className="text-xl font-bold">{weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} m/s</p>
        </div>
      )}
    </div>
  );
}
