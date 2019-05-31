import { Component, OnInit } from '@angular/core';
import { StorageJournalService } from '../_service/storage-journal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../_model/product';

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrls: ['./record-dialog.component.scss']
})
export class RecordDialogComponent implements OnInit {

  public product: IProduct = {
    tag: null,
    name: null,
    price: null,
    amount: null
  };
  public title: string;

  private _purpose: string;
  private _id: string;

  constructor(
    private _journal: StorageJournalService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._purpose = this._activatedRoute.snapshot.url[0].path;
    switch(this._purpose) {
      case 'add':
        this.title = 'New Record';
        break;
      case 'edit':
        this._id = this._activatedRoute.snapshot.params['id'];
        let record = this._journal.getRecord(this._id);
        if (record) {
          this.product = record.product;
          this.title = 'Edit Record';
          break;
        }
      default:
        this._router.navigate(['/']);
    }
  }

  public accept(): void {
    switch(this._purpose) {
      case 'add':
        console.log(this.product);
        this._journal.addProduct(this.product);
        break;
      case 'edit':
        this._journal.editRecord(this._id, this.product);
        break;
    }
    this._router.navigate(['/']);
  }

}
