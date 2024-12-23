export interface IPropertyBase {
  id: number;
  sellRent: number;
  name: string;
  type: string;
  furnishingType: string;
  cost: number;
  bhk: number;
  builtArea: number;
  city: string;
  readyToMove: boolean;
  image?: string;
  photos?: string[];
  model?: string;
  texture?: string;
  estPossessionOn?: string;
  description?: string;
}

export class PropertyBase implements IPropertyBase {
  id: number;
  sellRent: number;
  name: string;
  type: string;
  furnishingType: string;
  cost: number;
  bhk: number;
  description?: string | undefined;
  builtArea: number;
  city: string;
  readyToMove: boolean;
  image?: string;
  model?: string;
  texture?: string;
  photos?: string[] | undefined;
  estPossessionOn?: string;
  constructor(
    id = 0,
    sellRent = 1000,
    name = '',
    type = '',
    furnishingType = '',
    cost = 1000,
    bhk = 1000,
    builtArea = 1,
    city = 'Pretoria',
    readyToMove = true,
    image = '',
    description = '',
    photos: string[] = [],
    model: string = '',
    texture: string = ''
  ) {
    this.id = id;
    this.description = description;
    this.sellRent = sellRent;
    this.name = name;
    this.type = type;
    this.furnishingType = furnishingType;
    this.cost = cost;
    this.bhk = bhk;
    this.builtArea = builtArea;
    this.city = city;
    this.readyToMove = readyToMove;
    this.image = image;
    this.photos = photos;
    this.model = model;
    this.texture = texture;
  }
}
