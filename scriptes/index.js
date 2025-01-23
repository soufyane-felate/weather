const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const forecastContainer = document.getElementById("forecastContainer");

// Function to fetch weather data for a given latitude and longitude
async function getWeatherData(latitude, longitude) {
  try {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&timezone=auto`;
    console.log("Fetching weather data from:", apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("Weather Data:", data);
    if (data && data.daily && data.hourly) {
      return data; 
    } else {
      throw new Error("No forecast data available");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
}

// Function to fetch city data
async function getCityData(cityName) {
  try {
    const header = new Headers();
    header.set("X-Api-Key", "lUIGfjAuln7SuSF2fzKpig==hqIA07DXQPrAW8ev");
    const response = await fetch(
      `https://api.api-ninjas.com/v1/city?name=${cityName}`,
      { headers: header }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("City Data:", data);
    if (data.length > 0) {
      return data[0]; 
    } else {
      throw new Error("City not found");
    }
  } catch (error) {
    console.error("Error fetching city data:", error.message);
    throw error;
  }
}

// Function to generate HTML for a single day's forecast
function generateForecastHTML(day, icon, condition, high, low) {
  return `
    <div class="card">
      <div class="meteodays d-flex flex-column align-items-center">
        <h4>${day}</h4>
        <div class="d-flex justify-content-center mb-2">
          <img src="/animation/animated/${icon}" alt="Weather Icon" class="img-fluid" style="width: 50px; height: 50px;">
        </div>
        <h5>${condition}</h5>
        <p>${high}°C / ${low}°C</p>
      </div>
    </div>
  `;
}

// Function to map weather codes to conditions and icons
function getWeatherCondition(weatherCode) {
  const weatherConditions = {
    0: { condition: "Clear", icon: "sunny.svg" },
    1: { condition: "Mainly Clear", icon: "cloudy-day-1.svg" },
    2: { condition: "Partly Cloudy", icon: "cloudy-day-2.svg" },
    3: { condition: "Overcast", icon: "cloudy.svg" },
    45: { condition: "Fog", icon: "fog.svg" },
    51: { condition: "Light Drizzle", icon: "rainy-1.svg" },
    53: { condition: "Moderate Drizzle", icon: "rainy-2.svg" },
    55: { condition: "Heavy Drizzle", icon: "rainy-3.svg" },
    61: { condition: "Light Rain", icon: "rainy-4.svg" },
    63: { condition: "Moderate Rain", icon: "rainy-5.svg" },
    65: { condition: "Heavy Rain", icon: "rainy-6.svg" },
    80: { condition: "Light Showers", icon: "rainy-7.svg" },
    81: { condition: "Moderate Showers", icon: "rainy-6.svg" },
    82: { condition: "Heavy Showers", icon: "rainy-7.svg" },
    95: { condition: "Thunderstorm", icon: "thunder.svg" },
    96: { condition: "Thunderstorm with Hail", icon: "thunder.svg" },
  };
  return (
    weatherConditions[weatherCode] || {
      condition: "Unknown",
      icon: "cloudy.svg",
    }
  );
}

// Function to render the 7-Day Forecast
async function renderForecast(cityName) {
  try {
    const cityData = await getCityData(cityName);
    city.innerHTML = cityData.name;

    const weatherData = await getWeatherData(
      cityData.latitude,
      cityData.longitude
    );
    forecastContainer.innerHTML = "";

    // Display current temperature
    const currentTemperature = weatherData.hourly.temperature_2m[0]; 
    temperature.innerHTML = `${currentTemperature}°C`; 

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    weatherData.daily.time.forEach((date, index) => {
      const weatherCode = weatherData.daily.weathercode[index];
      const highTemp = weatherData.daily.temperature_2m_max[index];
      const lowTemp = weatherData.daily.temperature_2m_min[index];
      const { condition, icon } = getWeatherCondition(weatherCode);

      const dayName = index === 0 ? "Today" : days[(index - 1) % days.length];

      const forecastHTML = generateForecastHTML(
        dayName,
        icon,
        condition,
        highTemp,
        lowTemp
      );
      forecastContainer.insertAdjacentHTML("beforeend", forecastHTML);
    });
  } catch (error) {
    console.error("Error rendering forecast:", error.message);
    forecastContainer.innerHTML = "Failed to fetch forecast data.";
  }
}

// Function to handle city search
function handleCitySearch(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName) {
    renderForecast(cityName);
  } else {
    city.innerHTML = "Please enter a city name.";
    forecastContainer.innerHTML = "";
  }
}

search.addEventListener("submit", handleCitySearch);
