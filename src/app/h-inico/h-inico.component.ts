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

// ... (tus imports siguen igual)

@Component({
  selector: 'app-h-inico',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './h-inico.component.html',
  styleUrls: ['./h-inico.component.css']
})
export class HInicoComponent implements OnInit {
  week: string[] = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  monthSelect: DayObject[] = [];
  dateSelect!: Moment;
  today: Moment = moment();
  selectedDayValue: number = this.today.date();
  isDropdownOpen = false;
  habitos: any[] = [];
  habitosFiltrados: any[] = [];
  fabOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    moment.locale('es');
    this.getDaysFromDate(this.today.month() + 1, this.today.year());
    this.cargarHabitos(); // 🔧 MODIFICADO
  }

  agregarHabito(nuevoHabito: any): void {
    console.log('Nuevo hábito recibido:', nuevoHabito);
  
    let habitosGuardados = JSON.parse(localStorage.getItem('habito') || '[]');
    
    const index = habitosGuardados.findIndex((habito: any) => habito.nombre === nuevoHabito.nombre && habito.fecha === nuevoHabito.fecha);
    
    if (index === -1) {
      habitosGuardados.push(nuevoHabito);
    } else {
      console.log("El hábito ya existe y no se sobrescribirá.");
    }

    localStorage.setItem('habito', JSON.stringify(habitosGuardados));
    console.log('Hábitos guardados:', JSON.parse(localStorage.getItem('habito') || '[]'));
  }

  // 🔧 MODIFICADO: Se añadió carga de hábitos diarios tipo "todos"
  cargarHabitos(): void {
    this.habitos = [];

    // Cargar hábitos globales
    const data = localStorage.getItem('habito');
    if (data) {
      try {
        const todosHabitos = JSON.parse(data);
        if (Array.isArray(todosHabitos)) {
          this.habitos = [...todosHabitos];
        }
      } catch (err) {
        console.error("Error parseando hábitos globales:", err);
      }
    }

    // Cargar hábitos por día (tipo "todos")
    for (let i = 1; i <= 31; i++) {
      const dia = String(i).padStart(2, '0');
      const clave = `${this.dateSelect.format('YYYY-MM')}-${dia}`;
      const dataDia = localStorage.getItem(clave);
      if (dataDia) {
        try {
          const habitosDelDia = JSON.parse(dataDia);
          if (Array.isArray(habitosDelDia)) {
            this.habitos = [...this.habitos, ...habitosDelDia];
          }
        } catch (err) {
          console.error(`Error al leer hábitos para ${clave}:`, err);
        }
      }
    }

    this.filtrarHabitosPorDia();
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

  // 🔧 MODIFICADO: Se llama a cargarHabitos al cambiar el mes
  changeMonth(flag: number): void {
    const referenceDate = flag < 0
      ? this.dateSelect.clone().subtract(1, 'month')
      : this.dateSelect.clone().add(1, 'month');

    this.getDaysFromDate(
      parseInt(referenceDate.format('MM'), 10),
      parseInt(referenceDate.format('YYYY'), 10)
    );

    this.cargarHabitos(); // <- añadido
  }

  clickDay(day: DayObject): void {
    this.selectedDayValue = day.value;
    const formattedDay = String(day.value).padStart(2, '0');
    const fecha = `${this.dateSelect.format('YYYY-MM')}-${formattedDay}`;

    console.log('🖱 Día seleccionado:', day.name, '| Fecha:', fecha);
    localStorage.setItem('fechaSeleccionada', fecha);
    this.filtrarHabitosPorDia();
  }

  isSidebarVisible = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  filtrarHabitosPorDia(): void {
    this.habitosFiltrados = this.habitos.filter(h => this.deberiaMostrarHabito(h));
  }

  deberiaMostrarHabito(habito: any): boolean {
    const diaSeleccionado = this.selectedDayValue;
    const currentDate = moment(`${this.dateSelect.format('YYYY-MM')}-${String(diaSeleccionado).padStart(2, '0')}`);
    const diaSemana = currentDate.format('dddd');
    const diaMes = currentDate.date();

    const normalizar = (texto: string): string => {
      return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
    };

    const diaSemanaNormalizado = normalizar(diaSemana);

    if (habito.tipo === 'todos') {
      return true;
    }

    if (habito.tipo === 'semana') {
      const diasSemanaNormalizados = (habito.dias as string[]).map(normalizar);
      return diasSemanaNormalizados.includes(diaSemanaNormalizado);
    }

    if (habito.tipo === 'mes') {
      return (habito.dias as number[]).includes(diaMes);
    }

    return false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

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
}
