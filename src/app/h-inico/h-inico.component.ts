import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment, { Moment } from 'moment';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

interface DayObject {
  name: string;
  value: number;
  indexWeek: number;
}

@Component({
  selector: 'app-h-inico',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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
  today: Moment = moment();
  selectedDayValue: number = this.today.date();
  isDropdownOpen = false;
  habitos: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getDaysFromDate(4, 2025);
    this.cargarHabitos();
  }

  getDaysFromDate(month: number, year: number): void {
    const startDate = moment.utc(`${year}-${String(month).padStart(2, '0')}-01`);
    const endDate = startDate.clone().endOf('month');
    this.dateSelect = startDate;

    const numberDays = endDate.diff(startDate, 'days') + 1;

    const arrayDays: DayObject[] = Array.from({ length: numberDays }, (_, i) => {
      const dayNumber = i + 1;
      const dayObject = moment(`${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`);
      return {
        name: dayObject.format("dddd"),
        value: dayNumber,
        indexWeek: dayObject.isoWeekday()
      };
    });

    this.monthSelect = arrayDays;
  }

  changeMonth(flag: number): void {
    const referenceDate = flag < 0
      ? this.dateSelect.clone().subtract(1, 'month')
      : this.dateSelect.clone().add(1, 'month');

    this.getDaysFromDate(
      parseInt(referenceDate.format('MM'), 10),
      parseInt(referenceDate.format('YYYY'), 10)
    );
  }

  clickDay(day: DayObject): void {
    this.selectedDayValue = day.value;

    const formattedDay = String(day.value).padStart(2, '0');
    const fecha = `${this.dateSelect.format('YYYY-MM')}-${formattedDay}`;

    localStorage.setItem('fechaSeleccionada', fecha);
    this.cargarHabitos();
  }

  isSidebarVisible = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  fabOpen = false;

  toggleFab(): void {
    this.fabOpen = !this.fabOpen;
  }

  irAHabitos(): void {
    this.router.navigate(['/habitos', this.selectedDayValue]);
    this.fabOpen = false;
  }

  irANotas(): void {
    this.router.navigate(['/notas']);
    this.fabOpen = false;
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  abrirModal() {
    console.log('Abrir Modal');
  }

  fechaActual: Date = new Date();

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  cargarHabitos(): void {
    const data = localStorage.getItem('habito');
    if (data) {
      try {
        const todosHabitos = JSON.parse(data);
        if (Array.isArray(todosHabitos)) {
          // Filtrar duplicados por nombre y tipo (o lo que definas)
          const hash = new Set();
          this.habitos = todosHabitos.filter((h: any) => {
            const clave = `${h.nombre}-${h.tipo}`;
            if (hash.has(clave)) {
              return false;
            }
            hash.add(clave);
            return true;
          });
        } else {
          this.habitos = [];
        }
      } catch (err) {
        console.error("Error parseando hábitos:", err);
      }
    }
  }
  

  deberiaMostrarHabito(habito: any): boolean {
    const currentDate = this.dateSelect.clone().date(this.selectedDayValue);
    const diaSemana = currentDate.format('dddd'); // "Lunes", etc.
    const diaMes = currentDate.date(); // 1, 2, ..., 31

    switch (habito.tipo) {
      case 'todos':
        return true;
      case 'semana':
        return habito.dias.includes(diaSemana);
      case 'mes':
        return habito.dias.includes(diaMes);
      default:
        return false;
    }
  }
}
