import "./App.css";
import { useState } from "react";

const api = {
  key: process.env.REACT_APP_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const searchPressed = () => {
    setError(null);
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('City not found');
        }
        return res.json();
      })
      .then((result) => {
        setWeather(result);
      })
      .catch((err) => {
        setError(err.message);
        setWeather(null);
      });
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  };
  
  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div className="App">
      <main className="container">
        <div className="left-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for places..."
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchPressed()}
            />
            <button onClick={searchPressed}>Search</button>
          </div>
          
          {error && <p className="error-message">{error}</p>}

          {weather && weather.main ? (
            <>
              <div className="weather-icon">
                <img 
                  src={getWeatherIconUrl(weather.weather[0].icon)} 
                  alt={weather.weather[0].description} 
                />
              </div>
              <div className="temperature">
                {Math.round(weather.main.temp)}
                <span>°C</span>
              </div>
              <div className="date-time">
                {dateBuilder(new Date())}
              </div>
              <hr />
              <div className="weather-condition">
                <p>{weather.weather[0].main}</p>
              </div>
              <div className="location-info">
                <p>{weather.name}, {weather.sys.country}</p>
              </div>
            </>
          ) : (
            <div className="placeholder">
              <h2>Search for a city to see the weather</h2>
            </div>
          )}

        </div>
        <div className="right-panel">
          <div className="header">
            <h3>Today's Highlights</h3>
          </div>
          {weather && weather.main ? (
            <div className="highlights-grid">
              <div className="highlight-card">
                <p className="card-title">Wind Status</p>
                <div className="card-content">
                  <span className="value">{weather.wind.speed}</span>
                  <span className="unit">km/h</span>
                </div>
              </div>
              <div className="highlight-card">
                <p className="card-title">Humidity</p>
                <div className="card-content">
                  <span className="value">{weather.main.humidity}</span>
                  <span className="unit">%</span>
                </div>
              </div>
              <div className="highlight-card">
                <p className="card-title">Visibility</p>
                <div className="card-content">
                  <span className="value">{(weather.visibility / 1000).toFixed(1)}</span>
                  <span className="unit">km</span>
                </div>
              </div>
              <div className="highlight-card">
                <p className="card-title">Feels Like</p>
                <div className="card-content">
                  <span className="value">{Math.round(weather.main.feels_like)}</span>
                  <span className="unit">°C</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-right">
              <p>Details will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;