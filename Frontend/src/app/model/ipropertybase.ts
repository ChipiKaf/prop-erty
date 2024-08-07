export interface IPropertyBase {
  id: number;
  sellRent: number;
  name: string;
  propertyType: string;
  furnishingType: string;
  price: number;
  bhk: number;
  builtArea: number;
  city: string;
  readyToMove: boolean;
  photo?: string;
  photos?: string[];
  estPossessionOn?: string;
  description?: string;
}

export class PropertyBase implements IPropertyBase {
  id: number;
  sellRent: number;
  name: string;
  propertyType: string;
  furnishingType: string;
  price: number;
  bhk: number;
  description?: string | undefined;
  builtArea: number;
  city: string;
  readyToMove: boolean;
  photo?: string;
  photos?: string[] | undefined;
  estPossessionOn?: string;
  constructor(
    id = 0,
    sellRent = 1000,
    name = '',
    propertyType = '',
    furnishingType = '',
    price = 1000,
    bhk = 1000,
    builtArea = 1,
    city = 'Pretoria',
    readyToMove = true,
    photo = '',
    description = '',
    photos: string[] = []
  ) {
    this.id = id;
    this.description = description;
    this.sellRent = sellRent;
    this.name = name;
    this.propertyType = propertyType;
    this.furnishingType = furnishingType;
    this.price = price;
    this.bhk = bhk;
    this.builtArea = builtArea;
    this.city = city;
    this.readyToMove = readyToMove;
    this.photo = photo;
    this.photos = photos;
  }
}
