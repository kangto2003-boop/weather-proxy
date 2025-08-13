// API 호출 함수 (도시명 기반)
function fetchWeather(city, callback) {
  var apiKey = 'YOUR_API_KEY';  // 발급받은 OpenWeatherMap API 키
  var url = 'https://api.openweathermap.org/data/2.5/weather?q=' 
            + encodeURIComponent(city) 
            + '&appid=' + apiKey 
            + '&units=metric&lang=kr';

  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.main && data.weather) {
        var temp = data.main.temp;
        var desc = data.weather[0].description;
        callback(null, {
          temp: temp,
          desc: desc,
          place: data.name
        });
      } else {
        callback('날씨 정보를 가져올 수 없습니다.');
      }
    })
    .catch(function(err) {
      callback('날씨 API 요청 중 오류가 발생했습니다.');
    });
}

// response() 내부 수정부분
...
} else if (message.charAt(0) === "!" && message.indexOf("날씨") !== -1) {
  var cityName = message.replace('!', '').replace('날씨', '');
  if (!cityName) cityName = "Seoul";  // 기본값 설정
  fetchWeather(cityName, function(err, info) {
    if (err) {
      replier.reply("⚠️ " + err);
    } else {
      replier.reply("🌤️ " + info.place + " 현재 날씨\n" +
                    "온도: " + info.temp + "°C\n" +
                    "상태: " + info.desc);
    }
  });
} else if (message === "!날씨") {
  // 도시명을 입력하지 않은 경우 디폴트로 서울
  fetchWeather("Seoul", function(err, info) {
    if (err) {
      replier.reply("⚠️ " + err);
    } else {
      replier.reply("🌤️ " + info.place + " 현재 날씨\n" +
                    "온도: " + info.temp + "°C\n" +
                    "상태: " + info.desc);
    }
  });
}
