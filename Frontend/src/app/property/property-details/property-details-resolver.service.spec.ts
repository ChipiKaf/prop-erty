/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PropertyDetailResolverService } from './property-details-resolver.service';

describe('Service: PropertyDetailsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyDetailResolverService],
    });
  });

  it('should ...', inject(
    [PropertyDetailResolverService],
    (service: PropertyDetailResolverService) => {
      expect(service).toBeTruthy();
    }
  ));
});
