import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { JournalComponent } from './journal/journal.component';

import { ProductProvidingService } from "./_service/product-providing.service";
import { StorageJournalService } from "./_service/storage-journal.service";
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    JournalComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    ProductProvidingService,
    StorageJournalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
