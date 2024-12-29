import { IPropertyBase } from './ipropertybase';

export class Property implements IPropertyBase {
  model?: string | undefined;
  texture?: string | undefined;
  likes: number = 0;
  id: number = 0;
  sellRent: number = 0;
  name: string = '';
  propertyTypeId: number = 0;
  type: string = '';
  bhk: number = 0;
  furnishingTypeId: number = 0;
  furnishingType: string = '';
  cost: number = 0;
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
  image?: string = '';
  description?: string = '';
  photos?: string[];
}
