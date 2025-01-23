const city = document.getElementById("city");
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const temperature = document.getElementById("temperature");

async function getData2(latitude, longitude) {
  try {
    const oauthToken =
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoxLCJ1c2VyIjoibm9jb21wYW55X25ldF9sZWFkZXIiLCJpc3MiOiJsb2dpbi5tZXRlb21hdGljcy5jb20iLCJleHAiOjE3Mzc1NjEyNDksInN1YiI6ImFjY2VzcyJ9.-G45SC4IUcwOIWs7P5nfBhIlGsdv9aP9CNxKmRV3j7Bb9a2h21jtQ8gdyhEefaKIujdmwOnyf8OXIOMq18le4Q";

    const apiUrl = `https://api.meteomatics.com/2025-01-21T12:00:00Z/t_2m:C/wind_gusts_10m_1h:ms/${latitude},${longitude}/47.42,9.37_47.46,9.04:10+47.51,8.78:10+47.39,8.57:10/json`;
    https: console.log("Fetching weather data from:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${oauthToken}` },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`
      );
    }

    const data2 = await response.json();
    console.log("Weather Data:", data2);

    if (
      data2 &&
      data2.data &&
      data2.data.length > 0 &&
      data2.data[0].coordinates
    ) {
      const temperatureValue = data2.data[0].coordinates[0].dates[1].value;
      temperature.innerHTML = `${temperatureValue}°C`;
      console.log(`Temperature: ${temperatureValue}°C`);
    } else {
      temperature.innerHTML = "Temperature data not available";
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    temperature.innerHTML = "Failed to fetch temperature data";
  }
}

async function getData(cityname) {
  try {
    let header = new Headers();
    header.set("X-Api-Key", "lUIGfjAuln7SuSF2fzKpig==hqIA07DXQPrAW8ev");
    const response = await fetch(
      `https://api.api-ninjas.com/v1/city?name=${cityname}`,
      {
        headers: header,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("City Data:", data);

    if (data.length > 0) {
      city.innerHTML = data[0].name;
      console.log(`City: ${data[0].name}`);
      getData2(data[0].latitude, data[0].longitude); 
    } else {
      city.innerHTML = "City not found";
    }
  } catch (error) {
    console.error("Error fetching city data:", error.message);
    city.innerHTML = "Failed to fetch city data";
  }
}

function Citysearch() {
  let s = cityInput.value.trim();
  if (s) {
    getData(s);
  } else {
    city.innerHTML = "Please enter a city name.";
    temperature.innerHTML = ""; 
  }
}


search.addEventListener("submit", function (event) {
  event.preventDefault();
  Citysearch();
});

