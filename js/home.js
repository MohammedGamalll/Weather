function getCoordinates() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude.toString();
    var lng = crd.longitude.toString();
    var coordinates = [lat, lng];
    getCity(coordinates);
    return;

  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coordinates) {
  var xhr = new XMLHttpRequest();
  var lat = coordinates[0];
  var lng = coordinates[1];

  xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.7c598f45a7cf067daf9f6dd444d4db62&lat=" +
    lat + "&lon=" + lng + "&format=json", true);
  xhr.send();
  xhr.onreadystatechange = processRequest;
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var city = response.address.city;
      getWeather(city);
      return;
    }
  }
}
getCoordinates();

let searchBtn = document.getElementById('search-btn');
let searchInput = document.getElementById('search-bar');

var dayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

searchInput.addEventListener('keyup', () => {
  let cityName = searchInput.value;
  if(cityName.length > 2) {
    getWeather(cityName);
  }
});

function getWeather(cityName) {
  let weatherHTTP = new XMLHttpRequest();
  weatherHTTP.open('GET', `https://api.weatherapi.com/v1/forecast.json?key=56f186a354a844b0ad5165157240612&q=${cityName}&days=3`);
  weatherHTTP.send();
  weatherHTTP.onreadystatechange = () => {
    if (weatherHTTP.readyState === 4 && weatherHTTP.status === 200) {
      let data = JSON.parse(weatherHTTP.responseText);
      let date = data.location.localtime;
      let dayName = getDayName(date.split(' ')[0]);
      let today = dayName;
      if (dayName === 'Friday') {
        tomorrow = dayNames[dayNames.indexOf(dayName) + 1];
        overmorrow = dayNames[0];
      }
      else if (dayName === 'Saturday') {
        tomorrow = dayNames[0];
        overmorrow = dayNames[1];
      }
      else{
        let tomorrow = dayNames[dayNames.indexOf(dayName) + 1];
        let overmorrow = dayNames[dayNames.indexOf(dayName) + 2];
      }

      getTodayWeather(data ,today);
      getTomorrowWeather(data , tomorrow);
      getOvermorrowWeather(data, overmorrow);
    }
  }
}

function getTodayWeather(data , today) {
  let cityName = data.location.name;
  let temp = data.current.temp_c;
  let condition = data.current.condition.text;
  let icon = data.current.condition.icon;
  let humidity = data.current.humidity;
  let wind = data.current.wind_kph;
  let date = data.location.localtime;
  let time = date.split(' ')[1];
  date = date.split(' ')[0];
  let day = date.split('-')[2];
  let month = date.split('-')[1];

  let weatherCard = document.getElementById('today');
  weatherCard.innerHTML = `
                                    <div class="inner px-1">
                                      <div class="card-header d-flex justify-content-between">
                                        <p>${today}</p>
                                        <p>${time}</p>
                                        <p>${day + '-' + month}</p>
                                      </div>
                                      <div class="card-body">
                                          <div class="city">
                                            <h6>${cityName}</h6>
                                            <h2>${temp}<sup>o</sup> C</h2>
                                          </div>
                                          <div class="weather-icon">
                                            <img src="${icon}" alt>
                                          </div>
                                          <div class="weather-status">
                                            <p class="fs-6">${condition}</p>
                                          </div>
                                          <div class="weather-details d-flex align-items-baseline">

                                            <span class="d-flex align-items-baseline"><img src="images/icon-umberella.png" alt="" class="pe-1">${humidity + "%"}</span>
                                            <span class="d-flex align-items-baseline px-2"><img src="images/icon-wind.png" alt="" class="pe-1">${wind}</span>
                                            <span class="d-flex align-items-baseline"><img src="images/icon-compass.png" alt="" class="pe-1">East</span>
                                          </div>
                                      </div>
                                   </div>
              `;
}

function getTomorrowWeather(data, tomorrow) {
  let maxtemp = data.forecast.forecastday[1].day.maxtemp_c;
  let mintemp = data.forecast.forecastday[1].day.mintemp_c;
  let condition = data.forecast.forecastday[1].day.condition.text;
  let icon = data.forecast.forecastday[1].day.condition.icon;

  let weatherCard2 = document.getElementById('tomorrow');
  weatherCard2.innerHTML = `
    <div
    class="inner d-flex flex-column align-items-center">
    <div class="card-header w-100">
      <p class="text-center">${tomorrow}</p>
    </div>
    <div class="card-body">
      <div class="weather-icon text-center">
        <img src="${icon}" alt>
      </div>
      <div class="degree text-center">
        <h2 class="h4">${maxtemp}<sup>o</sup>C</h2>
        <h4 class="h6">${mintemp}<sup>o</sup>C</h3>
      </div>
      <div class="weather-status text-center ">
        <p class="fs-6">${condition}</p>
      </div>
    </div>
  </div>`;

}

function getOvermorrowWeather(data , overmorrow) {
  let maxtemp = data.forecast.forecastday[2].day.maxtemp_c;
  let mintemp = data.forecast.forecastday[2].day.mintemp_c;
  let condition = data.forecast.forecastday[2].day.condition.text;
  let icon = data.forecast.forecastday[2].day.condition.icon;

  let weatherCard3 = document.getElementById('overmorrow');
  weatherCard3.innerHTML = `
    <div
    class="inner d-flex flex-column align-items-center">
    <div class="card-header w-100">
      <p class="text-center">${overmorrow}</p>
    </div>
    <div class="card-body">
      <div class="weather-icon text-center">
        <img src="${icon}" alt>
      </div>
      <div class="degree text-center">
        <h2 class="h4">${maxtemp}<sup>o</sup>C</h2>
        <h4 class="h6">${mintemp}<sup>o</sup>C</h3>
      </div>
      <div class="weather-status text-center ">
        <p class="fs-6">${condition}</p>
      </div>
    </div>
  </div>`;

}

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}