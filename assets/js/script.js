var userCityInput = $('#user-city');
var searchButton = $('#search-button');
var notFound = $('#city-not-found');
var closeErrorButton = $('#close-error');
var searchHistory = $('<div></div>');
searchHistory.attr('class', 'd-grid m-3').attr('id', 'search-history');
var cityButtons = $('<div></div>');

var searchHistoryArr = [];

var getUserCity = function(event) {
    event.preventDefault();
    var userCity = userCityInput.val();
    getWeather(userCity);
};

var displaySearchHistory = function(city) {
    console.log(searchHistoryArr);
    for (let i = 0; i < searchHistoryArr.length; i++) {
        var cityButton = $('<button></button>');
        cityButton.attr('class', 'btn btn-outline-secondary mb-4 p-2');
        cityButton.text(searchHistoryArr[i]);
        $(searchHistory).append(cityButton);
    }
    $('#search').append(searchHistory);
};

var searchHistoryHandler = function(event) {
    event.preventDefault();
    var city = cityButton.text();
    console.log(city);
    getWeather(city);
};


var getWeather = function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            searchHistoryArr.push(data.name);
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            var currentWeather = data.current;
            var fiveDayForecast = data.daily;
            console.log(fiveDayForecast)
            displaySearchHistory(userCityInput.val());
            displayCurrentWeather(currentWeather);
            getFiveDay(fiveDayForecast);
        })
        .catch(function(error) {
            notFound.show();
            searchHistoryArr.pop();
        });
};

var displayCurrentWeather = function(data) {
    $('#current-weather').empty();

    var currentWeatherCard = $('<div></div>');
    currentWeatherCard.attr('class', 'card p-3 pb-4 mt-3 mb-3 me-3 ms-1');

    var today = new Date().toLocaleDateString();
    var cityName = userCityInput.val();

    var weatherIconSpan = $('<span></span>');

    var weatherIcon = $('<img>');
    var iconCode = data.weather[0].icon;
    weatherIcon.attr('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png');
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
   
    $('#current-weather').append(currentWeatherCard);
};

var getFiveDay = function(data) {
    $('#five-day').empty();
    var header = $('<h3></h3>');
    header.attr('class', '')
    header.text('5-Day Forecast:')
    $('#five-day').append(header);

    for (let i = 0; i < 5; i++) {
        var dailyWeather = data[i];
        console.log(dailyWeather);

        var day = new Date();
        day.setDate((day.getDate() + 1) + i);
        console.log(day.toLocaleDateString());

        var fiveDayCard = $('<div></div>');
        fiveDayCard.attr('class', 'col-sm-12 col-md-2 card text-bg-primary p-2 ms-2 me-3');
        // fiveDayCard.attr('style', 'width: 20rem')
    
        var weatherIconSpan = $('<span></span>');

        var date = $('<h5></h5>');
        date.attr('class', 'card-title');
        date.text(`${day.toLocaleDateString()}`);
        // date.append(weatherIcon);
        fiveDayCard.append(date);
    
        var weatherIcon = $('<img>');
        var iconCode = dailyWeather.weather[0].icon;
        weatherIcon.attr('src', 'http://openweathermap.org/img/wn/' + iconCode + '.png');
        weatherIconSpan.append(weatherIcon);
        fiveDayCard.append(weatherIconSpan); 
    
        var temp = $('<p></p>');
        temp.attr('class', 'card-text');
        temp.text(`Temp: ${dailyWeather.temp.day}°F`);
        fiveDayCard.append(temp);
    
        var wind = $('<p></p>');
        wind.attr('class', 'card-text');
        wind.text(`Wind: ${dailyWeather.wind_speed} MPH`);
        fiveDayCard.append(wind);
    
        var humidity = $('<p></p>');
        humidity.attr('class', 'card-text');
        humidity.text(`Humidity: ${dailyWeather.humidity} %`);
        fiveDayCard.append(humidity);

        $('#five-day').append(fiveDayCard);
    }
};

var closeError = function(event) {
    event.preventDefault();
    notFound.hide();
    console.log(searchHistoryArr);
};

searchButton.on('click', getUserCity);
cityButton.on('click', searchHistoryHandler);
closeErrorButton.on('click', closeError);