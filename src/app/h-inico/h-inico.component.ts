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
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  monthSelect: DayObject[] = [];
  dateSelect!: Moment;
  today: Moment = moment();
  selectedDayValue: number = this.today.date();
  isDropdownOpen = false;
  habitos: any[] = [];
  habitosFiltrados: any[] = []; // Agregado para filtrar los hábitos
  fabOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    moment.locale('es');
    this.getDaysFromDate(this.today.month() + 1, this.today.year());
    this.cargarHabitos();
  }

  agregarHabito(nuevoHabito: any): void {
    let habitosGuardados = JSON.parse(localStorage.getItem('habito') || '[]');
  
    // Verificar si el hábito ya existe
    const index = habitosGuardados.findIndex((habito: any) => habito.nombre === nuevoHabito.nombre && habito.fecha === nuevoHabito.fecha);
  
    if (index === -1) {
      // Si el hábito no existe, agregarlo a la lista
      habitosGuardados.push(nuevoHabito);
    } else {
      // Si el hábito ya existe, se puede actualizar si lo deseas o simplemente ignorarlo
      console.log("El hábito ya existe y no se sobrescribirá.");
    }
  
    // Guardamos la lista de hábitos en el localStorage
    localStorage.setItem('habito', JSON.stringify(habitosGuardados));
  
    // Verificar lo que se ha guardado
    console.log('Hábitos guardados:', JSON.parse(localStorage.getItem('habito') || '[]'));
  }

  cargarHabitos(): void {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('habito');
      if (data) {
        try {
          const todosHabitos = JSON.parse(data);
          console.log('Hábitos cargados:', todosHabitos);
          this.habitos = Array.isArray(todosHabitos) ? todosHabitos : [];
          this.filtrarHabitosPorDia(); // Filtrar los hábitos después de cargarlos
        } catch (err) {
          console.error("Error parseando hábitos:", err);
        }
      }
    }
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

    console.log('🖱 Día seleccionado:', day.name, '| Fecha:', fecha);
    localStorage.setItem('fechaSeleccionada', fecha);
    this.filtrarHabitosPorDia(); // Filtrar los hábitos cuando se selecciona un día
  }

  filtrarHabitosPorDia(): void {
    this.habitosFiltrados = this.habitos.filter(h => this.deberiaMostrarHabito(h));
  }

  deberiaMostrarHabito(habito: any): boolean {
    const dia = String(this.selectedDayValue).padStart(2, '0');
    const currentDate = moment(`${this.dateSelect.format('YYYY-MM')}-${dia}`);
    const diaSemana = currentDate.clone().locale('es').format('dddd');
    const diaMes = currentDate.date();
  
    // Normalizar el nombre del día de la semana
    const normalizar = (texto: string): string => {
      return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
    };
  
    const diaSemanaNormalizado = normalizar(diaSemana);
  
    // Verificar los días guardados
    console.log('🧠 Día de la semana actual:', diaSemanaNormalizado);
    console.log('🔍 Días del hábito:', habito.dias);
  
    // Si el hábito es para todos los días
    if (habito.tipo === 'todos') {
      return true;
    }
  
    // Si el hábito es semanal
    if (habito.tipo === 'semana') {
      const diasSemanaNormalizados = (habito.dias as string[]).map(normalizar);
      return diasSemanaNormalizados.includes(diaSemanaNormalizado);
    }
  
    // Si el hábito es mensual
    if (habito.tipo === 'mes') {
      console.log('🔍 Comprobando si el día seleccionado está en los días del hábito (mes):', habito.dias);
      return (habito.dias as number[]).includes(diaMes); // Asegúrate de que el día del mes se compara correctamente
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

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
