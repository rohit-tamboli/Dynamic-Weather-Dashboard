// ⚠️ Replace with your actual OpenWeatherMap API key
const apiKey = "bd56eb2469e8d74303f364fdec32ffed";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const locationEl = document.getElementById("location");
const tempEl = document.getElementById("temp");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherIconEl = document.getElementById("weatherIcon");

// Fetch weather by city name
async function fetchWeather(city) {
  try {
    const cleanCity = city.trim();
    if (!cleanCity) return;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanCity)}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    alert(error.message);
  }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error(error.message);
  }
}

// Custom icon mapping
function getCustomIcon(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("clear")) return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-day-sunny.svg";
  if (condition.includes("cloud")) return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-cloudy.svg";
  if (condition.includes("rain")) return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-rain.svg";
  if (condition.includes("drizzle")) return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-showers.svg";
  if (condition.includes("thunderstorm")) return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-thunderstorm.svg";
  if (condition.includes("snow")) return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-snow.svg";
  if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze"))
    return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-fog.svg";

  return "https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/wi-na.svg"; // fallback
}

// Display weather data
function displayWeather(data) {
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;

  // Set custom icon
  const condition = data.weather[0].main;
  weatherIconEl.src = getCustomIcon(condition);
  weatherIconEl.style.display = "block";

  // Background gradient
  setWeatherBackground(condition);

  // Animate card
  weatherCard.classList.add("show");

  // Pop animation for temperature
  tempEl.classList.add("pop");
  setTimeout(() => tempEl.classList.remove("pop"), 400);
}

// Dynamic background gradients
function setWeatherBackground(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("clear")) {
    document.body.style.background = "linear-gradient(to right, #56ccf2, #2f80ed)"; // sunny
  } else if (condition.includes("cloud")) {
    document.body.style.background = "linear-gradient(to right, #757f9a, #d7dde8)"; // cloudy
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    document.body.style.background = "linear-gradient(to right, #000046, #1cb5e0)"; // rainy
  } else if (condition.includes("thunderstorm")) {
    document.body.style.background = "linear-gradient(to right, #232526, #414345)"; // stormy
  } else if (condition.includes("snow")) {
    document.body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)"; // snowy
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    document.body.style.background = "linear-gradient(to right, #d7d2cc, #304352)"; // mist/fog
  } else {
    document.body.style.background = "linear-gradient(-45deg, #4facfe, #00f2fe, #38f9d7)"; // default
  }
}

// Search button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) fetchWeather(city);
});

// Enter key press
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value;
    if (city) fetchWeather(city);
  }
});

// // Load default (Delhi) if no geolocation
// window.addEventListener("load", () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         fetchWeatherByCoords(latitude, longitude);
//       },
//       () => {
//         fetchWeather("Delhi,in");
//       }
//     );
//   } else {
//     fetchWeather("Delhi,in");
//   }
// });
