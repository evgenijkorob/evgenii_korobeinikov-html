import { Injectable } from '@angular/core';
import { IProduct } from '../_model/product';
import { ProductProvidingService, IServerResponse } from './product-providing.service';

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

  private _records: IJournal = null;

  public get records() {
    return Object.values(this._records);
  }

  constructor(private _dataProvider: ProductProvidingService) {}

  public fetchData(): Promise<void> {
    if (this._records) {
      return Promise.resolve();
    }
    return this._dataProvider
      .fetchData()
      .then(products => {
        this._records = {};
        products.forEach(prod => this.addProduct(prod));
        return Promise.resolve();
      });
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
    this._records[id] = newRecord;
  }

  public removeProduct(id: string): void {
    if (!this.getRecord(id)) {
      return;
    }
    delete this._records[id];
  }

  public editRecord(id: string, prod: IProduct) {
    if (!this.getRecord(id)) {
      return;
    }
    this._records[id].product = prod;
  }

  public getRecord(id: string): IStorageJournalRecord {
    try {
      return this._records[id];
    }
    catch (e) {
      return null;
    }
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
