import { CalendarDB } from './db';

export class InstantWeather {
  constructor(
    public readonly date: Date,
    public readonly temp: number,
    public readonly description: string,
    public readonly id: number
  ) {}

  public static fromObject(obj: any): InstantWeather {
    return new InstantWeather(
      new Date(obj.dt * 1000),
      Math.round(obj.main.temp),
      obj.weather[0].description,
      obj.weather[0].id
    );
  }
}

export interface ICityInstantWeather {
  city: String,
  country: String,
  weather: InstantWeather
};

export interface ICityForecast {
  city: String,
  country: String,
  dayList: IDayForecast[]
};

export interface IDayForecast {
  day: Date,
  forecast: InstantWeather[]
};

interface ArrayConstructor {
  from(arrayLike: any, mapFn?, thisArg?): Array<any>;
};

class CometListener {
  constructor(
    private readonly _url: string,
    private readonly _resHandler: (resp: string) => any
  ) {}

  public start(): void {
    this._listen(this._url, this._resHandler, true);
  }

  private _listen(url: string, resHandler: (resp: string) => any, isInitialReq: boolean): void {
    if (!resHandler) {
      return;
    }
    let xhr = new XMLHttpRequest(),
        self = this,
        listen = self._listen,
        modifiedUrl: string = url + '/' + Math.random().toString(16).slice(2),
        timeout = 2 * 60 * 1000;

    xhr.onerror = function() {
      resHandler('');
      setTimeout(listen.bind(self, url, resHandler, true), 5000);
    };
    xhr.onload = function() {
      if (this.status === 200) {
        resHandler(this.responseText);
      }
      listen.call(self, url, resHandler, false);
    };
    xhr.ontimeout = function() {
      listen.call(self, url, resHandler, false);
    }
    xhr.open('GET', modifiedUrl, true);
    if (isInitialReq) {
      xhr.setRequestHeader('Initial-Weather-Request', 'true');
    }
    xhr.timeout = timeout;
    xhr.send();
  }
}

export class WeatherService {
  public onWeatherGet;
  public onForecastGet;

  public start() {
    let weatherConnection: CometListener,
        forecastConnection: CometListener;
    if (this.onWeatherGet) {
      weatherConnection = new CometListener(
        'api/weather',
        this._parseRes.bind(this, this._parseWeather, this.onWeatherGet)
      );
      weatherConnection.start();
    }
    if (this.onForecastGet) {
      forecastConnection = new CometListener(
        'api/forecast',
        this._parseRes.bind(this, this._parseForecast, this.onForecastGet)
      );
      forecastConnection.start();
    }
  }

  private _parseRes(
    parser: (resp: string) => Object,
    callback: (data: Object) => any,
    resBody: string
  ) {
    let result: Object;
    try {
      result = parser(resBody);
    }
    catch(err) {}
    callback(result);
  }

  private _parseWeather(resBody: string) {
    let obj = JSON.parse(resBody),
        result: ICityInstantWeather;
    result = {
      city: obj.name,
      country: obj.sys.country,
      weather: InstantWeather.fromObject(obj)
    };
    return result;
  }

  private _parseForecast(resBody: string) {
    let result: ICityForecast,
        obj = JSON.parse(resBody),
        weatherList: InstantWeather[],
        dayForecastsList: IDayForecast[] = [],
        weatherIndx = 0;

    weatherList = Array.from(obj.list, elem => InstantWeather.fromObject(elem));
    while(weatherIndx < weatherList.length) {
      let currDay = weatherList[weatherIndx].date,
          forecast: InstantWeather[] = [],
          dayForecast: IDayForecast;
      while((weatherIndx < weatherList.length) &&
            CalendarDB.isEqualDatesYMD(weatherList[weatherIndx].date, currDay)) {
        forecast.push(weatherList[weatherIndx]);
        weatherIndx++;
      }
      dayForecast = {
        day: currDay,
        forecast: forecast
      };
      dayForecastsList.push(dayForecast);
    }
    result = {
      city: obj.city.name,
      country: obj.city.country,
      dayList: dayForecastsList
    };
    return result;
  }
}
