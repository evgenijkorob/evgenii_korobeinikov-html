class Day {
  public constructor(
    private _number: number,
    private _weekDay: number,
    private _month: number,
    private _year: number
  ) {}

  get number() {
    return this._number;
  }

  get weekDay() {
    return this._weekDay;
  }

  get month() {
    return this._month;
  }

  get year() {
    return this._year;
  }
}

class CalendarController {
  private _db: CalendarDB;
  private _view: CalendarRenderer;

  public constructor() {
    this._db = new CalendarDB();
    this._view = new CalendarRenderer(this._db);
  }

  public showCalendar(): Element {
    let calendarView: Element;
    this._db.dayList = this._generateMonthDaysArr(this._db.chosenDate);
    calendarView = this._view.render();
    this._setHandlers(calendarView);
    this._configWeather();
    this._runTodayDateAutoupdater();
    return calendarView;
  }

  private _runTodayDateAutoupdater(): void {
    let timer: number = window.setTimeout(function updater() {
      let newDate = new Date();
      if (!CalendarDB.isEqualDatesYMD(this._db.today, newDate)) {
        this._db.today = newDate;
        this._view.onTodayDateChange();
      }
      timer = window.setTimeout(updater.bind(this), 60 * 1000);
    }.bind(this), 0);
  }

  private _generateMonthDaysArr(date: Date): Day[] {
    let list: Day[] = [],
        currMonth: number = date.getMonth(),
        currYear: number = date.getFullYear(),
        day = new Date(currYear, currMonth, 1);
    day.setDate(day.getDate() - 1);

    while(day.getDay() !== 6) {
      list.push(new Day(day.getDate(), day.getDay(), day.getMonth(), day.getFullYear()));
      day.setDate(day.getDate() - 1);
    }

    day.setFullYear(currYear, currMonth, 1);
    while(day.getMonth() === currMonth) {
      list.push(new Day(day.getDate(), day.getDay(), day.getMonth(), day.getFullYear()));
      day.setDate(day.getDate() + 1);
    };

    while(list.length < 42) {
      list.push(new Day(day.getDate(), day.getDay(), day.getMonth(), day.getFullYear()));
      day.setDate(day.getDate() + 1);
    }
    return list;
  }

  private _setHandlers(calendar: Element): void {
    calendar.addEventListener('mousedown', function(event: Event) {
      let target: Element = (<Element>event.target).closest('*[data-date-changer]');
      if (!target) {
        return;
      }
      let oldDate: Date = this._db.chosenDate,
          newDate: Date = this._getNewDateFromElement(target, oldDate);
      if (CalendarDB.isEqualDatesYMD(oldDate, newDate)) {
        return;
      }
      let isYearChanged: boolean = newDate.getFullYear() !== oldDate.getFullYear(),
          isMonthChanged: boolean = newDate.getMonth() !== oldDate.getMonth();
      this._db.chosenDate = newDate;
      if (isYearChanged || isMonthChanged) {
        this._db.dayList = this._generateMonthDaysArr(newDate);
      }
      this._view.onChosenDateChange(oldDate);
    }.bind(this));
  }

  private _getNewDateFromElement(node: HTMLElement, oldDate: Date): Date {
    let newDate = new Date(oldDate.toString()),
        getNumberFromAttr = (attr: string): number => {
          return node.hasAttribute(attr) ? Number(node.getAttribute(attr)) : null;
        },
        yearSub: number = getNumberFromAttr('data-year-sub'),
        year: number = getNumberFromAttr('data-year'),
        month: number = getNumberFromAttr('data-month'),
        day: number = getNumberFromAttr('data-day');
    if (year) {
      newDate.setFullYear(year);
    }
    else if (yearSub) {
      newDate.setFullYear(oldDate.getFullYear() + yearSub);
    }
    if (month) {
      newDate.setMonth(month, 1);
    }
    if (day) {
      newDate.setDate(day);
    }
    else {
      newDate.setDate(oldDate.getDate());
    }
    return newDate;
  }

  private _configWeather(): void {
    type WeatherObj = ICityInstantWeather | ICityForecast;
    let weatherProvider = new WeatherService(),
        callback: (purpose: string, data: WeatherObj) => void;
    callback = function(purpose: string, data: WeatherObj) {
      this._db.city = data ? data.city : null;
      this._db.country = data ? data.country : null;
      switch(purpose) {
        case 'weather':
          this._db.todayWeather = data;
          break;
        case 'forecast':
          this._db.forecast = data;
          break;
        default:
          throw new Error('Incorrect query purpose');
      }
      this._view.updateWeatherDisplay();
    };
    weatherProvider.onWeatherGet = callback.bind(this, 'weather');
    weatherProvider.onForecastGet = callback.bind(this, 'forecast');
    weatherProvider.start();
  }
}
