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

function CalendarController() {
  this.db = new CalendarDB();
  this.view = new CalendarRenderer(this.db);
}

CalendarController.prototype = {
  constructor: CalendarController,

  showCalendar: function() {
    let calendarView;
    this.db.dayList = this.generateMonthDaysArr(this.db.chosenDate);
    calendarView = this.view.render();
    this.setHandlers(calendarView);
    this.configWeather();
    this.runTodayDateAutoupdater();
    return calendarView;
  },

  runTodayDateAutoupdater: function() {
    let timer;
    timer = setTimeout(function updater() {
      let newDate = new Date();
      if (!CalendarDB.isEqualDatesYMD(this.db.today, newDate)) {
        this.db.today = newDate;
        this.view.onTodayDateChange();
      }
      timer = setTimeout(updater.bind(this), 60 * 1000);
    }.bind(this), 0);
  },

  generateMonthDaysArr: function(date) {
    let list = [],
        currMonth = date.getMonth(),
        currYear = date.getFullYear(),
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
  },

  setHandlers: function(calendar) {
    calendar.addEventListener('mousedown', function(event) {
      let target = event.target.closest('*[data-date-changer]');
      if (!target) {
        return;
      }
      let oldDate = this.db.chosenDate,
          newDate = this.getNewDateFromElement(target, oldDate);
      if (CalendarDB.isEqualDatesYMD(oldDate, newDate)) {
        return;
      }
      let isYearChanged = newDate.getFullYear() !== oldDate.getFullYear(),
          isMonthChanged = newDate.getMonth() !== oldDate.getMonth();
      this.db.chosenDate = newDate;
      if (isYearChanged || isMonthChanged) {
        this.db.dayList = this.generateMonthDaysArr(newDate);
      }
      this.view.onChosenDateChange(oldDate);
    }.bind(this));
  },

  getNewDateFromElement: function(node, oldDate) {
    let newDate = new Date(oldDate),
        yearSub = +node.getAttribute('data-year-sub'),
        year = node.getAttribute('data-year'),
        month = node.getAttribute('data-month'),
        day = +node.getAttribute('data-day');
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
  },

  configWeather: function() {
    let weatherProvider = new WeatherService();
    weatherProvider.onWeatherGet = this.onWeatherGet.bind(this);
    weatherProvider.onForecastGet = this.onForecastGet.bind(this);
    weatherProvider.start();
  },

  onWeatherGet: function(data) {
    if (!data) {
      this.db.todayWeather = undefined;
      this.view.updateWeatherDisplay();
      return;
    }
    this.db.todayWeather = data.weather;
    this.db.city = data.city;
    this.db.country = data.country;
    this.view.updateWeatherDisplay();
  },

  onForecastGet: function(data) {
    if (!data) {
      this.db.forecast = undefined;
      this.view.updateWeatherDisplay();
      return;
    }
    this.db.forecast = data.dayList;
    this.db.city = data.city;
    this.db.country = data.country;
    this.view.updateWeatherDisplay();
  }
};
