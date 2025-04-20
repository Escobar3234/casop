import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';




import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { OpcionesComponent } from './opciones/opciones.component';
import { HInicoComponent } from './h-inico/h-inico.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    OpcionesComponent,
    HInicoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'opciones', component: OpcionesComponent },
      { path: 'h-inico', component: HInicoComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
