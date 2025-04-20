import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment, { Moment } from 'moment';

interface DayObject {
  name: string;
  value: number;
  indexWeek: number;
}

@Component({
  selector: 'app-h-inico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './h-inico.component.html',
  styleUrls: ['./h-inico.component.css']
})
export class HInicoComponent implements OnInit {
  week: string[] = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo"
  ];

  monthSelect: DayObject[] = [];
  dateSelect!: Moment;
  dateValue!: Moment;

  constructor() {}

  ngOnInit(): void {
    this.getDaysFromDate(11, 2020);
  }

  getDaysFromDate(month: number, year: number): void {
    const startDate = moment.utc(`${year}/${month}/01`);
    const endDate = startDate.clone().endOf('month');
    this.dateSelect = startDate;

    const numberDays = endDate.diff(startDate, 'days');

    const arrayDays: DayObject[] = Array.from({ length: numberDays }, (_, i) => {
      const dayNumber = i + 1;
      const dayObject = moment(`${year}-${month}-${dayNumber}`);
      return {
        name: dayObject.format("dddd"),
        value: dayNumber,
        indexWeek: dayObject.isoWeekday()
      };
    });

    this.monthSelect = arrayDays;
  }

  changeMonth(flag: number): void {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      this.getDaysFromDate(parseInt(prevDate.format("MM")), parseInt(prevDate.format("YYYY")));
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(parseInt(nextDate.format("MM")), parseInt(nextDate.format("YYYY")));
    }
  }

  clickDay(day: DayObject): void {
    const monthYear = this.dateSelect.format('YYYY-MM');
    const parse = `${monthYear}-${day.value}`;
    this.dateValue = moment(parse);
  }
}
