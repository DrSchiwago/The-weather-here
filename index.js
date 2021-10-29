const express = require("express")
const Datastore = require("nedb")
const fetch = require("node-fetch")
require("dotenv").config()

const app = express()
app.listen(3000, () => console.log("Starting server: http://localhost:3000"))
app.use(express.static("public"))
app.use(express.json({ limit: "1mb" }))

const database = new Datastore("database.db")
database.loadDatabase()

// get-request: Return all data from database
app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end()
      return
    }
    response.json(data)
  })
})

//post-request
app.post("/api", (request, response) => {
  console.log("I got a request!")
  const data = request.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  // database.remove({}, { multi: true }, function (err, numRemoved) {
  //   console.log("DB cleared!")
  // })
  response.json(data)
})

app.get("/weather/:latlon", async (request, response) => {
  const latlon = request.params.latlon.split(",")
  console.log(latlon)
  const lat = latlon[0]
  const lon = latlon[1]
  const api_key = process.env.API_KEY
  //const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`
  //const weather_response = await fetch(weather_url)
  //const weather_data = await weather_response.json()
  const weather_data = {
    latitude: 37.8267,
    longitude: -122.4233,
    timezone: "America/Los_Angeles",
    currently: {
      time: 1558382298,
      summary: "Mostly Cloudy",
      icon: "partly-cloudy-day",
      nearestStormDistance: 170,
      nearestStormBearing: 51,
      precipIntensity: 0,
      precipProbability: 0,
      temperature: 54.75,
      apparentTemperature: 54.75,
      dewPoint: 48.41,
      humidity: 0.79,
      pressure: 1015.61,
      windSpeed: 10.14
    },
    minutely: {
      summary: "Mostly cloudy for the hour",
      icon: "partly-cloudy-day",
      data: [
        {
          time: 1558382280,
          precipIntensity: 0,
          precipProbability: 0
        },
        {
          time: 1558382340,
          precipIntensity: 0,
          precipProbability: 0
        }
      ]
    }
  }

  const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`
  const aq_response = await fetch(aq_url)
  const aq_data = await aq_response.json()

  const data = {
    weather: weather_data,
    air_quality: aq_data
  }

  response.json(data)
  console.log(data)
})
