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
  daypickerDay: {
    tag: 'td',
    classList: ['daypicker__day']
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

CalendarController.prototype = {
  constructor: CalendarController,

  showCalendar: function() {
    return this.view.render();
  }
};

function CalendarDB(today) {
  if (!today) {
    today = new Date();
  }
  this.today = today;
  this.chosenDate = today;
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
    this.renderDatePicker(domModel);
    this.renderCalendarDate(domModel);
    return domModel;
  },

  renderSkeleton: function(fragment) {
    let calendar = this.createCalElem('calendar'),
        inner = this.createCalElem('calendarInner'),
        pickerPanel = this.createCalElem('calendarPickerPanel'),
        additionalPanel = this.createCalElem('calendarAdditionalPanel');
    fragment.appendChild(calendar);
    calendar.appendChild(inner);
    inner.append(pickerPanel, additionalPanel);
    return fragment;
  },

  renderDatePicker: function(fragment) {
    let pickerPanel = this.queryCalElemAll(fragment, 'calendarPickerPanel')[0],
        datepicker = this.createCalElem('datepicker');
    pickerPanel.appendChild(datepicker);
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
    yearpickerYear.textContent = CalendarDB.getDateAsStr(this.db.chosenDate).year;
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
        daypickerWeekDay = this.createCalElem('daypickerWeekDay'),
        daypickerDayMatrix = this.createCalElem('daypickerDayMatrix'),
        daypickerDayMatrixRow = this.createCalElem('daypickerDayMatrixRow'),
        daypickerDay = this.createCalElem('daypickerDay');
    parent.appendChild(daypicker);
    daypicker.append(daypickerHeading, daypickerDayMatrix);
    daypickerHeading.appendChild(daypickerWeekList);
    daypickerWeekList.append(daypickerWeekDay);
    daypickerDayMatrix.append(daypickerDayMatrixRow);
    daypickerDayMatrixRow.append(daypickerDay);
  },

  renderCalendarDate: function(fragment) {
    let calendarAdditionalPanel = this.queryCalElemAll(fragment, 'calendarAdditionalPanel')[0],
        calendarDateWrapper = this.createCalElem('calendarDateWrapper'),
        calendarDateWeek = this.createCalElem('calendarDateWeek'),
        calendarDateDayMonth = this.createCalElem('calendarDateDayMonth'),
        currDateAsStr = CalendarDB.getDateAsStr(this.db.chosenDate);
    calendarAdditionalPanel.appendChild(calendarDateWrapper);
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
