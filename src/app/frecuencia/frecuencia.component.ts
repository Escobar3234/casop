import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-frecuencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './frecuencia.component.html',
  styleUrls: ['./frecuencia.component.css']
})
export class FrecuenciaComponent {
  nombre: string = '';
  descripcion: string = '';

  frecuencia = {
    tipo: '',
    diasSemana: [] as string[],
    diasMes: [] as number[]
  };

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  diasDelMes: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verifica si el código se está ejecutando en el navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('habito');
      if (data) {
        try {
          const habito = JSON.parse(data);
          this.nombre = habito.nombre;
          this.descripcion = habito.descripcion;
        } catch (err) {
          console.error('Error leyendo el hábito desde localStorage', err);
        }
      }
    }
  }

  toggleDiaSemana(dia: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.frecuencia.diasSemana.push(dia);
    } else {
      this.frecuencia.diasSemana = this.frecuencia.diasSemana.filter(d => d !== dia);
    }
  }

  toggleDiaMes(dia: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.frecuencia.diasMes.push(dia);
    } else {
      this.frecuencia.diasMes = this.frecuencia.diasMes.filter(d => d !== dia);
    }
  }

  guardarHabito() {
    if (!this.nombre || this.nombre.trim() === '') {
      console.warn("El nombre del hábito está vacío.");
      return;
    }
  
    // Asigna correctamente la fecha seleccionada
    const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || new Date().toISOString().split('T')[0];  // Usa la fecha actual si no se encuentra una fecha seleccionada
  
    let dias: string[] | number[] = [];  // Declaración de tipo explícito
  
    if (this.frecuencia.tipo === 'todos') {
      // Si el tipo es 'todos', asignamos todos los días del mes
      dias = this.diasDelMes;
    } else if (this.frecuencia.tipo === 'semana') {
      dias = this.frecuencia.diasSemana;
    } else if (this.frecuencia.tipo === 'mes') {
      dias = this.frecuencia.diasMes;
    }
  
    const nuevoHabito = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      fecha: fechaSeleccionada,  // Asegúrate de que la fecha esté asignada correctamente
      tipo: this.frecuencia.tipo,
      dias: dias
    };
  
    // Verifica si localStorage está disponible antes de usarlo
    if (typeof window !== 'undefined' && window.localStorage) {
      let habitos = JSON.parse(localStorage.getItem('habito') || '[]');
      if (!Array.isArray(habitos)) {
        habitos = [];
      }
  
      // Si el tipo es 'todos', necesitamos guardar el hábito para cada día del mes
      if (this.frecuencia.tipo === 'todos') {
        this.diasDelMes.forEach((dia) => {
          habitos.push({ ...nuevoHabito, fecha: `${fechaSeleccionada}-${String(dia).padStart(2, '0')}` });
        });
      } else {
        habitos.push(nuevoHabito);
      }
  
      localStorage.setItem('habito', JSON.stringify(habitos));
  
      console.log("Hábito guardado:", nuevoHabito);
  
      // Redirigir a 'h-inico' después de guardar el hábito
      this.router.navigate(['/h-inico']);
    } else {
      console.error("localStorage no está disponible.");
    }
  }
  
}
