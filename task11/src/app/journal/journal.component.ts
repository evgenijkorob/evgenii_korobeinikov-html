import { Component, OnInit } from '@angular/core';
import { StorageJournal, IStorageJournalRecord } from "../_model/journal";
import { ProductProvidingService } from "../_service/product-providing.service";

enum SortBy {
  Tag,
  Name,
  Price,
  Amount
};

enum SortType {
  Descending = -1,
  Ascending = 1
};

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  public records: IStorageJournalRecord[];
  public readonly SortBy = SortBy;
  public sortingBy: SortBy;
  public readonly SortType = SortType;
  public sortingType: SortType;
  public selectedRecordId: string;

  private _journal: StorageJournal;

  constructor(
    private _productProvider: ProductProvidingService
  ) { }

  ngOnInit() {
    this._journal = new StorageJournal();
    this._productProvider.fetchDataToJournal(this._journal);
    this.records = this._journal.records;
  }

  select(id: string) {
    this.selectedRecordId = id;
  }

  sort(by: SortBy): void {
    this._resolveSortWay(by);
    this.records = this.records.sort((a, b) => {
      let result: number;
      switch(this.sortingBy) {
        case this.SortBy.Tag:
          result = a.product.tag - b.product.tag;
          break;
        case this.SortBy.Name:
          let collator = Intl.Collator();
          result = collator.compare(a.product.name, b.product.name);
          break;
        case this.SortBy.Price:
          result = a.product.price - b.product.price;
          break;
        case this.SortBy.Amount:
          result = a.product.amount - b.product.amount;
          break;
        default:
          result = 0;
      }
      result *= this.sortingType;
      return result;
    });
  }

  private _resolveSortWay(by: SortBy): void {
    if (!this.sortingType || by !== this.sortingBy) {
      this.sortingType = this.SortType.Descending;
    }
    else {
      this.sortingType *= -1;
    }
    this.sortingBy = by;
  }

}
