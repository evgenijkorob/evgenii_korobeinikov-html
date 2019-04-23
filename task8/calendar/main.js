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
    classList: ['yearpicker']
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
    classList: ['yearpicker__increaser']
  },
  yearpickerControlDecreaser: {
    tag: 'div',
    classList: ['yearpicker__decreaser']
  },
  yearpickerYear: {
    tag: 'div',
    classList: ['yearpicker__year']
  },
  monthpicker: {
    tag: 'div',
    classList: ['monthpicker']
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

function Day(number, weekDay, month) {
  this.number = number;
  this.weekDay = weekDay;
  this.month = month;
}

CalendarController.prototype = {
  constructor: CalendarController,

  showCalendar: function() {
    this.db.dayList = this.generateMonthDaysArr(this.db.chosenDate);
    return this.view.render();
  },

  generateMonthDaysArr: function(date) {
    let list = [],
        currYear = date.getFullYear(),
        currMonth = date.getMonth(),
        start = new Date(currYear, currMonth),
        day = start;
    while(day.getMonth() === currMonth) {
      list.push(new Day(day.getDate(), day.getDay(), day.getMonth()));
      day.setDate(day.getDate() + 1);
    };
    return list;
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
        yearpickerYear = this.createCalElem('yearpickerYear'),
        chosenYear = CalendarDB.getDateAsStr(this.db.chosenDate).year;

    parent.appendChild(yearpicker);
    yearpicker.appendChild(yearpickerInner);
    yearpickerYear.textContent = chosenYear;
    yearpickerInner.append(yearpickerControlWrapper, yearpickerYear);
    yearpickerControlWrapper.append(yearpickerControlIncreaser, yearpickerControlDecreaser);
  },

  renderMonthpicker: function(parent) {
    let monthpicker = this.createCalElem('monthpicker'),
        monthpickerContainer = this.createCalElem('monthpickerContainer'),
        currMonthNum = this.db.chosenDate.getMonth();

    parent.appendChild(monthpicker);
    monthpicker.appendChild(monthpickerContainer);

    let monthpickerElems = Array.from(MONTH_NAMES, function(name) {
      let elem = this.createCalElem('monthpickerElement');
      elem.textContent = name.slice(0, 3);
      return elem;
    }, this);
    this.toggleMod(monthpickerElems[currMonthNum], 'monthpickerElement', 'active');
    monthpickerElems.forEach(function(elem) {
      monthpickerContainer.appendChild(elem);
    });
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
  },

  renderDayMatrix: function(parent) {
    function isChosen(day) {
      let chosenDate = this.db.chosenDate;
      return chosenDate.getDate() === day.number && chosenDate.getMonth() === day.month;
    }

    const rowAmount = 5;
    let dbDayList = this.db.dayList,
        matrixRowArr = Array.from({ length: rowAmount }, function() {
          return this.createCalElem('daypickerDayMatrixRow');
        }, this);

    for (let weekDay = 0; weekDay < dbDayList[0].weekDay; weekDay++) {
      matrixRowArr[0].appendChild(this.createDayMatrixElement());
    }

    for (let dayIndx = 0, rowIndx = 0; dayIndx < dbDayList.length; dayIndx++) {
      let day = dbDayList[dayIndx];
      let matrixRowElem = this.createDayMatrixElement(day.number);
      matrixRowArr[rowIndx].appendChild(matrixRowElem);
      if (isChosen.call(this, day)) {
        let dayElem = this.queryCalElemAll(matrixRowElem, 'daypickerDay')[0];
        this.toggleMod(dayElem, 'daypickerDay', 'active');
      }
      if (day.weekDay === (DAY_NAMES.length - 1)) {
        rowIndx++;
      }
    }
    let lastWeekDayOfMonth = dbDayList[dbDayList.length - 1].weekDay;
    for (let weekDay = lastWeekDayOfMonth + 1; weekDay < DAY_NAMES.length; weekDay++) {
      matrixRowArr[matrixRowArr.length - 1].appendChild(this.createDayMatrixElement());
    }

    matrixRowArr.forEach(function(row) {
      parent.appendChild(row);
    });
  },

  createDayMatrixElement: function(content) {
    content = content || "";
    let matrixElem = this.createCalElem('daypickerDayMatrixElement'),
        dayWrapper = this.createCalElem('daypickerDayWrapper'),
        dayElement = this.createCalElem('daypickerDay');
    dayElement.textContent = content;
    matrixElem.appendChild(dayWrapper);
    dayWrapper.appendChild(dayElement);
    return matrixElem;
  },

  renderCalendarDate: function(parent) {
    let calendarDateWrapper = this.createCalElem('calendarDateWrapper'),
        calendarDateWeek = this.createCalElem('calendarDateWeek'),
        calendarDateDayMonth = this.createCalElem('calendarDateDayMonth'),
        currDateAsStr = CalendarDB.getDateAsStr(this.db.chosenDate);
    parent.appendChild(calendarDateWrapper);
    calendarDateWeek.textContent = currDateAsStr.weekDay;
    calendarDateDayMonth.textContent = currDateAsStr.month + " " + currDateAsStr.day;
    calendarDateWrapper.append(calendarDateWeek, calendarDateDayMonth);
  }
}

const rendererHelperMixin = {
  queryCalElemAll: function(fragment, elementName) {
    return fragment.querySelectorAll(this.getCalElemMainClassStr(elementName));
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

  toggleMod: function(node, elementName, elementMod) {
    let elem = CALENDAR_CLASSES[elementName],
        elemClass = elem.classList[0],
        modifier = elemClass + elem.mod[elementMod];
    node.classList.toggle(modifier);
  }
}

for (let key in rendererHelperMixin) {
  CalendarRenderer.prototype[key] = rendererHelperMixin[key];
}
