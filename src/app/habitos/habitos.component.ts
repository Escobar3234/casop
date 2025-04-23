import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- Importa Router

@Component({
  standalone: true,
  imports: [
    FormsModule
  ],
  selector: 'app-habitos',
  templateUrl: './habitos.component.html',
  styleUrls: ['./habitos.component.css']
})
export class HabitosComponent {
  habito = {
    nombre: '',
    descripcion: ''
  };

  constructor(private router: Router) {} // <-- Inyecta el router

  // Método para guardar el hábito en localStorage
  guardarHabito() {
    const habit = {
      nombre: this.habito.nombre,
      descripcion: this.habito.descripcion
    };
    localStorage.setItem('habito', JSON.stringify(habit));

    // Después de guardar, redirige al componente de frecuencia
    this.router.navigate(['/frecuencia']); // <-- Asegúrate de tener esa ruta creada
  }
}
