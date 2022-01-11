var APIKey = '19215b808e4da24575c4df52faa9c71f';
var baseURL = 'https://api.openweathermap.org/data/2.5/';


//Takes the city name or zip code from the user and searches for the weather.
function searchByCity(city) {
    city = $.trim(city);
    city =toTitleCase(city);
    getWeatherReportByCity(city).then(function(data){
        addToLocalStorage(city);
        addListOfSearchedCities();
        const curDayText = $('.current-text');
        const curDayObj = data['current'];
        clearDisplays();
//Creates the weather cards with the date, location, icons, and any data.
        curDayText.siblings('.fas').append('<br>' +  '<div class="text">'+ moment().format('LL') + '</div>');
        curDayText.siblings('.fas').append('<br>' +  '<div class="text">'+city + '</div>');

        curDayText.append('Temp: '+ curDayObj['curTemp'] + ' °F<br>');
        curDayText.append('Humidity: ' + curDayObj['humidity']+'%<br>');
        curDayText.append('Wind: ' + curDayObj['windSpeed'] + 'mph<br>');
        $('<div>UV Index: ' + curDayObj['uvi'] + '</div>').appendTo(curDayText).addClass('uvi');

        curDayText.siblings('.fas').append('<p'+ curDayObj['description'] + '</p>');

        addIcons(curDayText.siblings('.fas'), curDayObj['description']);

        checkUVI( curDayObj['uvi']);
        $('.results-container').removeClass('hidden');

        for (var i = 0; i < 5; i++){
            const curDayObj = data['forecast'][i];
            const curCard  = $('.future-text').eq(i);
            curCard.siblings('.fas').append('<br><div class="text"> ' + moment(moment().add(i+1, 'days')).format('LL')+ '</div>');
            curCard.siblings('.fas').append('<p'+ curDayObj['description'] + '</p>');
            curCard.append('<p>Max Temp: '+ curDayObj['maxTemp'] + ' °F</p>');
            curCard.append('<p>Humidity: ' + curDayObj['humidity']+'%</p>');
            curCard.append('<p>Wind: ' + curDayObj['windSpeed'] + 'mph</p>');
            addIcons(curCard.siblings('.fas'), curDayObj['description']);
        }
    }
    //TODO Add catch for modal?
    );
} 


//Turns the search queries into title case regardless of how they were input
function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

//This function is used to add the searched cities to the localStroage
function addToLocalStorage(city){
    var listOfSearchedCities = JSON.parse(localStorage.getItem('listOfCities'));
    if (listOfSearchedCities){
        if (listOfSearchedCities.includes(city)) {
            listOfSearchedCities.splice(listOfSearchedCities.indexOf(city), 1);
            console.log('in if statement')
        }
        listOfSearchedCities.unshift(city);
        localStorage.setItem('listOfCities', JSON.stringify(listOfSearchedCities));
    }else{
        localStorage.setItem('listOfCities', JSON.stringify([city]));
    }


}

function addListOfSearchedCities(){
    const listOfCities = JSON.parse(localStorage.getItem('listOfCities'));
    const listGroup = $('.list-group');
    listGroup.empty();
    if(listOfCities){
        for (var i = 0; i< listOfCities.length; i++) {
            var city = listOfCities[i]
            //Creates the button with the city name as the ID by passing it into the sanitizeString function to remove any spaces in the middle of the name
            $('<li><button>' + city + '</button></li>').addClass("list-group-item list-group-item-action").attr('id',sanitizeString(city)).appendTo(listGroup);
            city = sanitizeString(city);
            $('#'+city).click(function(event){     
                 //When the button is clicked, the ID is taken and passed into the sanitizeString function where and '_' will be replaced with spaces
                 //It is then passed into the searchByCity function to gather the updated forecast.
                searchByCity(sanitizeString(this.id))
            });
        }
    }
}


