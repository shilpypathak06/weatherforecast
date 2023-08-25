const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
var cityName;



async function getWeatherData(city) {
  const apiKey = '2f0ad3953411bdfb6c2964fa864b71d0';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function updateWeatherData(b,weatherDataObject) {

  let weatherData;
  if(b){
    weatherData = weatherDataObject;

  }else{
    weatherData = await getWeatherData(cityName);
  }

    
  console.log(weatherData);

    addWeatherCards(weatherData.list);
    const currentWeather = weatherData.list[0];
    const temperature = currentWeather.main.temp;
    const weatherDescription = currentWeather.weather[0].description;
    const windSpeed = currentWeather.wind.speed;
    const humidity = currentWeather.main.humidity;
    const weatherIconCode = currentWeather.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().slice(0, 8);

    document.getElementById('cityName').textContent = cityName.toUpperCase();
    document.getElementById('currentTime').textContent = currentTime;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('weatherDescription').textContent = weatherDescription.toUpperCase();;
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('weatherIcon').src = weatherIconUrl;

}

async function addWeatherCards(response) {
  const container = document.querySelector('.horizontal-scroll-container');
  const template = document.querySelector('.weather-app-template');

  for (let i = 1; i<response.length;i++) {
    const currentWeather = response[i];
      const temperature = currentWeather.main.temp;
      const weatherDescription = currentWeather.weather[0].description;
      const windSpeed = currentWeather.wind.speed;
      const windDirection = currentWeather.wind.deg;
      const humidity = currentWeather.main.humidity;
      const weatherIconCode = currentWeather.weather[0].icon;
      
      const weatherIconUrl = `http://openweathermap.org/img/w/${weatherIconCode}.png`;
      

      // Clone the template and make it visible
      const card = template.cloneNode(true);
      card.classList.remove('weather-app-template');
      card.style.display = 'block';

      // Update the card with weather data
      card.querySelector('.temperature-value').textContent = `${temperature}°C`;
      card.querySelector('.city-name').textContent = cityName.toUpperCase();
      card.querySelector('.weather-icon').src = weatherIconUrl;
      card.querySelector('.weather-description').textContent = weatherDescription.toUpperCase();
      card.querySelector('.humidity-value').textContent = `${humidity}`;
      card.querySelector('.temp-time').textContent = currentWeather.dt_txt;
      card.querySelector('.wind-speed').textContent = `${windSpeed}`;
      // Append the card to the container
      container.appendChild(card);
    
  }

  
  document.getElementById("mainContainer").classList.remove("inactive");
}


document.getElementById('serchForm').addEventListener('submit', function(event) {
  event.preventDefault(); 
  cityName = searchInput.value.trim();

  if (cityName === '') {
    return;
  }

  updateWeatherData();

});



searchBtn.addEventListener('click', async () => {
  cityName = searchInput.value.trim();

  if (cityName === '') {
    return;
  }

  updateWeatherData();
});

window.addEventListener('load', async () => {

  if ('geolocation' in navigator) {
    try {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        const apiKey = '2f0ad3953411bdfb6c2964fa864b71d0';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

        
        const response = await fetch(apiUrl);
        
        const weatherDataObject = await response.json();
        cityName = weatherDataObject.city.name;
        
        updateWeatherData(true,weatherDataObject);
        // displayWeatherInfo(data);
      });
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  } else {
    console.log('Geolocation is not available in this browser.');
  }
});
