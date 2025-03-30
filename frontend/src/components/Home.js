import { useState, useEffect } from "react"
import axios from "axios"
import { Heart, Search, Cloud, Droplets, Wind, ThermometerSun, RefreshCw, MapPin } from 'lucide-react'
import "./home.css"
import RandomQuote from "./randomQuote"

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [citySearchQuery, setCitySearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showForecast, setShowForecast] = useState(false)

  useEffect(() => {
    fetchWeatherByGeolocation()
  }, [])

  // Retrieves user's geolocation and fetches weather data for that location
  const fetchWeatherByGeolocation = async () => {
    console.log("fetchWeatherByGeolocation called")
    setIsLoadingData(true)
    setErrorMessage(null)

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported by your browser")
      setIsLoadingData(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log("Geolocation coordinates:", latitude, longitude)
        await fetchWeatherByCoordinates(latitude, longitude)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setErrorMessage("Unable to access your location. Please allow location access.")
        setIsLoadingData(false)
      },
    )
  }

  // Fetches comprehensive weather, air quality, and forecast data using geographic coordinates
  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
      console.log("Weather API URL:", weatherApiUrl)

      const weatherResponse = await axios.get(weatherApiUrl)
      const weatherResponseData = weatherResponse.data
      console.log("Fetched weather data:", weatherResponseData)

      // Construct the Air Pollution API URL
      const airQualityApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      console.log("Air Quality API URL:", airQualityApiUrl)

      // Fetch the Air Pollution data
      const airQualityResponse = await axios.get(airQualityApiUrl)
      const airQualityResponseData = airQualityResponse.data
      console.log("Fetched air quality data:", airQualityResponseData)

      // Extract AQI value (1..5) from the response
      const airQualityIndex = airQualityResponseData?.list?.[0]?.main?.aqi ?? 1

      // Extract the relevant air quality components
      const airQualityComponents = airQualityResponseData?.list?.[0]?.components || {}

      // For premium users, we'll add forecast data
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
      const forecastResponse = await axios.get(forecastApiUrl)
      const forecastResponseData = forecastResponse.data
      console.log("Fetched forecast data:", forecastResponseData)

      setWeatherData({
        city: weatherResponseData.name,
        country: weatherResponseData.sys.country,
        description: weatherResponseData.weather[0].description,
        temperature: weatherResponseData.main.temp,
        feelsLike: weatherResponseData.main.feels_like,
        humidity: weatherResponseData.main.humidity,
        windSpeed: weatherResponseData.wind.speed,
        pressure: weatherResponseData.main.pressure,
        icon: weatherResponseData.weather[0].icon,
        aqi: airQualityIndex,
        airQuality: {
          co: { value: airQualityComponents.co, unit: "μg/m³" },
          no: { value: airQualityComponents.no, unit: "μg/m³" },
          no2: { value: airQualityComponents.no2, unit: "μg/m³" },
          o3: { value: airQualityComponents.o3, unit: "μg/m³" },
          so2: { value: airQualityComponents.so2, unit: "μg/m³" },
          pm2_5: { value: airQualityComponents.pm2_5, unit: "μg/m³" },
          pm10: { value: airQualityComponents.pm10, unit: "μg/m³" },
          nh3: { value: airQualityComponents.nh3, unit: "μg/m³" },
        },
        forecast: forecastResponseData.list.slice(0, 5),
      })
    } catch (error) {
      console.error("Weather data fetch error:", error)
      setErrorMessage("Failed to fetch weather data")
    } finally {
      setIsLoadingData(false)
    }
  }

  // Searches for weather data based on city name entered by user
  const fetchWeatherByCity = async (cityName) => {
    if (!cityName) return

    setIsLoadingData(true)
    setErrorMessage(null)

    try {
      const cityWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
      console.log("Weather API URL:", cityWeatherApiUrl)

      const weatherResponse = await axios.get(cityWeatherApiUrl)
      const weatherResponseData = weatherResponse.data
      console.log("Fetched weather data:", weatherResponseData)

      // Get coordinates for air quality and forecast
      const { lat, lon } = weatherResponseData.coord
      await fetchWeatherByCoordinates(lat, lon)
    } catch (error) {
      console.error("Weather data fetch error:", error)
      setErrorMessage("City not found or API error")
      setIsLoadingData(false)
    }
  }

  // Handles form submission for city search
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchWeatherByCity(citySearchQuery)
  }

  // Handles Enter key press in the search input field
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeatherByCity(citySearchQuery)
    }
  }

  // Get AQI description based on index
  const getAqiDescription = (index) => {
    const descriptions = [
      "Good",
      "Fair",
      "Moderate",
      "Poor",
      "Very Poor"
    ]
    return descriptions[index - 1] || "Unknown"
  }

  // Get AQI color based on index
  const getAqiColor = (index) => {
    const colors = [
      "#4caf50", // Good - Green
      "#8bc34a", // Fair - Light Green
      "#ffc107", // Moderate - Yellow
      "#ff9800", // Poor - Orange
      "#f44336"  // Very Poor - Red
    ]
    return colors[index - 1] || "#9e9e9e" // Default gray
  }

  // Format date for forecast
  const formatForecastDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Format time for forecast
  const formatForecastTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="weather-dashboard-container premium">
      <header className="dashboard-header">
        <div className="brand-logo">
          <img src="/WEATHER.png" alt="WeatherGenie Logo" className="brand-logo-image" />
        </div>
        <div className="city-search-container">
          <input
            type="text"
            className="city-search-input"
            placeholder="Search any city..."
            value={citySearchQuery}
            onChange={(e) => setCitySearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <button className="city-search-button" onClick={handleSearchSubmit} disabled={isLoadingData}>
            <Search size={18} />
          </button>
        </div>
        <nav className="navigation-menu">
          <ul>
            <li 
              className={activeTab === "dashboard" ? "active" : ""} 
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </li>
            <li 
              className={activeTab === "graphs" ? "active" : ""} 
              onClick={() => setActiveTab("graphs")}
            >
              Graphs
            </li>
            <li 
              className={activeTab === "device" ? "active" : ""} 
              onClick={() => setActiveTab("device")}
            >
              Device
            </li>
            <li className="user-profile" onClick={() => {
              localStorage.removeItem("email")
              localStorage.removeItem("arduinoId")
              window.location.href = "/"
            }}>
              Logout
            </li>
          </ul>
        </nav>
      </header>

      {errorMessage && <div className="error-notification">{errorMessage}</div>}
      {isLoadingData && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {weatherData && (
        <>
<div className="current-weather-summary">
  <div className="current-weather-card">
    <div className="current-weather-header">
      <div className="location-info">
        <MapPin size={20} className="location-icon" />
        <h1 className="location-name">{weatherData.city}, {weatherData.country}</h1>
      </div>
      <div className="weather-description-badge">
        {weatherData.description}
      </div>
    </div>
    
    <div className="current-weather-content">
      <div className="weather-primary-info">
        <img 
          src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`} 
          alt={weatherData.description} 
          className="weather-icon"
        />
        <div className="temperature-container">
          <span className="temperature-value">{Math.round(weatherData.temperature)}°C</span>
          <span className="feels-like">Feels like {Math.round(weatherData.feelsLike)}°C</span>
        </div>
      </div>
      
      <div className="weather-metrics">
        <div className="weather-metric">
          <Droplets size={18} />
          <div className="metric-details">
            <span className="metric-value">{weatherData.humidity}%</span>
            <span className="metric-label">Humidity</span>
          </div>
        </div>
        
        <div className="weather-metric">
          <Wind size={18} />
          <div className="metric-details">
            <span className="metric-value">{weatherData.windSpeed.toFixed(2)}</span>
            <span className="metric-label">m/s Wind</span>
          </div>
        </div>
        
        <div className="weather-metric">
          <ThermometerSun size={18} />
          <div className="metric-details">
            <span className="metric-value">{weatherData.pressure}</span>
            <span className="metric-label">hPa</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="current-weather-footer">
      <button className="refresh-button" onClick={fetchWeatherByGeolocation}>
        <RefreshCw size={16} /> Refresh
      </button>
      <span className="last-updated">
        Updated: {new Date().toLocaleTimeString()}
      </span>
    </div>
  </div>
</div>

          <div className="weather-content">
            <div className="air-quality-metrics">
              <div className="location-header">
                <h2>Air Quality</h2>
                <div 
                  className="air-quality-badge" 
                  style={{ backgroundColor: getAqiColor(weatherData.aqi) }}
                >
                  AQI: {weatherData.aqi}/5 - {getAqiDescription(weatherData.aqi)}
                </div>
              </div>

              <div className="air-quality-grid">
                <div className="air-quality-card">
                  <div className="pollutant-label">CO</div>
                  <div className="pollutant-value">{weatherData.airQuality.co.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.co.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">NO</div>
                  <div className="pollutant-value">{weatherData.airQuality.no.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.no.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">NO2</div>
                  <div className="pollutant-value">{weatherData.airQuality.no2.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.no2.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">O3</div>
                  <div className="pollutant-value">{weatherData.airQuality.o3.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.o3.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">SO2</div>
                  <div className="pollutant-value">{weatherData.airQuality.so2.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.so2.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">PM2.5</div>
                  <div className="pollutant-value">{weatherData.airQuality.pm2_5.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.pm2_5.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">PM10</div>
                  <div className="pollutant-value">{weatherData.airQuality.pm10.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.pm10.unit}</div>
                </div>
                <div className="air-quality-card">
                  <div className="pollutant-label">NH3</div>
                  <div className="pollutant-value">{weatherData.airQuality.nh3.value.toFixed(2)}</div>
                  <div className="measurement-unit">{weatherData.airQuality.nh3.unit}</div>
                </div>
              </div>
            </div>

            <div className="location-map-container">
              <div className="location-map-placeholder">
                <Cloud size={48} className="map-icon" />
                <div className="location-map-city-label">{weatherData.city}</div>
                <p className="map-description">Interactive map coming soon</p>
              </div>
            </div>
          </div>

          <div className="forecast-toggle">
            <button 
              className="forecast-toggle-button" 
              onClick={() => setShowForecast(!showForecast)}
            >
              {showForecast ? "Hide Forecast" : "Show 3-Hour Forecast"}
            </button>
          </div>

          {showForecast && (
            <div className="forecast-section">
              <h3>3-Hour Forecast</h3>
              <div className="forecast-days-container">
                {weatherData.forecast.map((item, index) => (
                  <div className="forecast-day-card" key={index}>
                    <div className="forecast-day-date">{formatForecastDate(item.dt)}</div>
                    <div className="forecast-day-time">{formatForecastTime(item.dt)}</div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                      alt={item.weather[0].description} 
                      className="forecast-icon"
                    />
                    <div className="forecast-day-temperature">{Math.round(item.main.temp)}°C</div>
                    <div className="forecast-day-description">{item.weather[0].description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <footer className="dashboard-footer">
        <RandomQuote />
        <p>
          Made with <Heart className="heart-animation" size={18} /> by team WeatherGenie
        </p>
        
      </footer>
    </div>
  )
}