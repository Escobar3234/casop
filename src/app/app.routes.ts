import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; 
import { OpcionesComponent } from './opciones/opciones.component';
import { HInicoComponent } from './h-inico/h-inico.component';
import { NotasComponent } from './notas/notas.component';
import { HabitosComponent } from './habitos/habitos.component';
import { FrecuenciaComponent } from './frecuencia/frecuencia.component';


export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'opciones', component: OpcionesComponent },
  {path: 'h-inico', component: HInicoComponent},
  { path: 'notas/:fecha', component: NotasComponent },
  { path : 'habitos/:fecha', component: HabitosComponent },
  { path: 'frecuencia', component: FrecuenciaComponent },

];
