import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notas-vista',
  standalone: true, // <-- si estás usando componentes standalone
  imports: [CommonModule],
  templateUrl: './notas-vista.component.html',
  styleUrls: ['./notas-vista.component.css']
})
export class NotasVistaComponent {
  categorias: string[] = ['Todos', 'Trabajos', 'Ideas', 'Compras'];
  categoriaSeleccionada: string = 'Todos';

  notas = [
    { titulo: 'Crear una Bomba Nuclear', contenido: 'Lorem ipsum dolor sit amet...', categoria: 'Trabajos', fecha: '10/01/2025', color: '#bbdefb' },
    { titulo: 'Idea 1', contenido: 'Lorem ipsum dolor sit amet...', categoria: 'Ideas', fecha: '10/01/2025', color: '#a5d6a7' },
    { titulo: 'Nota roja', contenido: 'Lorem ipsum dolor sit amet...', categoria: 'Compras', fecha: '10/01/2025', color: '#ef9a9a' },
    { titulo: 'Nota morada', contenido: 'Lorem ipsum dolor sit amet...', categoria: 'Ideas', fecha: '10/01/2025', color: '#ce93d8' },
    { titulo: 'Nota amarilla', contenido: 'Lorem ipsum dolor sit amet...', categoria: 'Compras', fecha: '10/01/2025', color: '#fff59d' },
    { titulo: 'Nota azul', contenido: 'Lorem ipsum dolor sit amet...', categoria: 'Trabajos', fecha: '10/01/2025', color: '#80deea' },
  ];

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
  }

  notasFiltradas() {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.notas;
    }
    return this.notas.filter(n => n.categoria === this.categoriaSeleccionada);
  }

  agregarNota() {
    // Navegar o abrir modal para agregar nota
    console.log('Agregar nota');
  }
}

