import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Home from "./components/home"
import Home from "./components/Home"
import WeatherLandingPage from "./components/landingPage"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem("email")
    const arduinoId = localStorage.getItem("arduinoId")
    if (email && arduinoId) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherLandingPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App