import { Component, OnInit } from '@angular/core';
import { StorageJournalService } from '../_service/storage-journal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IStorageJournalRecord } from '../_model/stor-journal-rec';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent implements OnInit {

  public record: IStorageJournalRecord;

  constructor(
    private _journal: StorageJournalService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    let id: string = this._activatedRoute.snapshot.params['id'];
    this.record = this._journal.getRecord(id);
    if (!this.record) {
      this._router.navigate(['/']);
    }
  }

}
