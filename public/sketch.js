if ("geolocation" in navigator) {
  console.log("geolocation available")
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air
    try {
      lat = position.coords.latitude
      lon = position.coords.longitude
      // lat = 47.388847
      // lon = 8.540289
      lat = 51.507351
      lon = -0.127758
      document.getElementById("lat").textContent = lat.toFixed(4)
      document.getElementById("lon").textContent = lon.toFixed(4)
      const api_url = `weather/${lat},${lon}`
      const response = await fetch(api_url)
      const json = await response.json()
      weather = json.weather.currently
      air = json.air_quality.results[0].measurements[0]
      document.getElementById("summary").textContent = weather.summary
      document.getElementById("temperature").textContent = weather.temperature
      document.getElementById("aq_parameter").textContent = air.parameter
      document.getElementById("aq_value").textContent = air.value
      document.getElementById("aq_units").textContent = air.units
      document.getElementById("aq_date").textContent = air.lastUpdated
    } catch (error) {
      console.log(error)
      air = { value: -1 }
      document.getElementById("aq_value").textContent = "NO READING"
    }
    const data = { lat, lon, weather, air }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }

    const db_response = await fetch("/api", options)
    const db_json = db_response.json()
    console.log(db_response)
  })
} else {
  console.log("geolocation not available")
}
