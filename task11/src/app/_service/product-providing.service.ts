import { Injectable } from '@angular/core';
import { IProduct } from "../_model/product";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { IProductAPIResponse } from '../_model/product-api-resp';

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
      .pipe(
        map(this._getProdListFromResp)
      )
      .toPromise();
  }

  private _getProdListFromResp(data: IProductAPIResponse): IProduct[] {
    return data.productList;
  }

}
