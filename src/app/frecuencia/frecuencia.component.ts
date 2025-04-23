import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Habito {
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  dias: (string | number)[];
}

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

    const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || new Date().toISOString().split('T')[0];

    let dias: (string | number)[] = [];

    if (this.frecuencia.tipo === 'todos') {
      dias = this.diasDelMes;
    } else if (this.frecuencia.tipo === 'semana') {
      dias = this.frecuencia.diasSemana;
    } else if (this.frecuencia.tipo === 'mes') {
      dias = this.frecuencia.diasMes;
    }

    const nuevoHabito: Habito = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      fecha: fechaSeleccionada,
      tipo: this.frecuencia.tipo,
      dias: dias
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      let habitos: Habito[] = JSON.parse(localStorage.getItem('habito') || '[]');
      if (!Array.isArray(habitos)) {
        habitos = [];
      }

      const yaExiste = habitos.some((h: Habito) => {
        if (Array.isArray(h.dias) && Array.isArray(nuevoHabito.dias)) {
          return h.nombre === nuevoHabito.nombre && h.fecha === nuevoHabito.fecha &&
            h.tipo === nuevoHabito.tipo &&
            h.dias.every((d: string | number) => (nuevoHabito.dias as (string | number)[]).includes(d));
        }
        return false;
      });

      if (!yaExiste) {
        if (this.frecuencia.tipo === 'todos') {
          this.diasDelMes.forEach((dia) => {
            const fechaHabito = `${fechaSeleccionada}-${String(dia).padStart(2, '0')}`;
            if (!habitos.some(h => h.fecha === fechaHabito && h.nombre === nuevoHabito.nombre)) {
              habitos.push({ ...nuevoHabito, fecha: fechaHabito });
            }
          });
        } else {
          habitos.push(nuevoHabito);
        }

        localStorage.setItem('habito', JSON.stringify(habitos));
        console.log("Hábito guardado:", nuevoHabito);
      } else {
        console.warn("Este hábito ya existe y no será duplicado.");
      }

      this.router.navigate(['/h-inico']);
    } else {
      console.error("localStorage no está disponible.");
    }
  }
}
