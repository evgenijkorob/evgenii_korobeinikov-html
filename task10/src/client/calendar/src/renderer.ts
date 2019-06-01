import { CalendarDB, IDateAsStr } from './db';
import { Day } from './controller';
import {
  InstantWeather,
  ICityForecast,
  ICityInstantWeather,
  IDayForecast
} from './weather';

const CALENDAR_CLASSES = {
  calendar: {
    tag: 'section',
    classList: ['calendar']
  },
  calendarInner: {
    tag: 'div',
    classList: ['calendar__inner']
  },
  calendarPickerPanel: {
    tag: 'section',
    classList: ['calendar__picker-panel']
  },
  calendarPickerPanelInner: {
    tag: 'div',
    classList: ['calendar__picker-panel-inner']
  },
  calendarAdditionalPanel: {
    tag: 'section',
    classList: ['calendar__additional-panel']
  },
  datepicker: {
    tag: 'div',
    classList: ['datepicker', 'calendar__datepicker']
  },
  yearpicker: {
    tag: 'div',
    classList: ['yearpicker', 'calendar__yearpicker']
  },
  yearpickerInner: {
    tag: 'div',
    classList: ['yearpicker__inner']
  },
  yearpickerControlWrapper: {
    tag: 'div',
    classList: ['yearpicker__controls-wrapper']
  },
  yearpickerControlIncreaser: {
    tag: 'div',
    classList: ['yearpicker__increaser', 'fas', 'fa-chevron-up']
  },
  yearpickerControlDecreaser: {
    tag: 'div',
    classList: ['yearpicker__decreaser', 'fas', 'fa-chevron-down']
  },
  yearpickerYear: {
    tag: 'div',
    classList: ['yearpicker__year']
  },
  monthpicker: {
    tag: 'div',
    classList: ['monthpicker', 'calendar__monthpicker']
  },
  monthpickerContainer: {
    tag: 'ul',
    classList: ['monthpicker__container']
  },
  monthpickerElement: {
    tag: 'li',
    classList: ['monthpicker__element'],
    mod: {
      active: '_active'
    }
  },
  daypicker: {
    tag: 'table',
    classList: ['daypicker']
  },
  daypickerHeading: {
    tag: 'thead',
    classList: ['daypicker__heading']
  },
  daypickerWeekList: {
    tag: 'tr',
    classList: ['daypicker__week-list']
  },
  daypickerWeekDay: {
    tag: 'th',
    classList: ['daypicker__week-day']
  },
  daypickerDayMatrix: {
    tag: 'tbody',
    classList: ['daypicker__day-matrix']
  },
  daypickerDayMatrixRow: {
    tag: 'tr',
    classList: ['daypicker__day-matrix-row']
  },
  daypickerDayMatrixElement: {
    tag: 'td',
    classList: ['daypicker__day-matrix-element']
  },
  daypickerDayWrapper: {
    tag: 'div',
    classList: ['daypicker__day-wrapper']
  },
  daypickerDay: {
    tag: 'div',
    classList: ['daypicker__day'],
    mod: {
      active: '_active',
      faded: '_faded',
      today: '_today'
    }
  },
  calendarDateWrapper: {
    tag: 'div',
    classList: ['calendar__date-wrapper']
  },
  calendarDateWeek: {
    tag: 'span',
    classList: ['calendar__date-week']
  },
  calendarDateMonth: {
    tag: 'span',
    classList: ['calendar__date-month']
  },
  calendarDateDay: {
    tag: 'span',
    classList: ['calendar__date-day']
  },
  weatherDisplay: {
    tag: 'div',
    classList: ['weather-display', 'calendar__weather-display'],
    mod: {
      invisible: '_invisible'
    }
  },
  weatherDisplayInner: {
    tag: 'div',
    classList: ['weather-display__inner']
  },
  weatherDisplayCity: {
    tag: 'div',
    classList: ['weather-display__city']
  },
  weatherDisplayTodayWeather: {
    tag: 'div',
    classList: ['weather-display__today-weather']
  },
  weatherDisplayForecast: {
    tag: 'div',
    classList: ['weather-display__forecast']
  },
  weatherThumb: {
    tag: 'div',
    classList: ['weather-thumb']
  },
  weatherThumbInner: {
    tag: 'div',
    classList: ['weather-thumb__inner']
  },
  weatherThumbDescription: {
    tag: 'div',
    classList: ['weather-thumb__description']
  },
  weatherThumbTemp: {
    tag: 'div',
    classList: ['weather-thumb__temp']
  },
  weatherThumbTime: {
    tag: 'div',
    classList: ['weather-thumb__time']
  },
  weatherIcon: {
    tag: 'div',
    classList: ['wi', 'calendar__weather-icon'],
    mod: {
      thunderstorm: '-thunderstorm',
      drizzle: '-sprinkles',
      rain: '-rain',
      snow: '-snow',
      atmosphere: '-windy',
      clear: '-day-sunny',
      clouds: '-cloudy',
      def: '-alien'
    }
  }
}

