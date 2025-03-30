import React, { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function WeatherMap({ lat, lon, apiKey }) {
    useEffect(() => {
        // Create the Leaflet map
        const map = L.map("leaflet-map-id", {
            center: [lat, lon],
            zoom: 5,
        })

        // Base layer from OpenStreetMap
        const baseLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: "© OpenStreetMap" }
        )
        baseLayer.addTo(map)

        const weatherLayer = L.tileLayer(
            `https://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=${apiKey}&opacity=0.6&fill_bound=true`,
            {
                attribution: '© <a href="https://openweathermap.org/">OpenWeather</a>',
                maxZoom: 18,
            }
        )
        weatherLayer.addTo(map)

        return () => {
            map.remove()
        }
    }, [lat, lon, apiKey])

    return (
        <div
            id="leaflet-map-id"
            style={{ width: "100%", height: "100%" }}
        />
    )
}