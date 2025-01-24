const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const searchForm = document.getElementById("search");
const cityInput = document.getElementById("cityInput");
const forecastContainer = document.getElementById("forecastContainer");
const weatherIcon = document.getElementById("WeatherIcon");
const realFeelValue = document.querySelector(".realFeelValue");
const chanceRainValue = document.querySelector(".chanceRainValue");
const windValue = document.querySelector(".windValue");
const uvIndexValue = document.querySelector(".uvIndexValue");

// Function to fetch weather data and city data together
async function fetchWeather(cityName) {
  try {
    const cityUrl = `https://api.api-ninjas.com/v1/city?name=${cityName}`;
    const weatherBaseUrl = "https://api.open-meteo.com/v1/forecast";

    // Fetch city data
    const cityResponse = await fetch(cityUrl, {
      headers: { "X-Api-Key": "lUIGfjAuln7SuSF2fzKpig==hqIA07DXQPrAW8ev" },
    });
    if (!cityResponse.ok) throw new Error("City not found!");
    const cityData = await cityResponse.json();
    if (!cityData.length) throw new Error("No matching city data!");

    const { latitude, longitude, name } = cityData[0];767
    city.innerText = name;

    // Fetch weather data
    const weatherResponse = await fetch( 
      `${weatherBaseUrl}?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m,apparent_temperature,windspeed_10m,uv_index&timezone=auto`
    );
    if (!weatherResponse.ok) throw new Error("Weather data unavailable!");
    const weatherData = await weatherResponse.json();

    return { weatherData, cityName: name };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Function to map weather codes to conditions and icons
function getWeatherCondition(weatherCode) {
  const weatherConditions = {
    0: { condition: "Clear", icon: "sunny.svg" },
    1: { condition: "Mainly Clear", icon: "cloudy-day-1.svg" },
    2: { condition: "Partly Cloudy", icon: "cloudy-day-2.svg" },
    3: { condition: "Overcast", icon: "cloudy.svg" },
    45: { condition: "Fog", icon: "cloudy.svg" },
    51: { condition: "Light Drizzle", icon: "rainy-1.svg" },
    61: { condition: "Light Rain", icon: "rainy-4.svg" },
    80: { condition: "Showers", icon: "rainy-7.svg" },
    95: { condition: "Thunderstorm", icon: "thunder.svg" },
  };
  return (
    weatherConditions[weatherCode] || {
      condition: "Unknown",
      icon: "cloudy.svg",
    }
  );
}

function renderWeather({ weatherData, cityName }) {
  try {
    const { daily, current } = weatherData;
    const currentWeatherCode = daily.weathercode[0];
    const { condition, icon } = getWeatherCondition(currentWeatherCode);

    document.getElementById("todayCondition").innerText = condition;
    document.getElementById("todayIcon").src = `/animation/animated/${icon}`;
    document.getElementById("todayTemperature").innerText = `${current.temperature_2m}°C`;
    document.getElementById("todayRealFeel").innerText = `${current.apparent_temperature}°C`;
    document.getElementById("todayChanceRain").innerText = `${daily.precipitation_probability_max[0]}%`;
    document.getElementById("todayWind").innerText = `${current.windspeed_10m} km/h`;
    document.getElementById("todayUVIndex").innerText = `${current.uv_index}`;

    // Display 7-day forecast
    forecastContainer.innerHTML = "";
    daily.time.forEach((_, index) => {
      const { condition, icon } = getWeatherCondition(daily.weathercode[index]);
      const highTemp = daily.temperature_2m_max[index];
      const lowTemp = daily.temperature_2m_min[index];
      const dayName = new Date(daily.time[index]).toLocaleDateString("en-US", {
        weekday: "long",
      });

      forecastContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="card">
            <div class="meteodays text-center">
              <h4>${dayName}</h4>
              <img src="/animation/animated/${icon}" alt="Icon" class="img-fluid" style="width: 50px;">
              <p>${condition}</p>
              <p>${highTemp}°C / ${lowTemp}°C</p>
            </div>
          </div>
        `
      );
    });
  } catch (error) {
    forecastContainer.innerHTML = "Failed to render weather data.";
  }
}

// Event handler for form submission
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (!cityName) {
    city.innerText = "Enter a valid city name.";
    return;
  }
  try {
    const weatherDetails = await fetchWeather(cityName);
    renderWeather(weatherDetails);
  } catch (error) {
    city.innerText = error.message;
    forecastContainer.innerHTML = "";
  }
});
