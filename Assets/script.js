var APIKey = '19215b808e4da24575c4df52faa9c71f';
var city;
var baseURL = 'http://api.openweathermap.org/data/2.5/';

function searchByCity(city) {
    city = $.trim(city);
    city =toTitleCase(city);
    getWeatherReportByCity(city).then(function(data){
        addToLocalStorage(city);
        addListOfSearchedCities();
        const curDayText = $('.current-text');
        const curDayObj = data['current'];
        clearDisplays();

        curDayText.siblings('.fas').append('<br>' +  '<p>'+ moment().format('LL') + '</p>');
        curDayText.siblings('.fas').append('<br>' +  '<p>'+city + '</p>');

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
            curCard.siblings('.fas').append('<br>' + moment(moment().add(i+1, 'days')).format('LL'));
            curCard.siblings('.fas').append('<p'+ curDayObj['description'] + '</p>');
            curCard.append('<p>Max Temp: '+ curDayObj['maxTemp'] + ' °F</p>');
            curCard.append('<p>Humidity: ' + curDayObj['humidity']+'%</p>');
            curCard.append('<p>Wind: ' + curDayObj['windSpeed'] + 'mph</p>');
            addIcons(curCard.siblings('.fas'), curDayObj['description']);
        }
    }
    //Add catch for modal?
    );
} 

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}


function addToLocalStorage(city){
    var listOfSearchedCities = JSON.parse(localStorage.getItem('listOfCities'));
    if (listOfSearchedCities.includes(city)) {
        listOfSearchedCities.splice(listOfSearchedCities.indexOf(city), 1);
        console.log('in if statement')
    }
    listOfSearchedCities.unshift(city);
    localStorage.setItem('listOfCities', JSON.stringify(listOfSearchedCities));
}

function addListOfSearchedCities(){
    const listOfCities = JSON.parse(localStorage.getItem('listOfCities'));
    const listGroup = $('.list-group');
    listGroup.empty();
    if(listOfCities){
        for (var i = 0; i< listOfCities.length; i++) {
            $('<li><button>' + 
            listOfCities[i] + '</button></li>').addClass("list-group-item list-group-item-action").attr('id', listOfCities[i]).appendTo(listGroup);

            $('#'+listOfCities[i]).click(function(event){searchByCity(this.id)});
        }
    }
}

function checkUVI(uvi){
    const uviDisplay = $('.uvi');
    if (uvi <= 2 ) {
        uviDisplay.css({"background-color": "green", "border-radius":'5px', "width":'fit-content', 'padding':'2px'});
    }else if (uvi <= 5 ) {
        uviDisplay.css("background-color", "yellow");
    }else if (uvi <= 7 ) {
        uviDisplay.css("background-color", "orange");
    }else {
        uviDisplay.css("background-color", "red");
    }
}

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

function getWeatherReportByCity(city) {
    return getLongAndLat(city).then(function(data){  
          return getWeatherByLongAndLat(data['lat'], data['long']);
        }
    )
}

function getLongAndLat(city){
  var getLogLatUrl = encodeURI(baseURL+'/weather?q=' + city + "&appid=" + APIKey);
    return fetch(getLogLatUrl).then(response => response.json()).then(function(data){
        return {
            lat: data['coord']['lat'],
            long: data['coord']['lon']
        };
    })
}

function getWeatherByLongAndLat(lat, long) {
    var queryURL  = encodeURI(baseURL + 'onecall?lat=' + lat +'&lon='+ long + '&exclude=hourly,minutely&units=imperial&appid=' + APIKey);
    return fetch(queryURL).then(response => response.json()).then(function(data){
        const forecastDays = [];

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

function clearDisplays(){
    $('.card-text').empty();
    $('.fas').empty();
    $('.results-container').addClass('hidden');

}

// function setWeatherCard() {
//     var children=$('.results-container').children();
//     for(var i=0;i<children.length;i++){
//         $(children.eq(i)).first().siblings('.fas'));
//     }
// }

function main() {

//    setWeatherCard();
   $('.search-button').click(function(){
       searchByCity($('#location-search').val())})
   addListOfSearchedCities();
}

main();
