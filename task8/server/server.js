const path = require('path'),
      express = require('express'),
      rp = require('request-promise');


class WeatherProvider {
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

class WeatherService {
  constructor() {
    this._weather = '';
    this._forecast = '';
    this._provider = new WeatherProvider();
    this._weatherSubs = {};
    this._forecastSubs = {};
  }

  subscribeForWeather(sub, isFirstReq) {
    let id = Math.random();
    this._weatherSubs[id] = sub;
    if (isFirstReq) {
      this._notify(id);
    }
  }

  subscribeForForecast(sub) {
    let id = Math.random();
    this._forecastSubs[id] = sub;
  }

  start() {
    let weatherUpdateInterval = 30 * 60 * 1000,
        weatherTimer = setTimeout(function update() {
          this._requestWeather()
            .then(() => {
              weatherTimer = setTimeout(update.bind(this), weatherUpdateInterval);
            });
        }.bind(this), 0);
  }

  _requestWeather() {
    let promise = new Promise(resolve => {
      this._provider.getWeather()
        .then(body => {
          this._weather = body;
        })
        .catch(err => {
          this._weather = '';
          return Promise.resolve();
        })
        .then(() => {
          this._notifyWeatherSubs();
          resolve();
        });
    });
    return promise;
  }

  _notifyWeatherSubs() {
    let subs = Object.keys(this._weatherSubs);
    subs.forEach(id => {
      this._notify(id);
    });
  }

  _notify(id) {
    let sub = this._weatherSubs[id];
    if (!sub.headersSent) {
      sub.send(this._weather);
    }
    delete this._weatherSubs[id];
  }
}

const app = express(),
      weatherService = new WeatherService(),
      SITE_OPTIONS = {
        portnum: 8080
      };

weatherService.start();

app.use('/', express.static(
  path.resolve(__dirname, '../client'),
  SITE_OPTIONS
));

app.get('/api/weather', (req, res) => {
  weatherService.subscribeForWeather(res, req.header('Initial-Weather-Request'));
  return;
});

app.listen(SITE_OPTIONS.portnum);
console.log(`Running App on port ${SITE_OPTIONS.portnum}`);
