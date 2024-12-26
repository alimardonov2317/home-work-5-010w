const locationEl = document.querySelector(".weather__location");
const imgEl = document.querySelector(".weather__main-image img");
const tempEl = document.querySelector(".weather__main-temp");
const textEl = document.querySelector(".weather__text");
const todayWrapperEl = document.querySelector(".weather__today-wrapper");
const fullInfoEl = document.querySelector(".weather__full-wrapper");
const weekWrapperEl = document.querySelector(".weather__week-wrapper"); 
const weatherFormEl = document.querySelector(".weather__form"); 
const weatherSearchEl = document.querySelector(".weather__search"); 

const BASE_URL = "";

async function fetchWeather(city) {
  todayWrapperEl.innerHTML = "";
  weekWrapperEl.innerHTML = "";
  fullInfoEl.innerHTML = "";

  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c3a6dc4386cc49e7ba0155411242212&q=${city}&days=7&aqi=yes&alerts=yes`);
  response
    .json()
    .then((res) => {
      tempEl.textContent = res.current.temp_c + "°";
      imgEl.src = res.current.condition.icon;
      textEl.textContent = res.current.condition.text;
      locationEl.textContent = `${res.location.name}, ${res.location.country}`;

      // Soatlik ob-havo ma'lumotlari
      res.forecast.forecastday[0].hour.slice(0, 6).forEach((hour) => {
        const weatherCard = document.createElement("div");
        weatherCard.className = "weather__today-card";
        weatherCard.innerHTML = `
          <p class="weather__today-time">${hour.time.split(" ")[1]}</p>
          <img src="${hour.condition.icon}" alt="">
          <p class="weather__today-temp">${hour.temp_c}°</p>
        `;
        todayWrapperEl.appendChild(weatherCard);
      });

      fullInfoEl.innerHTML = `
        <div>
          <span><i class="fa-solid fa-temperature-three-quarters" style="color: #9399a2;"></i> Real Feel</span>
          <p>${res.current.feelslike_c}°</p>
          <span class="weather__mb"><i class="fa-solid fa-droplet" style="color: #9399a2;"></i> Chance of rain</span>
          <p>${res.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
        </div>
        <div>
          <span><i class="fa-solid fa-wind" style="color: #9399a2;"></i> Wind</span>
          <p>${res.current.wind_kph} km/h</p>
          <span class="weather__mb"><i class="fa-regular fa-sun" style="color: #9399a2;"></i> UV index</span>
          <p>${res.current.uv}</p>
        </div>
      `;

      res.forecast.forecastday.forEach((day) => {
        const weekCard = document.createElement("div");
        weekCard.className = "weather__week-card";
        weekCard.innerHTML = `
          <span>${new Date(day.date).toLocaleDateString("en-US", { weekday: 'long' })}</span>
          <span>
            <img src="${day.day.condition.icon}" alt="">
            <span>${day.day.condition.text}</span>
          </span>
          <span>${day.day.maxtemp_c}°</span>
        `;
        weekWrapperEl.appendChild(weekCard);
      });
    });
}

window.onload = () => {
  fetchWeather("chilanzar");
};

weatherFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchWeather(weatherSearchEl.value);
});
