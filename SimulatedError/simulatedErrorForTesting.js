// Extract latitude and longitude from the Google Maps URL
const mapUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=52.3465%2C-1.74551&markers=color%3Ared%7Clabel%3ANT%7C52.3465%2C-1.74551&zoom=13&size=400x300&key=AIzaSyDKIzOcpR-5CcJAWJjkEJWNz-\\_8W7lKsmY&signature=ThbzrsZAuwRTtOs4IsWqEoSWNxg=';
const urlParams = new URLSearchParams(new URL(mapUrl).search);
const center = urlParams.get('center');
const [lat, lng] = center.split(',');

// Construct the weather API URL
const apiKey = 'a2ef86c41a'; // Mock API key provided in the brief
const weatherUrl = `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=${apiKey}&lat=${lat}&lon=${lng}`;

// Function to convert a string to sentence case
function toSentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Fetch weather data from the API
fetch(weatherUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Log the data object to the console
    throw new Error('Simulated error for testing'); // Simulate an error for testing purposes

    // Process the weather data
    const temperature = Math.round(data.list[0].main.temp); // Round the temperature to the nearest whole number
    const description = toSentenceCase(data.list[0].weather[0].description); // Convert the weather description to sentence case
    const iconCode = data.list[0].weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    // Create the weather container
    const weatherContainer = document.createElement('div');
    weatherContainer.classList.add('weather-container');

    // Create the current weather element
    const todayWeather = document.createElement('div');
    todayWeather.classList.add('current-weather');
    todayWeather.innerHTML = `
      <h4 style="font-family: NationalTrustTT, Georgia, serif; color: #007A3B">Today</h4>
      <img id="weather-icon" src="${iconUrl}" alt="Weather Icon">
      <p style="font-family: NationalTrustTT, Georgia, serif;">${temperature}°C</p>
      <p style="font-family: NationalTrustTT, Georgia, serif;">${description}</p>
    `;
    weatherContainer.appendChild(todayWeather);

    // Process the forecast data
    const forecastDays = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-GB', { weekday: 'short' });

      if (!forecastDays[day]) {
        forecastDays[day] = {
          temp: [],
          icon: item.weather[0].icon,
          description: item.weather[0].description
        };
      }
      forecastDays[day].temp.push(item.main.temp);
    });

    // Create the forecast elements
    Object.entries(forecastDays).slice(0, 5).forEach(([day, { temp, icon, description }]) => {
      const avgTemp = Math.round(temp.reduce((a, b) => a + b) / temp.length);
      const formattedDescription = toSentenceCase(description);

      const dayElement = document.createElement('div');
      dayElement.classList.add('forecast-item');
      dayElement.innerHTML = `
        <h4 style="font-family: NationalTrustTT, Georgia, serif;">${day}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        <p style="font-family: NationalTrustTT, Georgia, serif;">${avgTemp}°C</p>
        <p style="font-family: NationalTrustTT, Georgia, serif;">${formattedDescription}</p>
      `;
      weatherContainer.appendChild(dayElement);
    });

    // Append the weather container to the target container
    const targetContainer = document.querySelector('div.Gridstyle__Column-sc-sque-1.kOBmMQ.nt-col.nt-col-m12.nt-col-t6');
    targetContainer.appendChild(weatherContainer);

    // Add styling to the weather container and elements
    const style = document.createElement('style');
    style.innerHTML = `
      .weather-container {
        max-width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #edece8;
        color: #1f1f1f;
        font-size: 50%;
        padding: 10px;
      }

      .current-weather {
        text-align: center;
        margin-right: 20px;
        padding-right: 20px;
        border-right: 2px solid #007A3B;
      }

      .forecast-item {
        text-align: center;
        margin-left: 5px;
      }

      .weather-container img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 122, 59, 0.2);
        box-sizing: border-box;
      }

      .weather-container p {
        margin: 10px 0;
        font-size: 2em;
      }
    `;
    document.head.appendChild(style);
  })
  .catch(error => {
    console.error('Error:', error);

    // Display fallback message and link when API request fails
    const weatherContainer = document.createElement('div');
    weatherContainer.classList.add('weather-container');
    weatherContainer.innerHTML = `
      <p>Oops! Our weather data doesn't want to load right now.</p>
      <p>To check the weather, please follow this link: <a href="https://www.bbc.co.uk/weather" target="_blank">BBC Weather</a></p>
    `;

    const targetContainer = document.querySelector('div.Gridstyle__Column-sc-sque-1.kOBmMQ.nt-col.nt-col-m12.nt-col-t6');
    targetContainer.appendChild(weatherContainer);
  });