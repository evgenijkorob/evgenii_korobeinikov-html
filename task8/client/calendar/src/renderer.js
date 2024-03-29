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

function CalendarRenderer(database) {
  this.db = database;
  this.model = undefined;
}

CalendarRenderer.prototype = {
  constructor: CalendarRenderer,

  render: function() {
    let domModel = document.createElement('div');
    this.renderSkeleton(domModel);
    let pickerPanel = this.queryCalElemAll(domModel, 'calendarPickerPanel')[0],
        additionalPanel = this.queryCalElemAll(domModel, 'calendarAdditionalPanel')[0];
    this.renderDatePicker(pickerPanel);
    this.renderCalendarDate(pickerPanel);
    this.renderWeatherDisplay(additionalPanel);
    this.model = domModel.children[0];
    return this.model;
  },

  onChosenDateChange: function(oldDate) {
    let newDate = this.db.chosenDate,
        isYearChanged = newDate.getFullYear() !== oldDate.getFullYear(),
        isMonthChanged = newDate.getMonth() !== oldDate.getMonth();
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
  },

  onTodayDateChange: function() {
    this.updateTodayDay();
  },

  renderSkeleton: function(parent) {
    let calendar = this.createCalElem('calendar'),
        inner = this.createCalElem('calendarInner'),
        pickerPanel = this.createCalElem('calendarPickerPanel'),
        additionalPanel = this.createCalElem('calendarAdditionalPanel');
    parent.appendChild(calendar);
    calendar.appendChild(inner);
    inner.append(pickerPanel, additionalPanel);
    return parent;
  },

  renderDatePicker: function(parent) {
    let datepicker = this.createCalElem('datepicker');
    parent.appendChild(datepicker);
    this.renderYearpicker(datepicker);
    this.renderMonthpicker(datepicker);
    this.renderDaypicker(datepicker);
  },

  renderYearpicker: function(parent) {
    let yearpicker = this.createCalElem('yearpicker'),
        yearpickerInner = this.createCalElem('yearpickerInner'),
        yearpickerControlWrapper = this.createCalElem('yearpickerControlWrapper'),
        yearpickerControlIncreaser = this.createCalElem('yearpickerControlIncreaser'),
        yearpickerControlDecreaser = this.createCalElem('yearpickerControlDecreaser'),
        yearpickerYear = this.createCalElem('yearpickerYear');

    parent.appendChild(yearpicker);
    yearpicker.appendChild(yearpickerInner);
    yearpickerInner.append(yearpickerControlWrapper, yearpickerYear);
    yearpickerControlIncreaser.setAttribute('data-date-changer', '');
    yearpickerControlIncreaser.setAttribute('data-year-sub', 1);
    yearpickerControlDecreaser.setAttribute('data-date-changer', '');
    yearpickerControlDecreaser.setAttribute('data-year-sub', -1);
    yearpickerControlWrapper.append(yearpickerControlIncreaser, yearpickerControlDecreaser);

    this.updateYearpicker(yearpickerInner);
  },

  updateYearpicker: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let yearElem = this.queryCalElemAll(parent, 'yearpickerYear')[0],
        year = this.db.chosenDate.getFullYear();
    if (yearElem) {
      yearElem.textContent = year;
    }
  },

  renderMonthpicker: function(parent) {
    let monthpicker = this.createCalElem('monthpicker'),
        monthpickerContainer = this.createCalElem('monthpickerContainer');

    parent.appendChild(monthpicker);
    monthpicker.appendChild(monthpickerContainer);

    let monthNames = CalendarDB.getMonthNames(),
        monthpickerElems = Array.from(monthNames, function(name, monthNum) {
          let elem = this.createCalElem('monthpickerElement');
          elem.textContent = name.slice(0, 3);
          elem.setAttribute('data-month', monthNum);
          elem.setAttribute('data-date-changer', '');
          return elem;
        }, this);
    monthpickerElems.forEach(function(elem) {
      monthpickerContainer.appendChild(elem);
    });
    this.updateChosenMonth(monthpickerContainer);
  },

  updateChosenMonth: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let mod = this.getModClass('monthpickerElement', 'active'),
        lastChosenMonth = parent.querySelector('.' + mod),
        elems = this.queryCalElemAll(parent, 'monthpickerElement'),
        month = this.db.chosenDate.getMonth();
    if (lastChosenMonth) {
      lastChosenMonth.classList.remove(mod);
    }
    let chosenElem = elems.filter(function(elem) {
      return elem.getAttribute('data-month') == month;
    })[0];
    if (chosenElem) {
      chosenElem.classList.add(mod);
    }
  },

  renderDaypicker: function(parent) {
    let daypicker = this.createCalElem('daypicker'),
        daypickerHeading = this.createCalElem('daypickerHeading'),
        daypickerWeekList = this.createCalElem('daypickerWeekList'),
        daypickerDayMatrix = this.createCalElem('daypickerDayMatrix');

    parent.appendChild(daypicker);
    daypicker.append(daypickerHeading, daypickerDayMatrix);
    daypickerHeading.appendChild(daypickerWeekList);

    let dayNames = CalendarDB.getDayNames(),
        weekDayArr = Array.from(dayNames, function(name) {
          let elem = this.createCalElem('daypickerWeekDay');
          elem.textContent = name.slice(0, 3);
          return elem;
        }, this);
    weekDayArr.forEach(function(elem) {
      daypickerWeekList.appendChild(elem);
    });

    this.renderDayMatrix(daypickerDayMatrix);
    this.updateDayMatrixData(daypickerDayMatrix);
    this.updateChosenDayElem(daypickerDayMatrix);
    this.updateTodayDay(daypickerDayMatrix);
  },

  renderDayMatrix: function(parent) {
    const rowAmount = 6;
    let matrixRowArr = Array.from({ length: rowAmount }, function() {
          return this.createCalElem('daypickerDayMatrixRow');
        }, this),
        dayNames = CalendarDB.getDayNames();
    matrixRowArr.forEach(function(row) {
      for (let i = 0; i < dayNames.length; i++) {
        row.appendChild(this.createDayMatrixElement());
      }
      parent.appendChild(row);
    }, this);
  },

  createDayMatrixElement: function() {
    let matrixElem = this.createCalElem('daypickerDayMatrixElement'),
        dayWrapper = this.createCalElem('daypickerDayWrapper'),
        dayElement = this.createCalElem('daypickerDay');
    matrixElem.appendChild(dayWrapper);
    dayWrapper.appendChild(dayElement);
    dayElement.setAttribute('data-date-changer', '');
    return matrixElem;
  },

  updateDayMatrixData: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let rows = this.queryCalElemAll(parent, 'daypickerDayMatrixRow'),
        dayList = this.db.dayList,
        fadedMod = this.getModClass('daypickerDay', 'faded'),
        currMonth = this.db.chosenDate.getMonth();
    if (!rows) {
      return;
    }
    for (let dayIndx = 0, rowIndx = 0; dayIndx < dayList.length; dayIndx++) {
      let day = dayList[dayIndx],
          dayElem = this.queryCalElemAll(rows[rowIndx].cells[day.weekDay], 'daypickerDay')[0];

      dayElem.textContent = day.number;
      dayElem.setAttribute('data-day', day.number);
      dayElem.setAttribute('data-month', day.month);
      dayElem.setAttribute('data-year', day.year);
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
  },

  updateChosenDayElem: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let activeMod = this.getModClass('daypickerDay', 'active'),
        lastChosenElem = parent.querySelector('.' + activeMod),
        daysArr = this.queryCalElemAll(parent, 'daypickerDay');
    if (lastChosenElem) {
      lastChosenElem.classList.remove(activeMod);
    }
    let chosenElem = this.getDayElemByDate(daysArr, this.db.chosenDate);
    if (chosenElem) {
      chosenElem.classList.add(activeMod);
    }
  },

  updateTodayDay: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let todayMod = this.getModClass('daypickerDay', 'today'),
        prevTodayElem = parent.querySelector('.' + todayMod),
        daysArr = this.queryCalElemAll(parent, 'daypickerDay');
    if (prevTodayElem) {
      prevTodayElem.classList.remove(todayMod);
    }
    let todayDayElem = this.getDayElemByDate(daysArr, this.db.today);
    if (todayDayElem) {
      todayDayElem.classList.add(todayMod);
    }
  },

  getDayElemByDate: function(dayElemsArr, date) {
    let day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear();

    return dayElemsArr.filter(function(dayElem) {
              return dayElem.getAttribute('data-day') == day &&
                    dayElem.getAttribute('data-month') == month &&
                    dayElem.getAttribute('data-year') == year;
            })[0];
  },

  renderCalendarDate: function(parent) {
    let calendarDateWrapper = this.createCalElem('calendarDateWrapper'),
        calendarDateWeek = this.createCalElem('calendarDateWeek'),
        calendarDateMonth = this.createCalElem('calendarDateMonth'),
        calendarDateDay = this.createCalElem('calendarDateDay');
    parent.appendChild(calendarDateWrapper);
    calendarDateWrapper.append(calendarDateWeek, calendarDateMonth, calendarDateDay);
    this.updateCalendarDate(calendarDateWrapper);
  },

  updateCalendarDate: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let calendarDateWeek = this.queryCalElemAll(parent, 'calendarDateWeek')[0],
        calendarDateMonth = this.queryCalElemAll(parent, 'calendarDateMonth')[0],
        calendarDateDay = this.queryCalElemAll(parent, 'calendarDateDay')[0],
        currDateAsStr = CalendarDB.getDateAsStr(this.db.chosenDate);

    if (calendarDateWeek) {
      calendarDateWeek.textContent = currDateAsStr.weekDay;
    }
    if (calendarDateMonth) {
      calendarDateMonth.textContent = currDateAsStr.month;
    }
    if (calendarDateDay) {
      calendarDateDay.textContent = currDateAsStr.day;
    }
  },

  renderWeatherDisplay: function(parent) {
    let display = this.createCalElem('weatherDisplay'),
        inner = this.createCalElem('weatherDisplayInner'),
        city = this.createCalElem('weatherDisplayCity'),
        todayWeather = this.createCalElem('weatherDisplayTodayWeather'),
        forecast = this.createCalElem('weatherDisplayForecast'),
        invisibleMod = this.getModClass('weatherDisplay', 'invisible');

    parent.appendChild(display);
    display.appendChild(inner);
    inner.append(city, todayWeather, forecast);
    display.classList.add(invisibleMod);
  },

  updateWeatherDisplay: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let display = this.queryCalElemAll(parent, 'weatherDisplay')[0],
        todayWeather = this.db.todayWeather,
        forecast = this.db.forecast,
        invisibleMod = this.getModClass('weatherDisplay', 'invisible');

    if (!todayWeather && !forecast) {
      display.classList.add(invisibleMod);
      return;
    }

    let isForecastUpdated = this.updateForecast(display),
        isTodayWeatherUpdated = this.updateTodayWeather(display);
    if (!isForecastUpdated && !isTodayWeatherUpdated) {
      display.classList.add(invisibleMod);
    }
    else {
      this.updateCity(display);
      display.classList.remove(invisibleMod);
    }
  },

  updateTodayWeather: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let weatherDisplay = this.queryCalElemAll(parent, 'weatherDisplayTodayWeather')[0],
        oldThumbs = this.queryCalElemAll(weatherDisplay, 'weatherThumb');

    oldThumbs.forEach(function(thumb) {
      weatherDisplay.removeChild(thumb);
    });
    if (!this.db.todayWeather) {
      return false;
    }
    if (!CalendarDB.isEqualDatesYMD(this.db.chosenDate, this.db.todayWeather.date)) {
      return false;
    }
    weatherDisplay.appendChild(this.createWeatherThumb(this.db.todayWeather, true));
    return true;
  },

  updateForecast: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let forecast = this.db.forecast,
        forecastDisplay = this.queryCalElemAll(parent, 'weatherDisplayForecast')[0];
    this.queryCalElemAll(forecastDisplay, 'weatherThumb')
    .forEach(function(thumb) {
      forecastDisplay.removeChild(thumb);
    });
    if (!forecast) {
      return false;
    }
    let currDay = this.db.forecast.filter(function(elem) {
      return CalendarDB.isEqualDatesYMD(this.db.chosenDate, elem.day);
    }, this)[0];
    if (!currDay) {
      return false;
    }
    currDay.forecast.forEach(function(weather) {
      forecastDisplay.appendChild(this.createWeatherThumb(weather, false));
    }, this);
    return true;
  },

  updateCity: function(parent) {
    if (!parent) {
      parent = this.model;
    }
    let cityDisplay = this.queryCalElemAll(parent, 'weatherDisplayCity')[0];
    cityDisplay.textContent = this.db.city + ', ' + this.db.country;
  },

  createWeatherThumb: function(weather, hasDescription) {
    let thumb = this.createCalElem('weatherThumb'),
        inner = this.createCalElem('weatherThumbInner'),
        temp = this.createCalElem('weatherThumbTemp'),
        time = this.createCalElem('weatherThumbTime'),
        icon = this.createWeatherIcon(weather.id),
        timeFormatter = new Intl.DateTimeFormat("ru", {
          hour: "numeric",
          minute: "numeric"
        });

    thumb.appendChild(inner);
    inner.append(temp, time, icon);
    if (hasDescription) {
      let description = this.createCalElem('weatherThumbDescription');
      description.textContent = weather.description;
      inner.appendChild(description);
    }

    temp.textContent = weather.temp + ' \u00B0C';
    time.textContent = timeFormatter.format(weather.date);
    return thumb;
  },

  createWeatherIcon: function(id) {
    let icon = this.createCalElem('weatherIcon'),
        group = Math.floor(id / 100),
        modName,
        mod;
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
}

const rendererHelperMixin = {
  queryCalElemAll: function(fragment, elementName) {
    return Array.from(fragment.querySelectorAll(this.getCalElemMainClassStr(elementName)));
  },

  createCalElem: function(elementName) {
    let elementProps = CALENDAR_CLASSES[elementName],
        element = document.createElement(elementProps.tag);
    this.addClassArrToNode(element, elementProps.classList);
    return element;
  },

  addClassArrToNode: function(node, classList) {
    classList.forEach(function(className) {
      node.classList.add(className);
    });
  },

  getCalElemMainClassStr: function(elementName) {
    return "." + CALENDAR_CLASSES[elementName].classList[0];
  },

  getModClass: function(elementName, elementMod) {
    let elem = CALENDAR_CLASSES[elementName],
        elemClass = elem.classList[0],
        modifier = elemClass + elem.mod[elementMod];
    return modifier;
  },
}

for (let key in rendererHelperMixin) {
  CalendarRenderer.prototype[key] = rendererHelperMixin[key];
}
