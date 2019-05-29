import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalComponent } from "./journal/journal.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  { path: '', component: JournalComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