export default class CalendarRenderer {
  private _db: CalendarDB;
  private _model: Element;

  constructor(database: CalendarDB) {
    this._db = database;
    this._model = null;
  }

  render(): Element {
    let domModel: Element = document.createElement('div');
    this.renderSkeleton(domModel);
    let pickerPanel: Element = this.queryCalElemAll(domModel, 'calendarPickerPanel')[0],
        additionalPanel: Element = this.queryCalElemAll(domModel, 'calendarAdditionalPanel')[0];
    this.renderDatePicker(pickerPanel);
    this.renderCalendarDate(pickerPanel);
    this.renderWeatherDisplay(additionalPanel);
    this._model = domModel.children[0];
    return this._model;
  }

  onChosenDateChange(oldDate: Date): void {
    let newDate: Date = this._db.chosenDate,
        isYearChanged: boolean = newDate.getFullYear() !== oldDate.getFullYear(),
        isMonthChanged: boolean = newDate.getMonth() !== oldDate.getMonth();
    if (isYearChanged) {
      this.updateYearpicker();
    }
    if (isMonthChanged) {
      this.updateChosenMonth();
    }
    if (isYearChanged || isMonthChanged) {
      this.updateDayMatrixData();
      this.updateTodayDay();
    }
    this.updateChosenDayElem();
    this.updateCalendarDate();
    this.updateWeatherDisplay();
  }

  onTodayDateChange(): void {
    this.updateTodayDay();
  }

  renderSkeleton(parent: Element): Element {
    let calendar: Element = this.createCalElem('calendar'),
        inner: Element = this.createCalElem('calendarInner'),
        pickerPanel: Element = this.createCalElem('calendarPickerPanel'),
        additionalPanel: Element = this.createCalElem('calendarAdditionalPanel');
    parent.appendChild(calendar);
    calendar.appendChild(inner);
    inner.append(pickerPanel, additionalPanel);
    return parent;
  }

  renderDatePicker(parent: Element): void {
    let datepicker: Element = this.createCalElem('datepicker');
    parent.appendChild(datepicker);
    this.renderYearpicker(datepicker);
    this.renderMonthpicker(datepicker);
    this.renderDaypicker(datepicker);
  }

  renderYearpicker(parent: Element): void {
    let yearpicker: Element = this.createCalElem('yearpicker'),
        yearpickerInner: Element = this.createCalElem('yearpickerInner'),
        yearpickerControlWrapper: Element = this.createCalElem('yearpickerControlWrapper'),
        yearpickerControlIncreaser: Element = this.createCalElem('yearpickerControlIncreaser'),
        yearpickerControlDecreaser: Element = this.createCalElem('yearpickerControlDecreaser'),
        yearpickerYear: Element = this.createCalElem('yearpickerYear');

    parent.appendChild(yearpicker);
    yearpicker.appendChild(yearpickerInner);
    yearpickerInner.append(yearpickerControlWrapper, yearpickerYear);
    yearpickerControlIncreaser.setAttribute('data-date-changer', '');
    yearpickerControlIncreaser.setAttribute('data-year-sub', String(1));
    yearpickerControlDecreaser.setAttribute('data-date-changer', '');
    yearpickerControlDecreaser.setAttribute('data-year-sub', String(-1));
    yearpickerControlWrapper.append(yearpickerControlIncreaser, yearpickerControlDecreaser);

    this.updateYearpicker(yearpickerInner);
  }

  updateYearpicker(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let yearElem: Element = this.queryCalElemAll(parent, 'yearpickerYear')[0],
        year: number = this._db.chosenDate.getFullYear();
    if (yearElem) {
      yearElem.textContent = String(year);
    }
  }

