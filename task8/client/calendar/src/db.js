function CalendarDB() {
  today = new Date();
  this.today = today;
  this.chosenDate = today;
  this.dayList = [];
  this.city = null;
  this.todayWeather = null;
  this.forecast = null;
}

CalendarDB._monthNames = null;
CalendarDB._dayNames = null;

CalendarDB.getMonthNames = function() {
  if (CalendarDB._monthNames) {
    return CalendarDB._monthNames;
  }
  let counter = new Date(),
      currYear = counter.getFullYear(),
      locale = CalendarDB.getNavigatorLanguage(),
      formatter = new Intl.DateTimeFormat(locale, { month: 'long' }),
      names = [];

  counter.setMonth(0);
  while(counter.getFullYear() === currYear) {
    names.push(formatter.format(counter));
    counter.setMonth(counter.getMonth() + 1);
  };
  CalendarDB._monthNames = names;
  return names;
};

CalendarDB.getDayNames = function() {
  if (CalendarDB._dayNames) {
    return CalendarDB._dayNames;
  }
  let counter = new Date(),
      dateOffset = counter.getDay(),
      locale = CalendarDB.getNavigatorLanguage(),
      formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' }),
      names = [];

  counter.setDate(counter.getDate() - dateOffset);
  do {
    names.push(formatter.format(counter));
    counter.setDate(counter.getDate() + 1);
  } while(counter.getDay() !== 0);
  CalendarDB._dayNames = names;
  return names;
};

CalendarDB.getNavigatorLanguage = function() {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
  }
};

CalendarDB.getDateAsStr = function(date) {
  return {
    weekDay: CalendarDB.getDayNames()[date.getDay()],
    day: "" + date.getDate(),
    month: CalendarDB.getMonthNames()[date.getMonth()],
    year: "" + date.getFullYear()
  };
};

CalendarDB.isEqualDatesYMD = function(date1, date2) {
  date1 = CalendarDB.getDateMidnight(date1);
  date2 = CalendarDB.getDateMidnight(date2);
  return (date1 - date2) === 0;
}

CalendarDB.getDateMidnight = function(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}
