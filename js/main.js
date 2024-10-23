const cityInput = document.querySelector('.city-input');
const searchbtn = document.querySelector('.search-button');

const apiKey = '1332ee45e3fadb54fd2bce49dc954867';

const notFoundSection = document.querySelector('.not-found');
const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const currentDateTxt = document.querySelector('.current-date-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const HumidityValueTxt = document.querySelector('.Humidity-value-txt');
const WindValueTxt = document.querySelector('.Wind-value-txt');
const weatherSummeryImg = document.querySelector('.weather-summery-img');


const forcastItemsContainer = document.querySelector('.forcast-items-container');


searchbtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        //console.log(cityInput.value.trim());
        cityInput.value = '';
        cityInput.blur();
    }
})

cityInput.addEventListener('keydown', (e) => {
    //console.log(e);
    if (e.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        //console.log(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }

})
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    console.log(weatherData);
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }
    //destruct 
    const {
        main: { temp, humidity },
        name: country,
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;


    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + '°C';
    HumidityValueTxt.textContent = humidity + '%';
    conditionTxt.textContent = main;
    WindValueTxt.textContent = speed + 'M/S';
    weatherSummeryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    currentDateTxt.textContent = getCurrentDate();
    await updateForecastInfo(city);
    showDisplaySection(weatherInfoSection);


}

function showDisplaySection(section) {


    [notFoundSection, weatherInfoSection, searchCitySection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex';

}

function getWeatherIcon(id) {

    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const date = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return date.toLocaleDateString('en-GB', options);
}


async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    console.log(forecastData);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];
    forcastItemsContainer.innerHTML = '';
    forecastData.list.forEach(forcastsData => {
        if (forcastsData.dt_txt.includes(timeTaken) && !forcastsData.dt_txt.includes(todayDate)) {
            updateForcastItems(forcastsData);
        }
        // console.log(forcastsData);

    })

}

function updateForcastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;
    const dayTaken = new Date(date)
    const options = {

        day: '2-digit',
        month: 'short'
    };
    let dateResult = dayTaken.toLocaleDateString('en-US', options);

    const forecastItem = `<div class="forcast-item">
                    <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forcast-item-img">
                    <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
                </div>`;

    forcastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);

}