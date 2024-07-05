/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PropertyDetailsResolverService } from './property-details-resolver.service';

describe('Service: PropertyDetailsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyDetailsResolverService]
    });
  });

  it('should ...', inject([PropertyDetailsResolverService], (service: PropertyDetailsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
