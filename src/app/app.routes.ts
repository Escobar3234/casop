import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; 
import { OpcionesComponent } from './opciones/opciones.component';
import { HInicoComponent } from './h-inico/h-inico.component';
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'opciones', component: OpcionesComponent },
  {path: 'h-inico', component: HInicoComponent}

];
