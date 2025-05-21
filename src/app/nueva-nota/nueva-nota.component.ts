import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Importa FormsModule

@Component({
  selector: 'app-nueva-nota',
  standalone: true,
  imports: [CommonModule, FormsModule],  // <-- Agrega FormsModule aquí
  templateUrl: './nueva-nota.component.html',
  styleUrls: ['./nueva-nota.component.css']
})
export class NuevaNotaComponent {
  titulo: string = '';
  contenido: string = '';
  categoria: string = 'Trabajos';
  color: string = '#ffffff';

  constructor(private router: Router) {}

  guardarNota() {
    const nuevaNota = {
      titulo: this.titulo,
      contenido: this.contenido,
      categoria: this.categoria,
      fecha: new Date().toLocaleDateString(),
      color: this.color
    };

    const notas = JSON.parse(localStorage.getItem('notas') || '[]');
    notas.push(nuevaNota);
    localStorage.setItem('notas', JSON.stringify(notas));

    this.router.navigate(['/notas-vista']);
  }
}
