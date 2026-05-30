import { Injectable, signal } from '@angular/core';
import { Garment } from '../interfaces/garment.interface';

const INITIAL_GARMENTS: Garment[] = [
  {
    id: '1',
    name: 'Top de colores',
    type: 'Tops',
    color: 'Multicolor',
    size: 'M',
    image: 'https://i.pinimg.com/736x/17/6f/56/176f568124206ddfb072401fd542e6bc.jpg',
  },
  {
    id: '2',
    name: 'Top de rayas',
    type: 'Tops',
    color: 'Rosa',
    size: 'S',
    image: 'https://i.pinimg.com/736x/de/0b/de/de0bde6e33692aed2693f2b67b2ebf78.jpg',
  },
  {
    id: '3',
    name: 'Top de mezclilla',
    type: 'Tops',
    color: 'Azul',
    size: 'S',
    image: 'https://i.pinimg.com/736x/66/7a/43/667a435c4a5b9199f27f8dbdb36ab117.jpg',
  },
  {
    id: '4',
    name: 'Top tejido',
    type: 'Tops',
    color: 'Blanco',
    size: 'M',
    image: 'https://i.pinimg.com/736x/ff/61/00/ff61001770b1fe818e1d7454c5d6efb9.jpg',
  },
  {
    id: '5',
    name: 'Pantalón wide',
    type: 'Bottoms',
    color: 'Blanco',
    size: 'S',
    image: 'https://i.pinimg.com/736x/3e/e8/7a/3ee87a4e8a8dbdc701f295abc8ccc475.jpg',
  },
  {
    id: '6',
    name: 'Jeans wide',
    type: 'Bottoms',
    color: 'Azul',
    size: '22',
    image: 'https://i.pinimg.com/736x/cd/fc/2e/cdfc2e33fa4c604f12c3181e7b63c188.jpg',
  },
  {
    id: '7',
    name: 'Falda larga',
    type: 'Bottoms',
    color: 'Rosa',
    size: 'XS',
    image: 'https://i.pinimg.com/736x/82/2a/86/822a863f0f7447b6eb285d06c98a706c.jpg',
  },
  {
    id: '8',
    name: 'Shorts',
    type: 'Bottoms',
    color: 'Blanco',
    size: '22',
    image: 'https://i.pinimg.com/736x/e4/d5/4d/e4d54d29992ae5d707a6f564ee0eb850.jpg',
  },
  {
    id: '9',
    name: 'Sneakers',
    type: 'Shoes',
    color: 'Blanco',
    size: '24',
    image: 'https://i.pinimg.com/736x/4d/cf/d7/4dcfd7e959ef3c11dd1976710b510346.jpg',
  },
  {
    id: '10',
    name: 'Sandalias altas',
    type: 'Shoes',
    color: 'Café',
    size: '26',
    image: 'https://i.pinimg.com/736x/4e/23/8c/4e238c3c45577536e338e8558a0ec7e8.jpg',
  },
  {
    id: '11',
    name: 'Balerinas',
    type: 'Shoes',
    color: 'Dorado',
    size: '24',
    image: 'https://i.pinimg.com/736x/29/0c/82/290c82cb0e5b94aec80be0d11bb6c5e5.jpg',
  },
  {
    id: '12',
    name: 'Cowboy boots',
    type: 'Shoes',
    color: 'Café',
    size: '24',
    image: 'https://i.pinimg.com/736x/8f/49/c0/8f49c04ed4726423857e22ccda3bf033.jpg',
  },
  {
    id: '13',
    name: 'Collar largo',
    type: 'Accessories',
    color: 'Café',
    size: 'Única',
    image: 'https://i.pinimg.com/736x/fa/12/65/fa12651fd58143ce8ce1da87ace73a85.jpg',
  },
  {
    id: '14',
    name: 'Diadema',
    type: 'Accessories',
    color: 'Dorado',
    size: 'Única',
    image: 'https://i.pinimg.com/736x/0f/31/11/0f3111945101ffe3324ff3f2870c94d0.jpg',
  },
  {
    id: '15',
    name: 'Mesh hat',
    type: 'Accessories',
    color: 'Blanco',
    size: 'Única',
    image: 'https://i.pinimg.com/736x/4f/9f/a9/4f9fa9ebc45c5fafb232ee924df98cde.jpg',
  },
  {
    id: '16',
    name: 'Bolso',
    type: 'Accessories',
    color: 'Verde',
    size: 'Única',
    image: 'https://i.pinimg.com/736x/0e/cc/a3/0ecca35aa7808e2ca17605afbd586ff5.jpg',
  },
];

@Injectable({ 
  providedIn: 'root' 
})

export class GarmentService {

  constructor() { }
  
  private garments = signal<Garment[]>(INITIAL_GARMENTS);

  readonly allGarments = this.garments.asReadonly();

  getById(id: string): Garment | undefined {
    return this.garments().find((garment) => garment.id === id);
  }

  updateGarment(id: string, changes: Omit<Garment, 'id'>): void {
    this.garments.update((garments) =>
      garments.map((garment) =>
        garment.id === id ? { id, ...changes } : garment,
      ),
    );
  }

    deleteGarment(id: string): void {
    this.garments.update((garments) =>
      garments.filter((garment) => garment.id !== id),
    );
  }
}
