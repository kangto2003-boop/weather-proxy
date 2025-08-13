const express = require("express");
const fetch = require("node-fetch");
const app = express();

const API_KEY = "14455a9afb3ef55897d8d23072343f6e";

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "city is required" });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`;
    const resp = await fetch(url);
    const data = await resp.json();

    const utcSeconds = data.dt;
    const timezoneOffset = data.timezone; // 초 단위
    const localTime = new Date((utcSeconds + timezoneOffset) * 1000);
    const localTimeStr = localTime.toISOString().replace('T', ' ').substr(0, 19);

    res.json({
      temp: data.main?.temp || null,
      desc: data.weather?.[0]?.description || null,
      city: data.name || city,
      localTime: localTimeStr
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Weather proxy running on port ${PORT}`));
