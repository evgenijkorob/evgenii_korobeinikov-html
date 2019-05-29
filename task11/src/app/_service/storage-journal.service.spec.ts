import { TestBed } from '@angular/core/testing';

import { StorageJournalService } from './storage-journal.service';

describe('StorageJournalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageJournalService = TestBed.get(StorageJournalService);
    expect(service).toBeTruthy();
  });
});
