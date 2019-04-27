const path = require('path'),
      express = require('express'),
      rp = require('request-promise');


class WeatherService {
  constructor() {
    this._defaultReqOptions = {
      appid: 'ba7b3d5c9e11c5922d86715dbbc8ed28',
      id: 625665,
      units: 'metric',
      lang: 'en'
    };
    this._address = 'https://api.openweathermap.org/data/2.5/';
    this._addressPostfix = {
      forecast: 'forecast',
      weather: 'weather'
    };
    this._respObj = null;
  }

  getForecast() {
    let options = {
          uri: this._makeUrl(this._defaultReqOptions, this._addressPostfix.forecast)
        };
    return rp(options);
  }

  getWeather() {
    let options = {
          uri: this._makeUrl(this._defaultReqOptions, this._addressPostfix.weather)
        };
    return rp(options);
  }

  _makeUrl(optionsObj, postfix) {
    let options = Object.entries(optionsObj),
        url = this._address + postfix,
        optAmount = options.length;
    if (optAmount) {
      url += '?';
    }
    options.forEach((option, indx) => {
      let opt = option[0],
          value = option[1];
      url += opt + '=' + value;
      if (indx < optAmount - 1) {
        url += '&';
      }
    });
    return url;
  }
}

const app = express(),
      weather = new WeatherService(),
      SITE_OPTIONS = {
        portnum: 8080
      };

app.use('/', express.static(
  path.resolve(__dirname, '../client'),
  SITE_OPTIONS
));

app.get('/api/forecast', (req, res) => {
  weather.getForecast()
    .then(respJSON => res.send(respJSON));
});

app.get('/api/weather', (req, res) => {
  weather.getWeather()
    .then(respJSON => res.send(respJSON));
});

app.listen(SITE_OPTIONS.portnum);
console.log(`Running App on port ${SITE_OPTIONS.portnum}`);
