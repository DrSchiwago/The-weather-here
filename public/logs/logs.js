const mymap = L.map("checkinMap").setView([0, 0], 1)
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const tiles = L.tileLayer(tileUrl, { attribution })
tiles.addTo(mymap)

getData()

async function getData() {
  const response = await fetch("/api") // get all data from db (index.js -> GET-Request)
  const data = await response.json()
  console.log(data)
  data.sort(function (x, y) {
    return y.timestamp - x.timestamp
  })

  for (let item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap)

    const txt = `The weather here at ${item.lat}&deg;, 
    ${item.lon}&deg; is ${item.weather.summary} with 
    a temperature of ${item.weather.temperature}&deg; F.`

    if (item.air.value < 0) {
      txt += " No air quality reading."
    } else {
      txt += `The concentration of particulate matter 
        (${item.air.parameter} is ${item.air.value} | 
          ${item.air.unit} last read on ${item.air.lastUpdated}.`
    }

    marker.bindPopup(txt)
  }
  console.log(data)
}
