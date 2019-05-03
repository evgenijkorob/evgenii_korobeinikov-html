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
];

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

function CalendarDB() {
  today = new Date();
  this.today = today;
  this.chosenDate = today;
  this.dayList = [];
  this.city = undefined;
  this.todayWeather = undefined;
  this.forecast = undefined;
}

CalendarDB.getMonthNames = function() {
  return MONTH_NAMES;
};

CalendarDB.getDayNames = function() {
  return DAY_NAMES;
};

CalendarDB.getDateAsStr = function(date) {
  return {
    weekDay: CalendarDB.getDayNames[date.getDay()],
    day: "" + date.getDate(),
    month: CalendarDB.getMonthNames[date.getMonth()],
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
