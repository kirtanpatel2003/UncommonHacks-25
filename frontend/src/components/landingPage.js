import { useState, useEffect } from "react"
import axios from "axios"
import { Heart } from 'lucide-react'
import TemperatureGraph from "./temperatureGraph"
import "./landingPage.css"
import WeatherMap from "./WeatherMap"

export default function WeatherLandingPage() {
  const [weather, setWeather] = useState(null)
  const [hourlyData, setHourlyData] = useState([]) // CHANGED: Store forecast data here
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleLogin = async () => {
    try {
      // const res = await axios.post("http://localhost:5012/api/login", { email, password })
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { email, password })

      console.log("Response from backend:", res.data) // Add this log

      if (res.data.success) {
        localStorage.setItem("email", res.data.email)
        localStorage.setItem("arduinoId", res.data.arduinoId)
        window.location.href = "/home"
      } else {
        alert("Invalid credentials") // Only show this if success is false
      }
    } catch (err) {
      console.error("Error during login:", err)
      alert("Login failed due to a network or server error")
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  useEffect(() => {
    if (weather?.coord) {
      fetchHourlyForecast(weather.coord.lat, weather.coord.lon)
    }
  }, [weather])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log("Latitude:", position.coords.latitude)
          console.log("Longitude:", position.coords.longitude)
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            console.warn("User denied location access.")
          } else {
            console.error("Geolocation error:", error.message)
          }
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }, [])

  const fetchWeather = async () => {
    console.log("fetchWeather called")
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log("Geolocation coordinates:", latitude, longitude)

        try {
          // 1) Fetch Current Weather
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
          console.log("Weather API URL:", weatherUrl)
          const weatherRes = await axios.get(weatherUrl)
          const data = weatherRes.data
          console.log("Fetched weather data:", data)

          // 2) Fetch Air Pollution
          const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
          console.log("Air Quality API URL:", airQualityUrl)
          const airQualityResponse = await axios.get(airQualityUrl)
          const airQualityData = airQualityResponse.data
          console.log("Fetched air quality data:", airQualityData)

          // Extract air quality components
          const components = airQualityData?.list?.[0]?.components || {}

          setWeather({
            city: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            temperature: data.main.temp,  // in Kelvin by default if you don't add &units=metric
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            coord: { lat: latitude, lon: longitude },
            airQuality: {
              co: { value: components.co, unit: "μg/m³" },
              no: { value: components.no, unit: "μg/m³" },
              no2: { value: components.no2, unit: "μg/m³" },
              o3: { value: components.o3, unit: "μg/m³" },
              so2: { value: components.so2, unit: "μg/m³" },
              pm2_5: { value: components.pm2_5, unit: "μg/m³" },
              pm10: { value: components.pm10, unit: "μg/m³" },
              nh3: { value: components.nh3, unit: "μg/m³" },
            },
          })
        } catch (err) {
          console.error("Weather data fetch error:", err)
          setError("Weather data fetch error")
        } finally {
          setIsLoading(false)
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError)
        setError("Unable to access your location. Please allow location access.")
        setIsLoading(false)
      },
    )
  }

  // CHANGED: Fetch the 5 day / 3 hour forecast 
  // so we have an array of ~40 data points for next 5 days in 3-hour increments
  const fetchHourlyForecast = async (lat, lon) => {
    try {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      console.log("Forecast URL:", forecastUrl)
      const forecastRes = await axios.get(forecastUrl)
      console.log("Fetched forecast data:", forecastRes.data)

      setHourlyData(forecastRes.data.list || [])
    } catch (err) {
      console.error("Error fetching hourly forecast:", err)
      setError("Error fetching hourly forecast data")
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <img src="/WEATHER.png" alt="WeatherGenie Logo" className="logo-image" />
        </div>
        <nav className="main-nav">
          <ul>
            <li className="sign-in-btn" onClick={() => setShowLogin(true)}>Sign In</li>
          </ul>
        </nav>
      </header>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading your location and weather...</div>}

      {/* Show current weather and air quality */}
      {weather && (
        <div className="main-content">
          <div className="metrics-container">
            <div className="city-header">
              <h2>
                {weather.city}, {weather.country}
              </h2>
              <div className="aqi-badge">AQI: 2/5</div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">CO</div>
                <div className="metric-value">{weather.airQuality.co.value}</div>
                <div className="metric-unit">{weather.airQuality.co.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">NO</div>
                <div className="metric-value">{weather.airQuality.no.value}</div>
                <div className="metric-unit">{weather.airQuality.no.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">NO2</div>
                <div className="metric-value">{weather.airQuality.no2.value}</div>
                <div className="metric-unit">{weather.airQuality.no2.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">O3</div>
                <div className="metric-value">{weather.airQuality.o3.value}</div>
                <div className="metric-unit">{weather.airQuality.o3.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">SO2</div>
                <div className="metric-value">{weather.airQuality.so2.value}</div>
                <div className="metric-unit">{weather.airQuality.so2.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">PM2.5</div>
                <div className="metric-value">{weather.airQuality.pm2_5.value}</div>
                <div className="metric-unit">{weather.airQuality.pm2_5.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">PM10</div>
                <div className="metric-value">{weather.airQuality.pm10.value}</div>
                <div className="metric-unit">{weather.airQuality.pm10.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">NH3</div>
                <div className="metric-value">{weather.airQuality.nh3.value}</div>
                <div className="metric-unit">{weather.airQuality.nh3.unit}</div>
              </div>
            </div>
          </div>

          <div className="map-container">
            {/* CHANGED: Now showing the location map with a single marker */}
            {weather.coord ? (
              <div style={{ width: "100%", height: "400px" }}>
                <WeatherMap
                  lat={weather.coord.lat} // CHANGED
                  lon={weather.coord.lon} // CHANGED
                />
              </div>
            ) : (
              <div className="map-placeholder">
                <div className="map-city-label">{weather.city}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHANGED: Render the Recharts line graph with hourly data from forecast */}
      {hourlyData.length > 0 && (
        <div className="history-chart-container">
          <TemperatureGraph data={hourlyData} />
        </div>
      )}

      {showLogin && (
        <div className="popup-overlay">
          <div className="login-popup">
            <h3>Sign In</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>
          Made with <Heart className="heart-icon" size={18} /> by team WeatherGenie
        </p>
      </footer>
    </div>
  )
}
