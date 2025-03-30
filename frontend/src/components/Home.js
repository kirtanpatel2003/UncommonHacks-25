import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./landingPage.css"

export default function Home() {
  const [email, setEmail] = useState("")
  const [arduinoId, setArduinoId] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    const storedArduinoId = localStorage.getItem("arduinoId")

    if (!storedEmail || !storedArduinoId) {
      navigate("/") // redirect to landing if not logged in
    }

    setEmail(storedEmail)
    setArduinoId(storedArduinoId)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("email")
    localStorage.removeItem("arduinoId")
    navigate("/")
  }

  return (
    <div className="home-container">
      <h1>Welcome to WeatherGenie Home</h1>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Arduino ID:</strong> {arduinoId}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}