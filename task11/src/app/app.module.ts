import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { JournalComponent } from './journal/journal.component';

import { ProductProvidingService } from "./_service/product-providing.service";
import { StorageJournalService } from "./_service/storage-journal.service";
import { NotFoundComponent } from './not-found/not-found.component';
import { RecordDetailsComponent } from './record-details/record-details.component';
import { RecordDialogComponent } from './record-dialog/record-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    JournalComponent,
    NotFoundComponent,
    RecordDetailsComponent,
    RecordDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ProductProvidingService,
    StorageJournalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
