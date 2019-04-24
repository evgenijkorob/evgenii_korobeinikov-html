const MONTH_NAMES = [
  'january',
  'febrary',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

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
      active: "_active"
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
  calendarDateDayMonth: {
    tag: 'span',
    classList: ['calendar__date-day-month']
  }
}

function Calendar() {
  let controller = new CalendarController();

  this.show = function() {
    return controller.showCalendar();
  }
}

function CalendarController() {
  this.db = new CalendarDB();
  this.view = new CalendarRenderer(this.db);
}

function Day(number, weekDay, month, year) {
  this.number = number;
  this.weekDay = weekDay;
  this.month = month;
  this.year = year;
}

CalendarController.prototype = {
  constructor: CalendarController,

  showCalendar: function() {
    let calendarView;
    this.db.dayList = this.generateMonthDaysArr(this.db.chosenDate);
    calendarView = this.view.render();
    this.setHandlers(calendarView);
    return calendarView;
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

  setHandlers: function(view) {
    let calendar = view.querySelector('.' + CALENDAR_CLASSES.calendar.classList[0]);
    calendar.addEventListener('click', function(event) {
      let target = event.target.closest('*[data-date-changer]');
      if (!target) {
        return;
      }
      let oldDate = this.db.chosenDate,
          newDate = new Date(oldDate),
          yearSub = +target.getAttribute('data-year-sub'),
          year = target.getAttribute('data-year'),
          month = target.getAttribute('data-month'),
          day = target.getAttribute('data-day');
      if (year) {
        newDate.setFullYear(year);
      }
      else if (yearSub) {
        newDate.setFullYear(oldDate.getFullYear() + yearSub);
      }
      if (month) {
        newDate.setMonth(month);
      }
      if (day) {
        newDate.setDate(day);
      }
      this.db.chosenDate = newDate;
      this.checkNeedForComponentsUpdate(oldDate, calendar);
    }.bind(this));
  },

  checkNeedForComponentsUpdate: function(oldDate, calendarView) {
    let newDate = this.db.chosenDate;
    if (newDate === oldDate) {
      return;
    }

    let isYearChanged = newDate.getFullYear() !== oldDate.getFullYear(),
        isMonthChanged = newDate.getMonth() !== oldDate.getMonth();
    if (isYearChanged) {
      this.view.updateYearpicker(calendarView);
    }
    if (isMonthChanged) {
      this.view.updateChosenMonth(calendarView);
    }
    if (isYearChanged || isMonthChanged) {
      this.db.dayList = this.generateMonthDaysArr(newDate);
      this.view.updateDayMatrixData(calendarView);
    }
    this.view.updateChosenDayElem(calendarView);
    this.view.updateCalendarDate(calendarView);
  }
};

function CalendarDB(today) {
  today = today || new Date();
  this.today = today;
  this.chosenDate = today;
  this.dayList = [];
}

CalendarDB.prototype = {
  constructor: CalendarDB,
};

CalendarDB.getDateAsStr = function(date) {
  return {
    weekDay: DAY_NAMES[date.getDay()],
    day: "" + date.getDate(),
    month: MONTH_NAMES[date.getMonth()],
    year: "" + date.getFullYear()
  };
};

function CalendarRenderer(database) {
  this.db = database;
}

CalendarRenderer.prototype = {
  constructor: CalendarRenderer,

  render: function() {
    let domModel = document.createDocumentFragment();
    this.renderSkeleton(domModel);
    let pickerPanel = this.queryCalElemAll(domModel, 'calendarPickerPanel')[0],
        additionalPanel = this.queryCalElemAll(domModel, 'calendarAdditionalPanel')[0];
    this.renderDatePicker(pickerPanel);
    this.renderCalendarDate(additionalPanel);
    return domModel;
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

    let monthpickerElems = Array.from(MONTH_NAMES, function(name, monthNum) {
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

    let weekDayArr = Array.from(DAY_NAMES, function(name) {
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
  },

  renderDayMatrix: function(parent) {
    const rowAmount = 6;
    let matrixRowArr = Array.from({ length: rowAmount }, function() {
          return this.createCalElem('daypickerDayMatrixRow');
        }, this);
    matrixRowArr.forEach(function(row) {
      for (let i = 0; i < DAY_NAMES.length; i++) {
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
    let rows = this.queryCalElemAll(parent, 'daypickerDayMatrixRow'),
        dayList = this.db.dayList;
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

      if (dayIndx % 7 === 6) {
        rowIndx++;
      }
    }
  },

  updateChosenDayElem: function(parent) {
    let mod = this.getModClass('daypickerDay', 'active'),
        lastChosenElem = parent.querySelector('.' + mod),
        date = this.db.chosenDate,
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear(),
        daysArr = this.queryCalElemAll(parent, 'daypickerDay');
    if (lastChosenElem) {
      lastChosenElem.classList.remove(mod);
    }
    let chosenElem = daysArr.filter(function(dayElem) {
      return dayElem.getAttribute('data-day') == day &&
              dayElem.getAttribute('data-month') == month &&
              dayElem.getAttribute('data-year') == year;
    })[0];
    if (chosenElem) {
      chosenElem.classList.add(mod);
    }
  },

  renderCalendarDate: function(parent) {
    let calendarDateWrapper = this.createCalElem('calendarDateWrapper'),
        calendarDateWeek = this.createCalElem('calendarDateWeek'),
        calendarDateDayMonth = this.createCalElem('calendarDateDayMonth');
    parent.appendChild(calendarDateWrapper);
    calendarDateWrapper.append(calendarDateWeek, calendarDateDayMonth);
    this.updateCalendarDate(calendarDateWrapper);
  },

  updateCalendarDate: function(parent) {
    let calendarDateWeek = this.queryCalElemAll(parent, 'calendarDateWeek')[0],
        calendarDateDayMonth = this.queryCalElemAll(parent, 'calendarDateDayMonth')[0],
        currDateAsStr = CalendarDB.getDateAsStr(this.db.chosenDate);

    if (calendarDateWeek) {
      calendarDateWeek.textContent = currDateAsStr.weekDay;
    }
    if (calendarDateDayMonth) {
      let content = currDateAsStr.month + " " + currDateAsStr.day;
      switch(currDateAsStr.day % 10) {
        case 1:
          content += 'st';
          break;
        case 2:
          content += 'nd';
          break;
        case 3:
          content += 'rd';
          break;
        default:
          content += 'th';
      }
      calendarDateDayMonth.textContent = content;
    }
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
