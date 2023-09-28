import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";

const QUERY_URL = "https://api.openweathermap.org/data/2.5/onecall?";
const LAT = "lat=52.229676&";
const LON = "lon=21.012229&";
const API_OPTIONS = "units=metric&exclude=minutely,alerts&";
const API_KEY = "your_api_key"; // Replace with your OpenWeatherMap API key
const iconBaseUrl = "http://openweathermap.org/img/wn/";
const iconFormat = ".png";

function WeatherIcon({ iconId }) {
  const iconUrl = iconBaseUrl + iconId + iconFormat;
  return <img src={iconUrl} alt="Weather Icon" />;
}

function WeatherApp() {
  const [data, setData] = useState({});
  const [bgGif, setBGGif] = useState(
    "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')"
  );

  const [city, setCity] = useState(""); // State for user-entered city

  // Declare TIME_NOW constant
  const TIME_NOW = new Date().getHours();

  // Move the FILE definition inside the useEffect
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) {
        // Do not make the API request if the city is empty
        return;
      }

      const FILE = `${QUERY_URL}q=${city}&${API_OPTIONS}appid=${API_KEY}`;

      try {
        const response = await fetch(FILE);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const weatherData = await response.json();

        setData(weatherData);
        setBGGif(getBackgroundGifUrl(weatherData.current.weather[0].main));
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchWeatherData();
  }, [city]);

  const getBackgroundGifUrl = (weatherCondition) => {
    // Existing code for getting background GIF URL
    switch (weatherCondition) {
      case "Snow":
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
      case "Clouds":
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
      case "Fog":
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
      case "Rain":
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
      case "Clear":
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
      case "Thunderstorm":
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
      default:
        return "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
    }
  };

  return (
    <section className="vh-100">
      <div className="text-center mt-3">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => setCity("")}>Clear</button>
      </div>
      <MDBContainer className="h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="9" lg="7" xl="5">
            <MDBCard
              className="text-white bg-image shadow-4-strong"
              style={{ backgroundImage: bgGif }}
            >
              <MDBCardHeader className="p-4 border-0">
                <div className="text-center mb-3">
                  <p className="h2 mb-1">{city}</p>
                  <p className="mb-1">{data.current.weather[0].description}</p>
                  <p className="display-1 mb-1">
                    {Math.round(data.current.temp)}°C
                  </p>
                  <span className="">Pressure: {data.current.pressure}</span>
                  <span className="mx-2">|</span>
                  <span className="">Humidity: {data.current.humidity}%</span>
                </div>
              </MDBCardHeader>

              <MDBCardBody className="p-4 border-top border-bottom mb-2">
                <MDBRow className="text-center">
                  {data.hourly.slice(0, 6).map((hourlyData, index) => (
                    <MDBCol size="2" key={index}>
                      <strong className="d-block mb-2">
                        {TIME_NOW + index}
                      </strong>
                      <WeatherIcon iconId={hourlyData.weather[0].icon} />
                      <strong className="d-block">
                        {Math.round(hourlyData.temp)}°
                      </strong>
                    </MDBCol>
                  ))}
                </MDBRow>
              </MDBCardBody>

              <MDBCardBody className="px-5">
                {data.daily.slice(0, 3).map((dailyData, index) => (
                  <MDBRow
                    key={index}
                    className="align-items-center justify-content-between"
                  >
                    <MDBCol lg="6">
                      <strong>
                        {index === 0
                          ? "Today"
                          : index === 1
                          ? "Tomorrow"
                          : "Day after tomorrow"}
                      </strong>
                    </MDBCol>
                    <MDBCol lg="2" className="text-center">
                      <WeatherIcon iconId={dailyData.weather[0].icon} />
                    </MDBCol>
                    <MDBCol lg="4" className="text-end">
                      {Math.round(dailyData.temp.day)}°
                    </MDBCol>
                  </MDBRow>
                ))}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer> 
    </section>
  );
}

export default WeatherApp;

