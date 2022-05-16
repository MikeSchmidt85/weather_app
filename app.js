const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current_weather_items");
const timeZoneEl = document.getElementById("time_zone");
const countryEl = document.getElementById("cuntry");
const weatherForecastEl = document.getElementById("weather_forecast");
const currentTempEl = document.getElementById("current_temp");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const API_KEY = "faf365491d4db6b2509ca0bbbfc601d9";
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 == "PM" || "AM";

    timeEl.innerHTML = hoursIn12HrFormat + ":" + minutes + `<span id="am-pm>${ampm}</span>`

    dateEl.innerHTML = days[day] + ", " + date + " " + months[month]

}, 1000)

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    currentWeatherItemsEl.innerHTML =
        `<div class="weather_item">
    <div>Humidity</div>
    <div>${humidity} %</div>
</div>
<div class="weather_item">
    <div>Wind Speed</div>
    <div>${wind_speed} mph</div>
</div>
<div class="weather_item">
    <div>Pressure</div>
    <div>${pressure} inHg</div>
</div>
<div class="weather_item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
</div>
<div class="weather_item">
    <div>Sunsut</div>
    <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
</div>`;

let otherDayForecast = " "
    data.daily.forEach((day, idx) => {
        if (idx == 0) {

        } else {
            otherDayForecast += `
        <div class="weather_forecast" id="weather_forecast">
        <div class="weather_forcast_item">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w_icon">
            <div class="temp">Day - ${day.temp.day}</div>
            <div class="temp">Night - ${day.temp.night}</div>
        </div>
    </div>`
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}