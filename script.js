// REPLACE THIS WITH YOUR ACTUAL OPENWEATHERMAP API KEY
const API_KEY = 'e33335ed2f7a7754147668e90f6c27c2'; 

const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const errorMsg = document.getElementById('error');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherDataByCity(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) getWeatherDataByCity(city);
    }
});

geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherDataByCoords(lat, lon);
            },
            () => {
                showError("Location access denied. Please type your city manually.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
});

// Fetch Weather by City Name
async function getWeatherDataByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    fetchData(url);
}

// Fetch Weather by Coordinates (User Location)
async function getWeatherDataByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    fetchData(url);
}

// Core fetch and render function
async function fetchData(url) {
    try {
        errorMsg.style.display = "none";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("City not found. Please try again.");
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
        weatherDisplay.style.display = "none";
    }
}

// Update UI with Data
function displayWeather(data) {
    document.getElementById('location-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weather-desc').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

    weatherDisplay.style.display = "block";
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
}