  renderMonthpicker(parent: Element): void {
    let monthpicker: Element = this.createCalElem('monthpicker'),
        monthpickerContainer: Element = this.createCalElem('monthpickerContainer');

    parent.appendChild(monthpicker);
    monthpicker.appendChild(monthpickerContainer);

    let monthNames: string[] = CalendarDB.getMonthNames(),
        monthpickerElems: Element[];

    monthpickerElems = monthNames.map(
      (name: string, monthNum: number) => {
        let elem: Element = this.createCalElem('monthpickerElement');
        elem.textContent = name.slice(0, 3);
        elem.setAttribute('data-month', String(monthNum));
        elem.setAttribute('data-date-changer', '');
        return elem;
      }
    );
    monthpickerElems.forEach((elem: Element) => monthpickerContainer.appendChild(elem));
    this.updateChosenMonth(monthpickerContainer);
  }

  updateChosenMonth(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let mod: string = this.getModClass('monthpickerElement', 'active'),
        lastChosenMonth: Element = parent.querySelector('.' + mod),
        elems: Element[] = this.queryCalElemAll(parent, 'monthpickerElement'),
        month: number = this._db.chosenDate.getMonth(),
        chosenElem: Element;
    if (lastChosenMonth) {
      lastChosenMonth.classList.remove(mod);
    }
    chosenElem = elems.filter((elem: Element) => {
      return elem.getAttribute('data-month') === String(month);
    })[0];
    if (chosenElem) {
      chosenElem.classList.add(mod);
    }
  }

  renderDaypicker(parent: Element): void {
    let daypicker: Element = this.createCalElem('daypicker'),
        daypickerHeading: Element = this.createCalElem('daypickerHeading'),
        daypickerWeekList: Element = this.createCalElem('daypickerWeekList'),
        daypickerDayMatrix: Element = this.createCalElem('daypickerDayMatrix');

    parent.appendChild(daypicker);
    daypicker.append(daypickerHeading, daypickerDayMatrix);
    daypickerHeading.appendChild(daypickerWeekList);

    let dayNames: string[] = CalendarDB.getDayNames(),
        weekDayArr = dayNames.map((name: string) => {
          let elem: Element = this.createCalElem('daypickerWeekDay');
          elem.textContent = name.slice(0, 3);
          return elem;
        });
    weekDayArr.forEach((elem: Element) => daypickerWeekList.appendChild(elem));

    this.renderDayMatrix(daypickerDayMatrix);
    this.updateDayMatrixData(daypickerDayMatrix);
    this.updateChosenDayElem(daypickerDayMatrix);
    this.updateTodayDay(daypickerDayMatrix);
  }

  renderDayMatrix(parent: Element): void {
    const rowAmount: number = 6;
    let matrixRowArr: Element[] = Array.from({length: rowAmount}, () => this.createCalElem('daypickerDayMatrixRow')),
        dayNames: string[] = CalendarDB.getDayNames();
    matrixRowArr.forEach((row: Element) => {
      dayNames.forEach(() => row.appendChild(this.createDayMatrixElement()));
      parent.appendChild(row);
    });
  }

  createDayMatrixElement(): Element {
    let matrixElem: Element = this.createCalElem('daypickerDayMatrixElement'),
        dayWrapper: Element = this.createCalElem('daypickerDayWrapper'),
        dayElement: Element = this.createCalElem('daypickerDay');
    matrixElem.appendChild(dayWrapper);
    dayWrapper.appendChild(dayElement);
    dayElement.setAttribute('data-date-changer', '');
    return matrixElem;
  }

  updateDayMatrixData(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let rows: Element[] = this.queryCalElemAll(parent, 'daypickerDayMatrixRow'),
        dayList: Day[] = this._db.dayList,
        fadedMod: string = this.getModClass('daypickerDay', 'faded'),
        currMonth: number = this._db.chosenDate.getMonth();
    if (!rows) {
      return;
    }
    for (let dayIndx = 0, rowIndx = 0; dayIndx < dayList.length; dayIndx++) {
      let day: Day = dayList[dayIndx],
          dayElem: Element;

      dayElem = this.queryCalElemAll(
        (<HTMLTableRowElement>rows[rowIndx]).cells[day.weekDay],
        'daypickerDay'
      )[0];
      dayElem.textContent = String(day.number);
      dayElem.setAttribute('data-day', String(day.number));
      dayElem.setAttribute('data-month', String(day.month));
      dayElem.setAttribute('data-year', String(day.year));
      if (day.month !== currMonth) {
        dayElem.classList.add(fadedMod);
      }
      else {
        dayElem.classList.remove(fadedMod);
      }

      if (dayIndx % 7 === 6) {
        rowIndx++;
      }
    }
  }

