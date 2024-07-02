import { IPropertyBase } from './ipropertybase';
import { Photo } from './photo';

export class Property implements IPropertyBase {
  id: number = 0;
  sellRent: number = 0;
  name: string = '';
  propertyTypeId: number = 0;
  propertyType: string = '';
  bhk: number = 0;
  furnishingTypeId: number = 0;
  furnishingType: string = '';
  price: number = 0;
  builtArea: number = 0;
  carpetArea?: number = 0;
  address: string = '';
  address2?: string = '';
  CityId: number = 0;
  city: string = '';
  floorNo?: string = '';
  totalFloors?: string = '';
  readyToMove: boolean = false;
  age?: string = '';
  mainEntrance?: string = '';
  security?: number = 0;
  gated?: boolean;
  maintenance?: number = 0;
  estPossessionOn?: string = '';
  photo?: string = '';
  description?: string = '';
  photos?: Photo[];
}
