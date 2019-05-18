import * as rp from 'request-promise';

export default class WeatherProvider {
  private static readonly _defaultReqOptions = {
    appid: 'ba7b3d5c9e11c5922d86715dbbc8ed28',
    id: 625665,
    units: 'metric',
    lang: 'en'
  };
  private static readonly _address = 'https://api.openweathermap.org/data/2.5/';
  private static readonly _addressPostfix = {
    forecast: 'forecast',
    weather: 'weather'
  };

  public getForecast(): rp.RequestPromise {
    let options = {
          uri: this._makeUrl(
            WeatherProvider._defaultReqOptions,
            WeatherProvider._addressPostfix.forecast
          )
        };
    return rp(options);
  }

  public getWeather(): rp.RequestPromise {
    let options = {
          uri: this._makeUrl(
            WeatherProvider._defaultReqOptions,
            WeatherProvider._addressPostfix.weather
          )
        };
    return rp(options);
  }

  private _makeUrl(optionsObj, postfix: string): string {
    let options = Object.entries(optionsObj),
        url = WeatherProvider._address + postfix,
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
