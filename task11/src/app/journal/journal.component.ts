import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageJournalService, IStorageJournalRecord } from '../_service/storage-journal.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class JournalComponent implements OnInit, OnDestroy {

  public records: IStorageJournalRecord[];
  public readonly SortBy = SortBy;
  public sortingBy: SortBy;
  public readonly SortType = SortType;
  public sortingType: SortType;
  public selectedRecordId: string;

  private _dataChangeSub: Subscription;

  constructor(
    private _journal: StorageJournalService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._dataChangeSub = this._journal.dataChangeWatcher
      .subscribe((records: IStorageJournalRecord[]) => {
        this.records = records;
        if (this.records && this.sortingBy !== undefined) {
          this.sort(this.sortingBy, this.sortingType);
        }
      });
  }

  ngOnDestroy() {
    this._dataChangeSub.unsubscribe();
  }

  select(id: string) {
    this.selectedRecordId = id;
  }

  editRecord(id: string) {
    this._router.navigate(['/edit', id]);
  }

  addRecord() {
    this._router.navigate(['/add']);
  }

  goToRecordPage(id: string) {
    this._router.navigate(['/view', id]);
  }

  delete(id: string): void {
    this._journal.removeProduct(id);
  }

  sort(by: SortBy, type?: SortType): void {
    this._resolveSortWay(by, type);
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

  private _resolveSortWay(by: SortBy, type?: SortType): void {
    if (!this.sortingType || by !== this.sortingBy) {
      this.sortingType = this.SortType.Descending;
    }
    else if (!type) {
      this.sortingType *= -1;
    }
    this.sortingBy = by;
  }

}
