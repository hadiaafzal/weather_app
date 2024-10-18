function toolTipReset() {
    // Add the logic to reset the tooltip here
    console.log('Tooltip reset triggered');
}
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();


    $('[data-toggle="tooltip"]').on('focusout mouseleave', function () {
        $(this).tooltip('hide');
    });

});


// Function to fetch weather data from 7Timer API
function fetchWeatherData(lat, lon) {
    const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;



    // Clear any previous weather data
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    // Show the loading message
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'block';  // Show the "Getting Forecast..." message

    // Fetch weather data from the API
    fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Call the function to display the weather data
            displayWeatherData(data);

            // Hide the loading message after data is successfully received
            loadingMessage.style.display = 'none';

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);

            // Hide the loading message if there's an error
            loadingMessage.style.display = 'none';
        });
}

// Function to display the weather data on the webpage
function displayWeatherData(data) {
    const weatherContainer = document.getElementById('weather-container');

    // Clear any existing content
    weatherContainer.innerHTML = '';

    // Limit the forecast to 7 days
    const forecastData = data.dataseries.slice(0, 7);


    // Get the current date
    let currentDate = new Date();


    forecastData.forEach((forecast, index) => {

        // Create a new date instance for each forecast day
        const forecastDate = new Date(currentDate);
        forecastDate.setDate(currentDate.getDate() + index); // Increment by index days
        // Manually format the date as "Day, Month Date" without extra spaces or commas
        const day = forecastDate.toLocaleString('en-US', { weekday: 'short' });
        const month = forecastDate.toLocaleString('en-US', { month: 'short' });
        const date = forecastDate.getDate();
        const formattedDate = `${day} ${month} ${date}`;

        const liftedIndex = forecast.lifted_index; // Access the lifted_index if available
        let tempHigh, tempLow;

        if (forecast?.temp2m !== undefined) {
            if (liftedIndex < 0) {
                // If there's instability, increase temp2m for high temperature
                tempHigh = forecast.temp2m + Math.abs(liftedIndex);
            } else {
                tempHigh = forecast.temp2m + 2; // Arbitrary increase
            }
            tempLow = forecast.temp2m - 2; // Decrease for low temp
        } else {
            tempHigh = 'N/A';
            tempLow = 'N/A';
        }
        // Round temperatures to avoid decimals (optional)
        tempHigh = Math.round(tempHigh);
        tempLow = Math.round(tempLow);

        console.log(forecast);

        // Set the weather description and icon
        const weatherDescription = getWeatherDescription(forecast.weather);
        const weatherIcon = getWeatherIcon(forecast.weather);



        console.log(forecast.weather, weatherIcon);
        // Construct the forecast display
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-block');
        forecastElement.innerHTML = `
            <div class="top-section">
               <h3>${formattedDate}</h3> 
                <div class="forecast-icon">
                    <img src="${weatherIcon}" alt="${weatherDescription}">
                    </div>
                    </div>
            <div class="bottom-section">
            <div><strong><p>${forecast.weather}</p></strong></div>
                <p>H:${tempHigh} °C</p> 
                <p>L:${tempLow} °C</p>
            </div>            
        `;
        // Append each forecast element to the container
        weatherContainer.appendChild(forecastElement);
    });
}

function getWeatherDescription(code) {
    const weatherConditions = {
        'clear': 'Clear',
        'clearday': 'Clear',  // Treat clearday the same as clear
        'clearnight': 'Clear Night',  // Custom description for clear night
        'pcloudy': 'Partly Cloudy',
        'pcloudyday': 'Partly Cloudy',  // Treat pcloudyday as partly cloudy
        'pcloudynight': 'Partly Cloudy Night',  // Custom description for partly cloudy night
        'mcloudy': 'Mostly Cloudy',
        'mcloudyday': 'Mostly Cloudy',  // Treat mcloudyday as mostly cloudy
        'mcloudynight': 'Mostly Cloudy Night',  // Custom description for mostly cloudy night
        'cloudy': 'Cloudy',
        'cloudyday': 'Cloudy',  // Treat cloudyday as cloudy
        'cloudynight': 'Cloudy Night',  // Custom description for cloudy night
        'rain': 'Rainy',
        'snow': 'Snowy',
        'ts': 'Thunderstorm',
        'wind': 'Windy',
        'lightrain': 'Light Rain',
        'lightrainnight': 'Light Rain Night',  // Custom description for light rain at night 
        'oshower': 'Occasional Showers',  // Description for oshower
        'ishower': 'Isolated Showers',  // Add isolated shower description 
        'oshowernight': 'Ocassional Showers At Night',
        'oshowerday': 'Ocassional Showers At Day',
        // Add more conditions as necessary
    };

    return weatherConditions[code] || 'Unknown';  // Return "Unknown" if code is not found
}


function getWeatherIcon(code) {
    const weatherIcons = {
        'clear': 'images/clear.png',  // Clear weather icon
        'clearday': 'images/clear.png',  // Treat clearday the same as clear
        'clearnight': 'images/clear.png',  // Different icon for clear night
        'pcloudy': 'images/pcloudy.png',  // Partly cloudy
        'pcloudyday': 'images/pcloudy.png',  // Same icon for partly cloudy day
        'pcloudynight': 'images/pcloudy.png',  // Different icon for partly cloudy night
        'mcloudy': 'images/mloudy.png',  // Mostly cloudy
        'mcloudyday': 'images/mcloudy.png',  // Mostly cloudy day
        'mcloudynight': 'images/mcloudy.png',  // Mostly cloudy night
        'cloudy': 'images/cloudy.png',  // Cloudy
        'cloudyday': 'images/cloudy.png',  // Cloudy during day
        'cloudynight': 'images/cloudy.png',  // Cloudy at night
        'rain': 'images/rain.png',  // Rainy weather
        'snow': 'images/snow.png',  // Snowy weather
        'ts': 'images/tstorm.png',  // Thunderstorm
        'wind': 'images/windy.png',  // Windy
        'lightrain': 'images/rain.png',  // Light rain
        'lightrainnight': 'images/rain.png',  // Light rain at night
        'lightrainday': 'images/rain.png',
        'thunderstormrain': 'images/tsrain.png',
        'oshower': 'images/oshower.png',
        'oshowernight': 'images/oshower.png',
        'oshowerday': 'images/oshower.png',
        'rainsnow': 'images/rainsnow.png',
        'humid': 'images/humid.png',
        'humidday': 'images/humid.png',
        'humidnight': 'images/humid.png',
        'ishower': 'images/ishower.png',
        'ishowerday': 'images/ishower.png',
        'ishowernight': 'images/ishower.png',

        // Add any more codes as needed
    };

    return weatherIcons[code] || 'images/default.png';  // Return default icon if code is not found
}


// Function to handle dropdown change event
function onCityChange(event) {
    // Get the selected city data (latitude and longitude)
    const selectedCity = JSON.parse(event.target.value);

    // Fetch weather data for the selected city
    fetchWeatherData(selectedCity.lat, selectedCity.lon);
}

// Attach event listener to the dropdown
const cityDropdown = document.getElementById('citySelected');
cityDropdown.addEventListener('change', onCityChange);
