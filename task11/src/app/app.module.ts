import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProductProvidingService } from "./_service/product-providing.service";
import { JournalComponent } from './journal/journal.component';

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
    ProductProvidingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
