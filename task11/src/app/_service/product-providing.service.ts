import { Injectable } from '@angular/core';
import { IProduct } from "../_model/product";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

export interface IServerResponse {
  productList: IProduct[]
};

@Injectable({
  providedIn: 'root'
})
export class ProductProvidingService {

  constructor(
    private _http: HttpClient
  ) {}

  public fetchData(): Promise<IProduct[]> {
    return this._http
      .get('assets/products.json')
      .pipe(map((data: IServerResponse) => {
        return data.productList;
      }))
      .toPromise();
  }

}
