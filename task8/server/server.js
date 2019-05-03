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
    this._provider = new WeatherProvider();
    this._dataContainer = {
      'weather': '',
      'forecast': ''
    };
    this._subsContainer = {
      'weather': {},
      'forecast': {}
    };
  }

  subscribeForWeather(sub, isFirstReq) {
    let id = Math.random();
    this._subsContainer['weather'][id] = sub;
    if (isFirstReq) {
      this._notify(id, 'weather', 'weather');
    }
  }

  subscribeForForecast(sub, isFirstReq) {
    let id = Math.random();
    this._subsContainer['forecast'][id] = sub;
    if (isFirstReq) {
      this._notify(id, 'forecast', 'forecast');
    }
  }

  start() {
    let weatherUpdateInterval = 15 * 60 * 1000,
        forecastUpdateInterval = 60 * 60 * 1000,
        weatherTimer,
        forecastTimer;
    weatherTimer = this._setTimer(
      weatherUpdateInterval,
      this._provider.getWeather,
      'weather',
      'weather'
    );
    forecastTimer = this._setTimer(
      forecastUpdateInterval,
      this._provider.getForecast,
      'forecast',
      'forecast'
    );
  }

  _setTimer(timeout, dataGetter, subContName, dataContName) {
    let self = this,
        timer;
    function update() {
      self._request(dataGetter.bind(self._provider), dataContName)
        .then(() => new Promise(resolve => {
          self._notifySubs(subContName, dataContName);
          resolve();
        }))
        .then(() => {
          timer.id = setTimeout(update, timeout);
        });
    }
    update = update.bind(this);
    timer = {
      id: setTimeout(update, 0)
    };
    return timer;
  }

  _request(getter, dataContName) {
    let promise = new Promise(resolve => {
      getter()
        .then(body => {
          this._dataContainer[dataContName] = body;
        })
        .catch(err => {
          this._dataContainer[dataContName] = '';
          return Promise.resolve();
        })
        .then(() => {
          resolve();
        });
    });
    return promise;
  }

  _notifySubs(subContainerName, dataContainerName) {
    let subs = Object.keys(this._subsContainer[subContainerName]);
    subs.forEach(id => {
      this._notify(id, subContainerName, dataContainerName);
    });
  }

  _notify(id, subContName, dataContName) {
    let sub = this._subsContainer[subContName][id];
    if (!sub.headersSent) {
      sub.send(this._dataContainer[dataContName]);
    }
    delete this._subsContainer[subContName][id];
  }
}

const app = express(),
      weatherService = new WeatherService(),
      SITE_OPTIONS = {
        portnum: 8080
      },
      initialReqHeader = 'Initial-Weather-Request';

weatherService.start();

app.use('/', express.static(
  path.resolve(__dirname, '../client'),
  SITE_OPTIONS
));

app.get('/api/weather/*', (req, res) => {
  weatherService.subscribeForWeather(res, req.header(initialReqHeader));
  return;
});

app.get('/api/forecast/*', (req, res) => {
  weatherService.subscribeForForecast(res, req.header(initialReqHeader));
})

app.listen(SITE_OPTIONS.portnum);
console.log(`Running App on port ${SITE_OPTIONS.portnum}`);
