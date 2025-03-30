// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Heart } from 'lucide-react' // Added import for Heart icon
// import "./landingPage.css"

// export default function WeatherLandingPage() {
//   const [weather, setWeather] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState("temperature")

//   useEffect(() => {
//     fetchWeather()
//   }, [])

//   const fetchWeather = async () => {
//     console.log("fetchWeather called")
//     setIsLoading(true)
//     setError(null)

//     if (!navigator.geolocation) {
//       setError("Geolocation not supported")
//       setIsLoading(false)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords
//         console.log("Geolocation coordinates:", latitude, longitude)
//         const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
//         console.log("Weather API URL:", url)
//         try {
//           const response = await axios.get(url)
//           const data = response.data
//           console.log("Fetched weather data:", data)
//           console.log("setWeather called")

//           // Construct the Air Pollution API URL
//           const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
//           console.log("Air Quality API URL:", airQualityUrl)

//           // Fetch the Air Pollution data
//           const airQualityResponse = await axios.get(airQualityUrl)
//           const airQualityData = airQualityResponse.data
//           console.log("Fetched air quality data:", airQualityData)

//           // Extract the relevant air quality components
//           // (values are in μg/m³ by default in the OpenWeatherMap API)
//           const components = airQualityData?.list?.[0]?.components || {}

//           setWeather({
//             city: data.name,
//             country: data.sys.country,
//             description: data.weather[0].description,
//             temperature: data.main.temp,
//             humidity: data.main.humidity,
//             windSpeed: data.wind.speed,
//             airQuality: {
//               co: { value: components.co, unit: "μg/m³" },
//               no: { value: components.no, unit: "μg/m³" },
//               no2: { value: components.no2, unit: "μg/m³" },
//               o3: { value: components.o3, unit: "μg/m³" },
//               so2: { value: components.so2, unit: "μg/m³" },
//               pm2_5: { value: components.pm2_5, unit: "μg/m³" },
//               pm10: { value: components.pm10, unit: "μg/m³" },
//               nh3: { value: components.nh3, unit: "μg/m³" },
//             },
//           })
//         } catch (error) {
//           console.error("Weather data fetch error:", error)
//           setError("Weather data fetch error")
//         } finally {
//           setIsLoading(false)
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error)
//         setError("Unable to access your location. Please allow location access.")
//         setIsLoading(false)
//       },
//     )
//   }

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <div className="logo">WeatherGenie</div>
//         <nav className="main-nav">
//           <ul>
//             <li>Learn More</li>
//             <li className="sign-in-btn">Sign In</li>
//           </ul>
//         </nav>
//       </header>

//       {error && <div className="error-message">{error}</div>}
//       {isLoading && <div className="loading-message">Loading your location and weather...</div>}

//       {weather && (
//         <div className="main-content">
//           <div className="metrics-container">
//             <div className="city-header">
//               <h2>
//                 {weather.city}, {weather.country}
//               </h2>
//               <div className="aqi-badge">AQI: 2/5</div>
//             </div>

//             <div className="metrics-grid">
//               <div className="metric-card">
//                 <div className="metric-label">CO</div>
//                 <div className="metric-value">{weather.airQuality.co.value}</div>
//                 <div className="metric-unit">{weather.airQuality.co.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">NO</div>
//                 <div className="metric-value">{weather.airQuality.no.value}</div>
//                 <div className="metric-unit">{weather.airQuality.no.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">NO2</div>
//                 <div className="metric-value">{weather.airQuality.no2.value}</div>
//                 <div className="metric-unit">{weather.airQuality.no2.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">O3</div>
//                 <div className="metric-value">{weather.airQuality.o3.value}</div>
//                 <div className="metric-unit">{weather.airQuality.o3.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">SO2</div>
//                 <div className="metric-value">{weather.airQuality.so2.value}</div>
//                 <div className="metric-unit">{weather.airQuality.so2.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">PM2.5</div>
//                 <div className="metric-value">{weather.airQuality.pm2_5.value}</div>
//                 <div className="metric-unit">{weather.airQuality.pm2_5.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">PM10</div>
//                 <div className="metric-value">{weather.airQuality.pm10.value}</div>
//                 <div className="metric-unit">{weather.airQuality.pm10.unit}</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-label">NH3</div>
//                 <div className="metric-value">{weather.airQuality.nh3.value}</div>
//                 <div className="metric-unit">{weather.airQuality.nh3.unit}</div>
//               </div>
//             </div>
//           </div>

//           <div className="map-container">
//             <div className="map-placeholder">
//               <div className="map-city-label">{weather.city}</div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="tabs-container">
//         <div
//           className="tab active"
//         >
//           Temperature
//         </div>
//       </div>

//       <div className="temperature-map-container">
//         <div className="temperature-map-placeholder">
//           <h3>Temperature Map</h3>
//           <p>Map data will be loaded here</p>
//         </div>
//       </div>
      
//       {/* Added footer */}
//       <footer className="app-footer">
//         <p>
//           Made with <Heart className="heart-icon" size={18} /> by team WeatherGenie
//         </p>
//       </footer>
//     </div>
//   )
// }

import { useState, useEffect } from "react"
import axios from "axios"
import { Heart } from 'lucide-react'
import TemperatureGraph from "./temperatureGraph" // CHANGED: Our Recharts-based component
import "./landingPage.css"

export default function WeatherLandingPage() {
  const [weather, setWeather] = useState(null)
  const [hourlyData, setHourlyData] = useState([]) // CHANGED: Store forecast data here
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("temperature")

  useEffect(() => {
    fetchWeather()
  }, [])

  // CHANGED: Once we have weather coords, fetch the 3-hour forecast
  useEffect(() => {
    if (weather?.coord) {
      fetchHourlyForecast(weather.coord.lat, weather.coord.lon)
    }
  }, [weather])

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
      // If you want Kelvin to match your old logic with kelvinToCelsius, 
      // remove "&units=metric" from the URL. 
      // If you prefer actual Celsius from the API, use &units=metric 
      // and adapt TemperatureGraph accordingly.
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      console.log("Forecast URL:", forecastUrl)
      const forecastRes = await axios.get(forecastUrl)
      console.log("Fetched forecast data:", forecastRes.data)

      // The .list array is your 3-hourly forecast
      setHourlyData(forecastRes.data.list || [])
    } catch (err) {
      console.error("Error fetching hourly forecast:", err)
      setError("Error fetching hourly forecast data")
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">WeatherGenie</div>
        <nav className="main-nav">
          <ul>
            <li>Learn More</li>
            <li className="sign-in-btn">Sign In</li>
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
            <div className="map-placeholder">
              <div className="map-city-label">{weather.city}</div>
            </div>
          </div>
        </div>
      )}

      {/* Single Temperature tab */}
      <div className="tabs-container">
        <div className="tab active">Temperature</div>
      </div>

      <div className="temperature-map-container">
        <div className="temperature-map-placeholder">
          <h3>Temperature Map</h3>
          <p>Map data will be loaded here</p>
        </div>
      </div>
      
      {/* CHANGED: Render the Recharts line graph with hourly data from forecast */}
      {hourlyData.length > 0 && (
        <div className="history-chart-container">
          <TemperatureGraph data={hourlyData} />
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
