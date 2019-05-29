import { Injectable } from '@angular/core';
import { IProduct } from "../_model/product";

@Injectable({
  providedIn: 'root'
})
export class ProductProvidingService {

  constructor(
  ) {
    this._generate();
  }

  public fetchData(): IProduct[] {
    let data: IProduct[] = this._generate();
    return data;
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
