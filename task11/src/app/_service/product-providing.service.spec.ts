import { TestBed } from '@angular/core/testing';

import { ProductProvidingService } from './product-providing.service';

describe('ProductProvidingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductProvidingService = TestBed.get(ProductProvidingService);
    expect(service).toBeTruthy();
  });
});
