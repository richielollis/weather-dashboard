// declaring different variables to be used throughout
var userCityInput = $('#user-city');
var searchButton = $('#search-button');
var notFound = $('#city-not-found');
var closeErrorButton = $('#close-error');
var searchHistory = $('<div></div>');
searchHistory.attr('class', 'd-grid m-3 overflow-auto').attr('id', 'search-history');
searchHistory.css('height', '100px');
searchHistory.css('max-height', '300px');

//setting empty array to house searched citiy names
var searchHistoryArr = [];

// grabs the city that the user is searching and passes it to getWeather function
var getUserCity = function(event) {
    event.preventDefault();
    var userCity = userCityInput.val();
    getWeather(userCity);
};

// grabs all the info we need from the api's
// we through the city to the first fetch in order to grab the lat and lon for the second fetch to return the weather
var getWeather = function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            // checks search history array to see if city is name is there, if not then we push it to the array
            if(!searchHistoryArr.includes(data.name)) {
                searchHistoryArr.push(data.name);

            }
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            // grabing current day weather and 5 day forecast 
            var currentWeather = data.current;
            var fiveDayForecast = data.daily;
            // calling functions and passing the correct data along
            displaySearchHistory(userCityInput.val());
            displayCurrentWeather(currentWeather);
            getFiveDay(fiveDayForecast);
        })
        .catch(function(error) {
            notFound.show();
            searchHistoryArr.pop();
        });
};

// displays the surrent same day weather for the city that user searched 
var displayCurrentWeather = function(data) {
    $('#current-weather').empty();

    // creates a current weather card 
    var currentWeatherCard = $('<div></div>');
    currentWeatherCard.attr('class', 'card p-3 pb-4 m-3');

    // declaring the date the user searched
    var today = new Date().toLocaleDateString();
    var cityName = userCityInput.val();

    // span for image of weather (clouds, sun, partial clouds, etc.)
    var weatherIconSpan = $('<span></span>');

    // weather image
    var weatherIcon = $('<img>');
    var iconCode = data.weather[0].icon;
    weatherIcon.attr('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png');
    weatherIconSpan.append(weatherIcon);

    // add city name to card
    var city = $('<h2></h2>');
    city.attr('class', 'card-title');
    city.text(`${cityName} (${today})`);
    city.append(weatherIconSpan);
    currentWeatherCard.append(city);
    
    //add temp to card
    var temp = $('<p></p>');
    temp.attr('class', 'card-text');
    temp.text(`Temp: ${data.temp}°F`);
    currentWeatherCard.append(temp);

    //add wind speed to card
    var wind = $('<p></p>');
    wind.attr('class', 'card-text');
    wind.text(`Wind: ${data.wind_speed} MPH`);
    currentWeatherCard.append(wind);

    // add humidity to card
    var humidity = $('<p></p>');
    humidity.attr('class', 'card-text');
    humidity.text(`Humidity: ${data.humidity} %`);
    currentWeatherCard.append(humidity);

    // add uv index to card
    var uvIndex = $('<p></p>');
    uvIndex.attr('class', 'card-text');
    uvIndex.text(`UV Index: `)

    // make uv index responsive to show different uv levels
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
   
    // append weather card to the current weather div
    $('#current-weather').append(currentWeatherCard);
};

// this function does exactly what the displayCurrentWeather function does, except its for the 5 day forecast
var getFiveDay = function(data) {
    $('#five-day').empty();
    var header = $('<h3></h3>');
    header.attr('class', 'ms-3')
    header.text('5-Day Forecast:')
    $('#five-day').append(header);

    for (let i = 0; i < 5; i++) {
        var dailyWeather = data[i];

        var day = new Date();
        day.setDate((day.getDate() + 1) + i);

        var fiveDayCard = $('<div></div>');
        fiveDayCard.attr('class', 'col-sm-12 col-md-2 m-1 card text-bg-primary p-2');
    
        var weatherIconSpan = $('<span></span>');

        var date = $('<h5></h5>');
        date.attr('class', 'card-title');
        date.text(`${day.toLocaleDateString()}`);
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

// displays the search history
var displaySearchHistory = function(city) {
    console.log(searchHistoryArr)
    searchHistory.html('');
    for (let i = 0; i < searchHistoryArr.length; i++) {
        var cityButton = $('<button></button>');
        cityButton.css('height', '50px');
        cityButton.attr('class', 'btn btn-outline-secondary mb-4 p-2');
        cityButton.text(searchHistoryArr[i]);
        cityButton.on('click', searchHistoryHandler);
        $(searchHistory).append(cityButton);
        console.log(city);
    }
    console.log($('#city-button').text())
    $('#search').append(searchHistory);
    
};

// allows user to click a previously searched city and see the weather again
var searchHistoryHandler = function(event) {
    event.preventDefault();
    var city = $(this).text();
    userCityInput.val(city);
    console.log(city);
    getWeather(city);
};

// allows user to close error modal
var closeError = function(event) {
    event.preventDefault();
    notFound.hide();
};

// event listeners 
searchButton.on('click', getUserCity);
closeErrorButton.on('click', closeError);