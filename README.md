# WeatherDashboard
A helpful weather dashboard that displays the current weather and the forecast for the desired location. 

## How to use 
This site can be used by either going to the [GitHub deployed site](https://mmarsolek.github.io/WeatherDashboard/) or right clicking in the index.html and selecting "Open Document in Default Browser". Once open, just enter a city name into the search bar and click 'Search' for the current weather and the five day forecast!

## Consideration
- I needed to ensure that the city name that was input was able to be used in the URL and displayed to the user. I accomplished this by creating a function that replaces spaces with a underscore so it could be used in the URL. It also does the reverse so the city can be displayed in a list or used again. 


![String sanitization](./Assets/images/stringSanitizer.png)


- Given the API constraints, I needed to figure out how I could best get the five day forecast. I ended up making two calls to different API requests. Both use https://api.openweathermap.org/data/2.5/ as the base with different parameters.
- The box behind the UV Index is colored to show the severity of it.


![UVI indicator changes color depending on severity](./Assets/images/UVIndex.png)


- An icon will be displayed depending on the weather forecasted for that day.
- In addition to an icon, the current date and displayed location are also shown on the page.


![Location, Date, and status are displayed in the main section](./Assets/images/icon.png)


- A list of previously searched cities is displayed under the search bar for ease of use. 


![Recent searches are saved for ease of use](./Assets/images/Searching.png)



