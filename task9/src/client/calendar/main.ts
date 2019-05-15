class Calendar {
  constructor(parentNode: HTMLElement) {
    let controller: CalendarController = new CalendarController();
    parentNode.appendChild(controller.showCalendar());
  }
}
