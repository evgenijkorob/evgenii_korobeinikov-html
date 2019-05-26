import { Component, OnInit } from '@angular/core';
import { StorageJournal, IStorageJournalRecord } from "../_model/journal";
import { ProductProvidingService } from "../_service/product-providing.service";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  public records: IStorageJournalRecord[];
  private _journal: StorageJournal;

  constructor(
    private _productProvider: ProductProvidingService
  ) { }

  ngOnInit() {
    this._journal = new StorageJournal();
    this._productProvider.fetchDataToJournal(this._journal);
    this.records = this._journal.records;
  }

}
