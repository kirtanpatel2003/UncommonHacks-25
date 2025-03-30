import { useState, useEffect } from "react"
import axios from "axios"
import { Heart, Search } from "lucide-react"
import "./home.css"

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [citySearchQuery, setCitySeachQuery] = useState("")

  useEffect(() => {
    // Load weather data for user's current location on component mount
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
        humidity: weatherResponseData.main.humidity,
        windSpeed: weatherResponseData.wind.speed,
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

  return (
    <div className="app-container premium">
      <header className="app-header">
        <div className="logo">
          <img src="/WEATHER.png" alt="WeatherGenie Logo" className="logo-image" />
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search any city..."
            value={citySearchQuery}
            onChange={(e) => setCitySeachQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <button className="search-button" onClick={handleSearchSubmit} disabled={isLoadingData}>
            <Search size={18} />
          </button>
        </div>
        <nav className="main-nav">
          <ul>
            <li className="active">Dashboard</li>
            <li>Graphs</li>
            <li>Device</li>
            <li className="user-profile">My Account</li>
          </ul>
        </nav>
      </header>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoadingData && <div className="loading-message">Loading weather data...</div>}

      {weatherData && (
        <div className="main-content">
          <div className="metrics-container">
            <div className="city-header">
              <h2>
                {weatherData.city}, {weatherData.country}
              </h2>
              <div className="aqi-badge">AQI: {weatherData.aqi}/5</div> 
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">CO</div>
                <div className="metric-value">{weatherData.airQuality.co.value}</div>
                <div className="metric-unit">{weatherData.airQuality.co.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">NO</div>
                <div className="metric-value">{weatherData.airQuality.no.value}</div>
                <div className="metric-unit">{weatherData.airQuality.no.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">NO2</div>
                <div className="metric-value">{weatherData.airQuality.no2.value}</div>
                <div className="metric-unit">{weatherData.airQuality.no2.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">O3</div>
                <div className="metric-value">{weatherData.airQuality.o3.value}</div>
                <div className="metric-unit">{weatherData.airQuality.o3.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">SO2</div>
                <div className="metric-value">{weatherData.airQuality.so2.value}</div>
                <div className="metric-unit">{weatherData.airQuality.so2.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">PM2.5</div>
                <div className="metric-value">{weatherData.airQuality.pm2_5.value}</div>
                <div className="metric-unit">{weatherData.airQuality.pm2_5.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">PM10</div>
                <div className="metric-value">{weatherData.airQuality.pm10.value}</div>
                <div className="metric-unit">{weatherData.airQuality.pm10.unit}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">NH3</div>
                <div className="metric-value">{weatherData.airQuality.nh3.value}</div>
                <div className="metric-unit">{weatherData.airQuality.nh3.unit}</div>
              </div>
            </div>
          </div>

          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-city-label">{weatherData.city}</div>
            </div>
          </div>
        </div>
      )}

      <div className="forecast-container">
        <h3>5-Day Forecast</h3>
        <div className="forecast-cards">
          {weatherData &&
            weatherData.forecast &&
            weatherData.forecast.map((item, index) => (
              <div className="forecast-card" key={index}>
                <div className="forecast-date">{new Date(item.dt * 1000).toLocaleDateString()}</div>
                <div className="forecast-temp">{item.main.temp.toFixed(1)}°C</div>
                <div className="forecast-desc">{item.weather[0].description}</div>
              </div>
            ))}
        </div>
      </div>

      <footer className="app-footer">
        <p>
          Made with <Heart className="heart-icon" size={18} /> by team WeatherGenie
        </p>
      </footer>
    </div>
  )
}
