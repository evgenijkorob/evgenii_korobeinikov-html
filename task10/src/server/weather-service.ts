import WeatherProvider from './weather-provider';

export default class WeatherService {
  private readonly _provider: WeatherProvider;
  private static readonly _initialReqHeader: string = 'Initial-Weather-Request';
  private _dataContainer;
  private _subsContainer;

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

  _makeSub(subReq, subRes, id, purpose) {
    let obj = {
          req: subReq,
          res: subRes
        };
    let callback = this._onSubReqClose.bind(this, obj, id, purpose);
    obj.req.on('close', callback);
    obj.req.on('aborted', callback);
    return obj;
  }

  _onSubReqClose(sub, id, purpose) {
    if(!sub.res.headersSent) {
      sub.res.sendStatus(500);
    }
    delete this._subsContainer[purpose][id];
  }

  _subscribe(purpose, subReq, subRes) {
    let id = Math.random();
    this._subsContainer[purpose][id] = this._makeSub(subReq, subRes, id, purpose);
    if (subReq.header(WeatherService._initialReqHeader)) {
      this._notify(id, purpose, purpose);
    }
  }

  subscribeForWeather(subReq, subRes) {
    this._subscribe('weather', subReq, subRes);
  }

  subscribeForForecast(subReq, subRes) {
    this._subscribe('forecast', subReq, subRes);
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
    let timer: NodeJS.Timeout,
        update: () => void;
    update = () => {
      this._request(dataGetter.bind(this._provider), dataContName)
        .then(() => new Promise(resolve => {
          this._notifySubs(subContName, dataContName);
          resolve();
        }))
        .then(() => {
          timer = setTimeout(update, timeout);
        });
    };
    timer = setTimeout(update, 0);
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
    if (!sub.res.headersSent) {
      sub.res.send(this._dataContainer[dataContName]);
    }
    delete this._subsContainer[subContName][id];
  }
};
