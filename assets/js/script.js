var userCityInput = $('#user-city');
var searchButton = $('#search-button');
var notFound = $('#city-not-found');
var closeErrorButton = $('#close-error');

var getUserCity = function(event) {
    event.preventDefault();
    var userCity = userCityInput.val();
    console.log(userCity);

    getWeather(userCity);
};


var getWeather = function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            var currentWeather = data.current;
            console.log(currentWeather);
            displayCurrentWeather(currentWeather);
        })
        .catch(function(error) {
            notFound.show();
        });
};

var displayCurrentWeather = function(data) {
    var currentWeatherCard = $('<div></div>');
    currentWeatherCard.attr('class', 'card p-2');

    var today = new Date().toLocaleDateString();
    var cityName = userCityInput.val();

    var weatherIconSpan = $('<span></span>');

    var weatherIcon = $('<img>');
    var iconCode = data.weather[0].icon;
    weatherIcon.attr('src', 'http://openweathermap.org/img/wn/' + iconCode + '.png');
    weatherIconSpan.append(weatherIcon);

    var city = $('<h2></h2>');
    city.attr('class', 'card-title');
    city.text(`${cityName} (${today})`);
    city.append(weatherIconSpan);
    currentWeatherCard.append(city);
 
    var temp = $('<p></p>');
    temp.attr('class', 'card-text');
    temp.text(`Temp: ${data.temp}°F`);
    currentWeatherCard.append(temp);

    var wind = $('<p></p>');
    wind.attr('class', 'card-text');
    wind.text(`Wind: ${data.wind_speed} MPH`);
    currentWeatherCard.append(wind);

    var humidity = $('<p></p>');
    humidity.attr('class', 'card-text');
    humidity.text(`Humidity: ${data.humidity} %`);
    currentWeatherCard.append(humidity);

    var uvIndex = $('<p></p>');
    uvIndex.attr('class', 'card-text');
    uvIndex.text(`UV Index: `)

    var index = $('<button></button>');
    index.text(`${data.uvi}`);
    uvIndex.append(index);
    currentWeatherCard.append(uvIndex);
    console.log(index.text);

    if (data.uvi >= 0 && data.uvi <= 2) {
        index.attr('class', 'btn btn-sm pe-none btn-success');

    } else if (data.uvi > 2 && data.uvi < 6) {
        index.attr('class', 'btn btn-sm pe-none btn-warning');

    } else if (data.uvi > 6 && data.uvi < 8) {
        index.attr('class', 'btn btn-sm pe-none');
        index.attr('style', 'background-color: #fd7e14');

    } else if (data.uvi > 8 && data.uvi < 11) {
        index.attr('class', 'btn btn-sm pe-none btn-danger');

    } else {
        index.attr('class', 'btn btn-sm pe-none');
        index.attr('style', 'background-color: #6f42c1; color: white');

    }
   
    
    // currentWeatherCard.text(weather.clouds);
    $('#current-weather').append(currentWeatherCard);

};

var closeError = function(event) {
    event.preventDefault();
    notFound.hide();
};

// var clearInput = function(event) {
//     event.preventDefault();
//     userCityInput.setAttribute('placeholder', userCityInput.value);
//     userCityInput.value = '';
// }


searchButton.on('click', getUserCity);
closeErrorButton.on('click', closeError);
// userCityInput.addEventListener('click', clearInput);
