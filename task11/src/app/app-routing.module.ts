import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalComponent } from "./journal/journal.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RecordDetailsComponent } from './record-details/record-details.component';
import { RecordDialogComponent } from './record-dialog/record-dialog.component';

const dialogs: Routes = [
  { path: 'edit/:id', component: RecordDialogComponent },
  { path: 'add', component: RecordDialogComponent }
];

const routes: Routes = [
  { path: '', component: JournalComponent, children: dialogs },
  { path: 'view/:id', component: RecordDetailsComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
