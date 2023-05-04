'use strict';

const locationBtn = document.getElementById('location-btn');
const weatherInfo = document.querySelector('.info');
const appLogo = document.querySelector('.app-logo');
const searchForm = document.forms.citySearch;

const setIconUrl = (data) => {
  let iconUrl;

  if (data.id >= 200 && data.id <= 232) {
    iconUrl = '../images/thunderstorm.png';
  } else if (data.id >= 300 && data.id <= 321) {
    iconUrl = '../images/drizzle.png';
  } else if (data.id >= 500 && data.id <= 531) {
    iconUrl = '../images/rain.png';
  } else if (data.id >= 600 && data.id <= 622) {
    iconUrl = '../images/snow.png';
  } else if (data.id >= 701 && data.id <= 781) {
    iconUrl = (data.icon == '50d') ? '../images/mistDay.png' : '../images/mistNight.png';
  } else if (data.id == 800) {
    iconUrl = (data.icon == '01d') ? '../images/clearDay.png' : '../images/clearNight.png';
  } else if (data.id >= 801 && data.id <= 804) {
    if (data.icon.startsWith('02')) {
      iconUrl = (data.icon == '02d') ? '../images/fewCloudsDay.png' : '../images/fewCloudsNight.png'
    } else {
      iconUrl = '../images/clouds.png'
    }
  }

  return iconUrl;
}

const locationBased = async function(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=5cc1fff7701b4f3d81c91429fed19687`;

  const response = await fetch(url);
  
  if (response.ok) {
    const result = await response.json();
    const city = result.features[0].properties.city;

    localStorage.clear();
    localStorage.setItem('city', city);

    displayWeatherForecast();
  }
};

const getWeatherData = async function(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=95acb4de11362bc1b49d858d18585641`;

  const response = await fetch(url);

  if (response.ok) {
    let json = await response.json();
    return json;
  }
};

const displayWeatherForecast = function () {
  const city = localStorage.getItem('city');

  getWeatherData(city).then(data => {
    const url = setIconUrl(data.weather[0]);
  
    const html = `
      <span class="weather-location">${data.name}</span>
      <img class="weather-icon" src=${url}>
      <span class="weather-description">${data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)}</span>
      <div class="weather-details">
        <div class="temp">
          <span>${(data.main.temp - 273.15).toFixed()}°C</span>
        </div>
        <div class="optional">
          <span>Wind ${(data.wind.speed * 3600 / 1000).toFixed(1)} km/h</span>
          <span>Visibility ${data.visibility / 1000}km</span>
          <span>Humidity ${data.main.humidity}%</span>
        </div>
      </div>
    `;
  
    weatherInfo.innerHTML = html;
  });
};

appLogo.onclick = () => {
  window.location.href = '../index.html'
};

searchForm.addEventListener("focusin", () => searchForm.classList.add('focused'));
searchForm.addEventListener("focusout", () => searchForm.classList.remove('focused'));

searchForm.onsubmit = function(event) {
  const formData = new FormData(searchForm);
  const cityName = formData.get("city");

  const correctCityName = cityName[0].toUpperCase() + cityName.slice(1).toLocaleLowerCase();
  
  localStorage.clear();
  localStorage.setItem('city', correctCityName);
  
  displayWeatherForecast();
  
  searchForm.reset();
  return false;
};

locationBtn.onclick = () => {
  navigator.geolocation.getCurrentPosition(locationBased);
};

displayWeatherForecast();