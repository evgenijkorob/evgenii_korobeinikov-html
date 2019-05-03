function Weather(date, temp, description, id) {
  this.date = date;
  this.temp = temp;
  this.description = description;
  this.id = id;
}

Weather.fromObject = function(obj) {
  return new Weather(
    new Date(obj.dt * 1000),
    Math.round(obj.main.temp),
    obj.weather[0].description,
    obj.weather[0].id
  );
}

function CometListener(url, resHandler) {
  this.url = url;
  this.resHandler = resHandler;
}

CometListener.prototype = {
  constructor: CometListener,

  _listen: function(url, resHandler, isInitialReq) {
    if (!resHandler) {
      return;
    }
    let xhr = new XMLHttpRequest(),
        self = this,
        listen = self._listen,
        modifiedUrl = url + '/' + Math.random().toString(16).slice(2),
        timeout = 2 * 60 * 1000;

    xhr.timeout = timeout;
    xhr.onerror = function() {
      resHandler('');
      setTimeout(listen.bind(self, url, resHandler, true), 5000);
    };
    xhr.onload = function() {
      if (this.status === 200) {
        resHandler(this.responseText);
      }
      listen.call(self, url, resHandler, false);
    }
    xhr.open('GET', modifiedUrl, true);
    if (isInitialReq) {
      xhr.setRequestHeader('Initial-Weather-Request', 'true');
    }
    xhr.send();
  },

  start: function() {
    this._listen(this.url, this.resHandler, true);
  }
}

function WeatherService() {
  this.onWeatherGet = undefined;
  this.onForecastGet = undefined;
}

WeatherService.prototype = {
  constructor: WeatherService,

  start: function() {
    let weatherConnection, forecastConnection;
    if (this.onWeatherGet) {
      weatherConnection = new CometListener(
        'api/weather',
        this._parseRes.bind(this, this._parseWeather, this.onWeatherGet)
      );
    }
    if (this.onForecastGet) {
      forecastConnection = new CometListener(
        'api/forecast',
        this._parseRes.bind(this, this._parseForecast, this.onForecastGet)
      );
    }
    weatherConnection.start();
    forecastConnection.start();
  },

  _parseRes: function(parser, callback, resBody) {
    let result;
    try {
      result = parser(resBody);
    }
    catch(err) {}
    callback(result);
  },

  _parseWeather: function(resBody) {
    let obj = JSON.parse(resBody);
    return {
      city: obj.name,
      country: obj.sys.country,
      weather: Weather.fromObject(obj)
    };
  },

  _parseForecast: function(resBody) {
    let obj = JSON.parse(resBody),
        weatherList = Array.from(obj.list, function(elem) {
          return Weather.fromObject(elem);
        }),
        dayList = [],
        weatherIndx = 0,
        currDay,
        dayIndx = -1;
    while(weatherIndx < weatherList.length) {
      currDay = weatherList[weatherIndx].date;
      dayList.push({
        day: currDay,
        forecast: []
      });
      dayIndx++;
      while((weatherIndx < weatherList.length) &&
            CalendarDB.isEqualDatesYMD(weatherList[weatherIndx].date, currDay)) {
        dayList[dayIndx].forecast.push(weatherList[weatherIndx]);
        weatherIndx++;
      }
    }
    return {
      city: obj.city.name,
      country: obj.city.country,
      dayList: dayList
    };
  }
}