  updateChosenDayElem(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let activeMod: string = this.getModClass('daypickerDay', 'active'),
        lastChosenElem: Element = parent.querySelector('.' + activeMod),
        daysArr: Element[] = this.queryCalElemAll(parent, 'daypickerDay');
    if (lastChosenElem) {
      lastChosenElem.classList.remove(activeMod);
    }
    let chosenElem: Element = this.getDayElemByDate(daysArr, this._db.chosenDate);
    if (chosenElem) {
      chosenElem.classList.add(activeMod);
    }
  }

  updateTodayDay(parent?: Element) {
    if (!parent) {
      parent = this._model;
    }
    let todayMod: string = this.getModClass('daypickerDay', 'today'),
        prevTodayElem: Element = parent.querySelector('.' + todayMod),
        daysArr: Element[] = this.queryCalElemAll(parent, 'daypickerDay');
    if (prevTodayElem) {
      prevTodayElem.classList.remove(todayMod);
    }
    let todayDayElem: Element = this.getDayElemByDate(daysArr, this._db.today);
    if (todayDayElem) {
      todayDayElem.classList.add(todayMod);
    }
  }

  getDayElemByDate(dayElemsArr: Element[], date: Date): Element {
    let day: number = date.getDate(),
        month: number = date.getMonth(),
        year: number = date.getFullYear();

    return dayElemsArr.filter((dayElem: Element) =>
              dayElem.getAttribute('data-day') === String(day) &&
              dayElem.getAttribute('data-month') === String(month) &&
              dayElem.getAttribute('data-year') === String(year)
            )[0];
  }

  renderCalendarDate(parent: Element): void {
    let calendarDateWrapper: Element = this.createCalElem('calendarDateWrapper'),
        calendarDateWeek: Element = this.createCalElem('calendarDateWeek'),
        calendarDateMonth: Element = this.createCalElem('calendarDateMonth'),
        calendarDateDay: Element = this.createCalElem('calendarDateDay');
    parent.appendChild(calendarDateWrapper);
    calendarDateWrapper.append(calendarDateWeek, calendarDateMonth, calendarDateDay);
    this.updateCalendarDate(calendarDateWrapper);
  }

  updateCalendarDate(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let calendarDateWeek: Element = this.queryCalElemAll(parent, 'calendarDateWeek')[0],
        calendarDateMonth: Element = this.queryCalElemAll(parent, 'calendarDateMonth')[0],
        calendarDateDay: Element = this.queryCalElemAll(parent, 'calendarDateDay')[0],
        currDateAsStr: IDateAsStr = CalendarDB.getDateAsStr(this._db.chosenDate);

    if (calendarDateWeek) {
      calendarDateWeek.textContent = currDateAsStr.weekDay;
    }
    if (calendarDateMonth) {
      calendarDateMonth.textContent = currDateAsStr.month;
    }
    if (calendarDateDay) {
      calendarDateDay.textContent = currDateAsStr.day;
    }
  }

  renderWeatherDisplay(parent: Element): void {
    let display: Element = this.createCalElem('weatherDisplay'),
        inner: Element = this.createCalElem('weatherDisplayInner'),
        city: Element = this.createCalElem('weatherDisplayCity'),
        todayWeather: Element = this.createCalElem('weatherDisplayTodayWeather'),
        forecast: Element = this.createCalElem('weatherDisplayForecast'),
        invisibleMod: string = this.getModClass('weatherDisplay', 'invisible');

    parent.appendChild(display);
    display.appendChild(inner);
    inner.append(city, todayWeather, forecast);
    display.classList.add(invisibleMod);
  }

  updateWeatherDisplay(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let display: Element = this.queryCalElemAll(parent, 'weatherDisplay')[0],
        todayWeather: ICityInstantWeather = this._db.todayWeather,
        forecast: ICityForecast = this._db.forecast,
        invisibleMod: string = this.getModClass('weatherDisplay', 'invisible');

    if (!todayWeather && !forecast) {
      display.classList.add(invisibleMod);
      return;
    }

    let isForecastUpdated: boolean = this.updateForecast(display),
        isTodayWeatherUpdated: boolean = this.updateTodayWeather(display);
    if (!isForecastUpdated && !isTodayWeatherUpdated) {
      display.classList.add(invisibleMod);
    }
    else {
      this.updateCity(display);
      display.classList.remove(invisibleMod);
    }
  }

  updateTodayWeather(parent?: Element): boolean {
    if (!parent) {
      parent = this._model;
    }
    let weatherDisplay: Element = this.queryCalElemAll(parent, 'weatherDisplayTodayWeather')[0],
        oldThumbs: Element[] = this.queryCalElemAll(weatherDisplay, 'weatherThumb');

    oldThumbs.forEach(function(thumb: Element) {
      weatherDisplay.removeChild(thumb);
    });
    if (!this._db.todayWeather) {
      return false;
    }
    if (!CalendarDB.isEqualDatesYMD(this._db.chosenDate, this._db.todayWeather.weather.date)) {
      return false;
    }
    weatherDisplay.appendChild(this.createWeatherThumb(this._db.todayWeather.weather, true));
    return true;
  }

