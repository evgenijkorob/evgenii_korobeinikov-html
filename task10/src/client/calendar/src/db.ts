import { ICityInstantWeather, ICityForecast } from './weather';
import { Day } from './controller';

export interface IDateAsStr {
  day: string,
  weekDay: string,
  month: string,
  year: string
};

export class CalendarDB {
  public today: Date;
  public chosenDate: Date;
  public dayList: Day[];
  public country: string;
  public city: string;
  public todayWeather: ICityInstantWeather;
  public forecast: ICityForecast;
  private static _monthNames: string[] = null;
  private static _dayNames: string[] = null;

  public constructor() {
    this.today = new Date();
    this.chosenDate = this.today;
    this.dayList = [];
    this.country = null;
    this.city = null;
    this.todayWeather = null;
    this.forecast = null;
  }

  public static getMonthNames(): string[] {
    if (CalendarDB._monthNames) {
      return CalendarDB._monthNames;
    }
    let counter = new Date(),
        currYear: number = counter.getFullYear(),
        locale: string = CalendarDB.getNavigatorLanguage(),
        formatter = new Intl.DateTimeFormat(locale, { month: 'long' }),
        names: string[] = [];

    counter.setMonth(0);
    while(counter.getFullYear() === currYear) {
      names.push(formatter.format(counter));
      counter.setMonth(counter.getMonth() + 1);
    };
    CalendarDB._monthNames = names;
    return names;
  }

  public static getDayNames(): string[] {
    if (CalendarDB._dayNames) {
      return CalendarDB._dayNames;
    }
    let counter = new Date(),
        dateOffset: number = counter.getDay(),
        locale: string = CalendarDB.getNavigatorLanguage(),
        formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' }),
        names: string[] = [];

    counter.setDate(counter.getDate() - dateOffset);
    do {
      names.push(formatter.format(counter));
      counter.setDate(counter.getDate() + 1);
    } while(counter.getDay() !== 0);
    CalendarDB._dayNames = names;
    return names;
  }

  public static getNavigatorLanguage(): string {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    }
    else {
      return /*navigator.userLanguage || */navigator.language/* || navigator.browserLanguage*/ || 'en';
    }
  }

  public static getDateAsStr(date: Date): IDateAsStr {
    return {
      weekDay: CalendarDB.getDayNames()[date.getDay()],
      day: "" + date.getDate(),
      month: CalendarDB.getMonthNames()[date.getMonth()],
      year: "" + date.getFullYear()
    };
  }

  public static isEqualDatesYMD(date1, date2): boolean {
    date1 = CalendarDB.getDateMidnight(date1);
    date2 = CalendarDB.getDateMidnight(date2);
    return (date1 - date2) === 0;
  }

  public static getDateMidnight(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }
}
