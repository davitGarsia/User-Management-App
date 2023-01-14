import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavFormComponent } from './sidenav-form/sidenav-form.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
