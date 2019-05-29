import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { JournalComponent } from './journal/journal.component';

import { ProductProvidingService } from "./_service/product-providing.service";
import { StorageJournalService } from "./_service/storage-journal.service";


@NgModule({
  declarations: [
    AppComponent,
    JournalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    ProductProvidingService,
    StorageJournalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
