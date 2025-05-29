import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [city, setCity] = useState('karachi');
  const [inputCity, setInputCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [bgClass, setBgClass] = useState('day');

  const apiKey = 'bf7d4f3f6e7e4e21bee202243252905';

  const updateBackground = (localtime) => {
    const hour = new Date(localtime).getHours();
    if (hour >= 6 && hour < 12) {
      setBgClass('day');
    } else if (hour >= 12 && hour < 18) {
      setBgClass('evening');
    } else {
      setBgClass('night');
    }
  };

  // ✅ Memoize fetchWeather so it can safely be used in useEffect
  const fetchWeather = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      setWeatherData(response.data);
      updateBackground(response.data.location.localtime);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherData(null);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim() !== '') {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  return (
    <div className={`app-container ${bgClass}`}>
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Search city..."
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {weatherData ? (
        <div className="weather-info">
          <h1>{weatherData.location.name}</h1>
          <h2>{weatherData.current.temp_c}°C</h2>
          <p>{weatherData.current.condition.text}</p>
          <p>{weatherData.location.localtime}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default App;
