import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; // asegúrate que la ruta esté bien

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent }
];