//Sanitizes the city name. This allows the city to be used as the button ID so it can be searched for when the button is clicked/
function sanitizeString(string){
    if (string.indexOf(' ') >= 0) {
        string = string.replace(/\s/g, '_')

    }else {
        string = string.replace(/_/g, ' ')
    }
    return string;
}


//Updates the UVI background to corelate to what the severity is.
function checkUVI(uvi){
    const uviDisplay = $('.uvi');
    if (uvi <= 2 ) {
        uviDisplay.css({"background-color": "green", "border-radius":'5px', "width":'fit-content', 'padding':'2px'});
    }else if (uvi <= 5 ) {
        uviDisplay.css({"background-color": "yellow", "border-radius":'5px', "width":'fit-content', 'padding':'2px'});
    }else if (uvi <= 7 ) {
        uviDisplay.css({"background-color": "orange", "border-radius":'5px', "width":'fit-content', 'padding':'2px'});
    }else {
        uviDisplay.css({"background-color": "red", "border-radius":'5px', "width":'fit-content', 'padding':'2px'});
    }
}

//Adds icons based on the contents of the description that is passed in
function addIcons(day, description){
    if (description.includes('lightening')|| description.includes('thunder')) {
        day.addClass('fa-bolt');
    } else if (description.includes('rain')) {
        day.addClass('fa-cloud-rain');
    } else if (description.includes('wind')) {
        day.addClass('fa-wind');
    } else if (description.includes('snow')|| description.includes('freezing')) {
        day.addClass('fa-snowflake');
    } else if (description.includes('cloud') || description.includes('overcast')) {
       day.addClass('fa-cloud');
     }
    else {
        day.addClass('fa-sun');
    }
}

//Uses the city name (or zip code) to get the longitude and latitude by calling the getLongAndLat function and then passes it into getWeatherByLongAndLat to get the 5day forecast

function getWeatherReportByCity(city) {
    return getLongAndLat(city).then(function(data){  
          return getWeatherByLongAndLat(data['lat'], data['long']);
        }
    )
}


//uses the city name or zip code to get the longitude and latitude needed to get the five day forecast
function getLongAndLat(city){
  var getLogLatUrl = encodeURI(baseURL+'/weather?q=' + city + "&appid=" + APIKey);
    return fetch(getLogLatUrl).then(response => response.json()).then(function(data){
        return {
            lat: data['coord']['lat'],
            long: data['coord']['lon']
        };
    })
}


//Uses the longitude and latitude to get the 5day forecast
function getWeatherByLongAndLat(lat, long) {
    var queryURL  = encodeURI(baseURL + 'onecall?lat=' + lat +'&lon='+ long + '&exclude=hourly,minutely&units=imperial&appid=' + APIKey);
    return fetch(queryURL).then(response => response.json()).then(function(data){
        const forecastDays = [];
//Gets the forecast information and adds it to an object
        for (var i = 0; i < 5; i++) {
            const day = data['daily'][i];
            forecastDays.push({
                minTemp: day['temp']['min'],
                maxTemp: day['temp']['max'],
                feelsLikeDayTemp: day['feels_like']['day'],
                humidity: day['humidity'],
                windSpeed: day["wind_speed"],
                condition: day['weather'][0]['main'],
                description: day['weather'][0]['description']
            });
        }

        const currentWeather = data['current'];
        //Adds the current weather information to the forecast object before returning the object
        return {
            current : {
                curTemp : currentWeather['temp'],
                feelsLinkTemp: currentWeather['feels_like'],
                uvi: currentWeather['uvi'],
                humidity: currentWeather['humidity'],
                windSpeed: currentWeather["wind_speed"],
                condition: currentWeather['weather'][0]['main'],
                description: currentWeather['weather'][0]['description']

            },
            forecast: forecastDays
        };
    })
}


//Clears the current display to keep from appending things on. 
function clearDisplays(){
    $('.card-text').empty();
    $('.fas').empty();
    $('.results-container').addClass('hidden');

}


function main() {

   $('.search-button').click(function(){
       searchByCity($('#location-search').val())})
   addListOfSearchedCities();
}

main();
