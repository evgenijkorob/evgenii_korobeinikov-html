import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageJournalService } from '../_service/storage-journal.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IStorageJournalRecord } from '../_model/stor-journal-rec';

enum SortBy {
  Tag,
  Name,
  Price,
  Amount
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
  public isDescendingSort: boolean;
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
          this.sort(this.sortingBy, this.isDescendingSort);
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

  sort(by: SortBy, isDescending?: boolean): void {
    this._resolveSortWay(by, isDescending);
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
      if (this.isDescendingSort) {
        result *= -1;
      }
      return result;
    });
  }

  private _resolveSortWay(by: SortBy, isDescending?: boolean): void {
    if (this.isDescendingSort === undefined || by !== this.sortingBy) {
      this.isDescendingSort = true;
    }
    else if (isDescending === undefined) {
      this.isDescendingSort = !this.isDescendingSort;
    }
    this.sortingBy = by;
  }

}
