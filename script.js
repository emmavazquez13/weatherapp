//Variables for our DOM elements, input field, button, 
var inputEl = document.getElementById("input-el")
var submitBtn = document.getElementById("submit-btn")
var currentWeather = document.getElementById("current-weather")
//Variables refer to weather API 
var apiKey = "4ad191499866afffbda878f24c4c81c4"
//Variables to capture city name 
var city 
//Array for search history
var searchHistory = []

// Create a function to grab user input 
function grabInput(event) {
    event.preventDefault()
    // Variable for user input 

    var userInput = inputEl.value 
    getCoordinates(userInput)
}

// This function gets geographical coordinates for user input 
function getCoordinates(location) {
    // Uses the fetch method to use geocoding API 
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            getWeather(data)
            getForecast(data)
        })
        .catch()
}

function getForecast(city){
    console.log(city)
    // variables for lat and lon 
    var lat = city[0].lat
    console.log(lat)
    var lon = city[0].lon
    console.log(lon)
    // uses the fetch method to acces one call API
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => renderForecast(data))
        .catch()
}

// This function is getting the current and future weather conditions for city searched by user 
function getWeather(cityInformation) {
    console.log(cityInformation)
    // variables for lat and lon 
    var lat = cityInformation[0].lat
    console.log(lat)
    var lon = cityInformation[0].lon
    console.log(lon)
    // uses the fetch method to acces one call API
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => renderWeather(data))
        .catch()
}

// This function is in charge of saving the search history to local storage
function saveCity(){
    console.log(city)
    console.log(searchHistory)

    //If statement to check if the city is already in the search history array 
    if (searchHistory.includes(city)){
        console.log(`The search history array already includes ${city}`)
    } else {
        searchHistory.push(city)
        console.log(searchHistory)
        localStorage.setItem('city array', JSON.stringify(searchHistory))
    }
    
}
// This function gets history from local storage 
function getHistory(){
    // check local storage to see if search history 
    if (localStorage.getItem("city array")){
        var retrievedData = localStorage.getItem("city array");
        searchHistory = JSON.parse(retrievedData);
        console.log(searchHistory)
    } else {
        console.log("There is nothing in local storage");
    } 
}

// This function renders the weaether conditions 
function renderWeather(info){
    // Clear out info from current weather DIV 
    currentWeather.innerHTML = ""
    // Grabs the city name of of the API response and saves to global scope
    console.log(info)
    console.log(info.weather[0].icon)
    city = info.name
    saveCity()
    // Varibales for weather conditions 
    // Uses the new date constructer to convert into a readable date 
    // https://www.coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
    var date = new Date(info.dt * 1000)
    console.log(date)
    var icon = info.weather[0].icon
    var temp = info.main.temp // convert K into F (0K − 273.15) × 9/5 + 32 = -459.7°F
    temp = Math.round((temp - 273.15) * 9/5 + 32)
    console.log(temp)
    var wind 
    var hum 


    // create element for each of the weather info variable 
    var headingEl = document.createElement("h2")
    headingEl.innerText = `${city}, ${date}`
    var tempEl = document.createElement("p")
    tempEl.innerText = `${temp}°`
    var iconEl = document.createElement("img")
    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`)
    console.log(iconEl)

    // append weather info to the DOM 
    currentWeather.append(headingEl)
    currentWeather.append(tempEl)
    currentWeather.append(iconEl)
}

// This function renders the future weather conditions 
function renderForecast(info){
    console.log(info)
}
//Listen for clicks 
submitBtn.addEventListener("click", grabInput)

//Reterive search history 
getHistory()


/* 

GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, 
the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather 
conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city 
*/