import { Injectable } from '@angular/core';
import { IProduct } from "../_model/product";
import { StorageJournal } from "../_model/journal";

@Injectable({
  providedIn: 'root'
})
export class ProductProvidingService {

  constructor() {
    this._generate();
  }

  public fetchDataToJournal(journal: StorageJournal): void {
    let data: IProduct[] = this._generate();
    data.forEach(elem => journal.addProduct(elem));
  }

  private _generate(): IProduct[] {
    let result: IProduct[] = [];
    for (let i = 1; i <= 10; i++) {
      let elem: IProduct = {
        tag: Math.floor(Math.random() * 1000000),
        name: `Name${i}`,
        amount: i,
        price: i * 10
      };
      result.push(elem);
    }
    return result;
  }
}
