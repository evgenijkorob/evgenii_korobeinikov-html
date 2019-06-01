///<reference path='../custom.d.ts'>
import CalendarController from './src/controller';
import './style/calendar.css';

export default class Calendar {
  constructor(parentNode: HTMLElement) {
    let controller: CalendarController = new CalendarController();
    parentNode.appendChild(controller.showCalendar());
  }
}
