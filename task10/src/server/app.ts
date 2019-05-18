import * as Express from 'express';
import * as path from 'path';
import WeatherService from './weather-service';

class App {
  public readonly express;
  private _weatherService: WeatherService;

  constructor() {
    this.express = Express();
    this._weatherService = new WeatherService();
    this._weatherService.start();
    this._mountRoutes();
  }

  private _mountRoutes(): void {
    this.express.use('/', Express.static(
      path.resolve(__dirname, '../client')
    ));

    this.express.get('/api/weather/*', (req, res) => {
      this._weatherService.subscribeForWeather(req, res);
      return;
    });

    this.express.get('/api/forecast/*', (req, res) => {
      this._weatherService.subscribeForForecast(req, res);
      return;
    });
  }
}

export default new App().express;
