import { IProduct } from "./product";

export interface IStorageJournalRecord {
  id: string,
  product: IProduct
}

export interface IJournal {
  [id: string]: IStorageJournalRecord
}

export class StorageJournal {
  private _records: IJournal = {};

  public get records() {
    return Object.values(this._records);
  }

  public addProduct(product: IProduct): void {
    let id: string = this._generateId();
    let newRecord: IStorageJournalRecord = {
      id: id,
      product: product
    };
    this._records[id] = newRecord;
  }

  public removeProduct(id: string): void {
    if (this.getRecord(id)!) {
      return;
    }
    delete this._records[id];
  }

  public setProductTag(id: string, tag: number): void {
    if (this.getRecord(id)!) {
      return;
    }
    this._records[id].product.tag = tag;
  }

  public setProductName(id: string, name: string): void {
    if (this.getRecord(id)!) {
      return;
    }
    this._records[id].product.name = name;
  }

  public setProductPrice(id: string, price: number): void {
    if (this.getRecord(id)!) {
      return;
    }
    this._records[id].product.price = price;
  }

  public setProductAmount(id: string, amount: number): void {
    if (this.getRecord(id)!) {
      return;
    }
    this._records[id].product.amount = amount;
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
