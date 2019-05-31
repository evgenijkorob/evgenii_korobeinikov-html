import { Injectable } from '@angular/core';
import { IProduct } from '../_model/product';
import { ProductProvidingService } from './product-providing.service';
import { BehaviorSubject } from 'rxjs';

export interface IStorageJournalRecord {
  id: string,
  product: IProduct
}

interface IJournal {
  [id: string]: IStorageJournalRecord
}

@Injectable({
  providedIn: 'root'
})
export class StorageJournalService {

  private _journal: IJournal = null;

  public get records(): IStorageJournalRecord[] {
    try {
      return Object.values(this._journal);
    }
    catch(e) {
      return null;
    }
  }

  private _dataChangeSource: BehaviorSubject<IStorageJournalRecord[]>;

  public get dataChangeWatcher(): BehaviorSubject<IStorageJournalRecord[]> {
    return this._dataChangeSource;
  }

  constructor(private _dataProvider: ProductProvidingService) {
    this._dataChangeSource = new BehaviorSubject(this.records);
    this._fetchData().then(() => this._notifyAboutDataChange());
  }

  public addProduct(product: IProduct): void {
    if (!product) {
      return;
    }
    let id: string = this._generateId(),
        newRecord: IStorageJournalRecord = {
          id: id,
          product: product
        };
    this._journal[id] = newRecord;
    this._notifyAboutDataChange();
  }

  public removeProduct(id: string): void {
    if (!this.getRecord(id)) {
      return;
    }
    delete this._journal[id];
    this._notifyAboutDataChange();
  }

  public editRecord(id: string, prod: IProduct) {
    if (!this.getRecord(id)) {
      return;
    }
    this._journal[id].product = prod;
    this._notifyAboutDataChange();
  }

  public getRecord(id: string): IStorageJournalRecord {
    try {
      return this._journal[id];
    }
    catch (e) {
      return null;
    }
  }

  private _notifyAboutDataChange(): void {
    this._dataChangeSource.next(this.records);
  }

  private _fetchData(): Promise<void> {
    return this._dataProvider
      .fetchData()
      .then(products => {
        this._journal = {};
        products.forEach(prod => this.addProduct(prod));
        return Promise.resolve();
      });
  }

  private _generateId(): string {
    let id: string,
        randNum: number;
    do {
      randNum = Math.floor(Math.random() * 1000000);
      id = String(randNum);
    } while(this.getRecord(id));
    return id;
  }

}