  updateForecast(parent?: Element): boolean {
    if (!parent) {
      parent = this._model;
    }
    let forecast = this._db.forecast,
        forecastDisplay = this.queryCalElemAll(parent, 'weatherDisplayForecast')[0];
    this.queryCalElemAll(forecastDisplay, 'weatherThumb')
    .forEach(function(thumb) {
      forecastDisplay.removeChild(thumb);
    });
    if (!forecast) {
      return false;
    }
    let currDay = this._db.forecast.dayList.filter((elem: IDayForecast) => {
      return CalendarDB.isEqualDatesYMD(this._db.chosenDate, elem.day);
    })[0];
    if (!currDay) {
      return false;
    }
    currDay.forecast.forEach((weather: InstantWeather) => {
      forecastDisplay.appendChild(this.createWeatherThumb(weather, false));
    });
    return true;
  }

  updateCity(parent?: Element): void {
    if (!parent) {
      parent = this._model;
    }
    let cityDisplay: Element = this.queryCalElemAll(parent, 'weatherDisplayCity')[0];
    cityDisplay.textContent = this._db.city + ', ' + this._db.country;
  }

  createWeatherThumb(weather: InstantWeather, hasDescription: boolean): Element {
    let thumb: Element = this.createCalElem('weatherThumb'),
        inner: Element = this.createCalElem('weatherThumbInner'),
        temp: Element = this.createCalElem('weatherThumbTemp'),
        time: Element = this.createCalElem('weatherThumbTime'),
        icon: Element = this.createWeatherIcon(weather.id),
        timeFormatter = new Intl.DateTimeFormat("ru", {
          hour: "numeric",
          minute: "numeric"
        });

    thumb.appendChild(inner);
    inner.append(temp, time, icon);
    if (hasDescription) {
      let description: Element = this.createCalElem('weatherThumbDescription');
      description.textContent = weather.description;
      inner.appendChild(description);
    }

    temp.textContent = weather.temp + ' \u00B0C';
    time.textContent = timeFormatter.format(weather.date);
    return thumb;
  }

  createWeatherIcon(id: number): Element {
    let icon: Element = this.createCalElem('weatherIcon'),
        group: number = Math.floor(id / 100),
        modName: string,
        mod: string;
    switch(group) {
      case 2:
        modName = 'thunderstorm';
        break;
      case 3:
        modName = 'drizzle';
        break;
      case 5:
        modName = 'rain';
        break;
      case 6:
        modName = 'snow';
        break;
      case 7:
        modName = 'atmosphere';
        break;
      case 8:
        modName = (id === 800) ? 'clear' : 'clouds';
        break;
      default:
        modName = 'def';
    }
    mod = this.getModClass('weatherIcon', modName);
    icon.classList.add(mod);
    return icon;
  }

  private queryCalElemAll: (fragment: Element, elementName: string) => Element[];

  private createCalElem: (elementName: string) => Element;

  private addClassArrToNode: (node: Element, classList: string[]) => void;

  private getCalElemMainClassStr: (elementName: string) => string;

  private getModClass: (elementName: string, elementMod: string) => string;
}

class RendererHelperMixin {
  queryCalElemAll(fragment: Element, elementName: string): Element[] {
    return Array.from(fragment.querySelectorAll(this.getCalElemMainClassStr(elementName)));
  }

  createCalElem(elementName: string): Element {
    let elementProps = CALENDAR_CLASSES[elementName],
        element: Element = document.createElement(elementProps.tag);
    this.addClassArrToNode(element, elementProps.classList);
    return element;
  }

  addClassArrToNode(node: Element, classList: string[]): void {
    classList.forEach(className => node.classList.add(className));
  }

  getCalElemMainClassStr(elementName: string): string {
    return "." + CALENDAR_CLASSES[elementName].classList[0];
  }

  getModClass(elementName: string, elementMod: string): string {
    let elem = CALENDAR_CLASSES[elementName],
        elemClass: string = elem.classList[0],
        modifier: string = elemClass + elem.mod[elementMod];
    return modifier;
  }
}

for (let key in RendererHelperMixin.prototype) {
  CalendarRenderer.prototype[key] = RendererHelperMixin.prototype[key];
}
