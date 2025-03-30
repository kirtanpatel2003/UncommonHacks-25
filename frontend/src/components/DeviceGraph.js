import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Papa from "papaparse"

export default function DeviceGraph() {
  const [data, setData] = useState([])

  const fetchCSV = async () => {
    const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRubbBjeUHhlC4QUUL1K-XjE0MfvepkIvFBYkPZs5w5rJ9UjnJ23Kfm-zK3H5Q_nuiP_ZNx3eURWlCT/pub?gid=0&single=true&output=csv")
    const text = await response.text()
    const parsed = Papa.parse(text, { header: true })
    const cleaned = parsed.data.filter(row => row.TimeStamp && row.AQI)
    setData(cleaned)
  }

  useEffect(() => {
    fetchCSV()
    const interval = setInterval(fetchCSV, 5000) // fetch every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="TimeStamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="AQI" stroke="#8884d8" />
          <Line type="monotone" dataKey="TempC" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Hum%" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}