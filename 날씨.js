var PROXY_URL = "https://weather-proxy-gdba.onrender.com/weather";
var cityList = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "제주"];

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
  if (msg === "!날씨") {
    var result = "☁ 전국 주요 도시 날씨 ☁\n━━━━━━━━━━━━\n";
    for (var i = 0; i < cityList.length; i++) {
      var w = getWeather(cityList[i]);
      if (w) {
        result += "📍 " + w.city + ": " + w.temp + "°C (" + w.desc + ")  [" + w.localTime + " 기준]\n";
      } else {
        result += "📍 " + cityList[i] + ": 정보 없음\n";
      }
    }
    replier.reply(result);
  } else if (msg.indexOf("날씨") > -1 && msg !== "!날씨") {
    var location = msg.replace("날씨", "").replace("!", "").trim();
    var w = getWeather(location);
    if (w) {
      var text = "📍 " + w.city + " 날씨 (" + w.localTime + " 기준)\n";
      text += "🌡 온도: " + w.temp + "°C\n";
      text += "☁ 상태: " + w.desc + "\n";
      text += "━━━━━━━━━━━━";
      replier.reply(text);
    } else {
      replier.reply("❌ 날씨 정보를 불러올 수 없습니다.");
    }
  }
}

function getWeather(city) {
  try {
    var url = PROXY_URL + "?city=" + encodeURIComponent(city);
    var jsonText = org.jsoup.Jsoup.connect(url)
      .ignoreContentType(true)
      .timeout(5000)
      .get()
      .text();

    var data = JSON.parse(jsonText);
    if (!data.temp) return null;

    return {
      temp: data.temp,
      desc: data.desc,
      city: data.city,
      localTime: data.localTime
    };
  } catch (e) {
    return null;
  }
}
