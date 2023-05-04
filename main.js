'use strict';

const locationInfo = document.querySelector('.show-location');
const searchForm = document.forms.citySearch;

const getPositionData = async function(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=5cc1fff7701b4f3d81c91429fed19687`;

  const response = await fetch(url);
  
  if (response.ok) {
    const result = await response.json();

    const city = result.features[0].properties.city;
    const country = result.features[0].properties.country;
    
    locationInfo.lastElementChild.textContent = `${city}, ${country}`;

    setTimeout(() => {
      locationInfo.classList.remove('focused');

      localStorage.setItem('city', city);

      window.location.href = './pages/forecast.html';
    }, 500);
  }
};

searchForm.addEventListener("focusin", () => searchForm.classList.add('focused'));
searchForm.addEventListener("focusout", () => searchForm.classList.remove('focused'));

searchForm.onsubmit = function() {
  const formData = new FormData(searchForm);
  const cityName = formData.get("city");

  const correctCityName = cityName[0].toUpperCase() + cityName.slice(1).toLocaleLowerCase();
  
  localStorage.setItem('city', correctCityName);
  window.location.href = './pages/forecast.html';

  return false;
};

locationInfo.onclick = function() {
  locationInfo.classList.add('focused');
  navigator.geolocation.getCurrentPosition(getPositionData);
};