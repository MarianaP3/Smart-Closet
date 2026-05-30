import { Injectable, inject, signal } from '@angular/core';
import { Wardrobe } from '../interfaces/wardrobe.interface';
import { Garment } from '../interfaces/garment.interface';
import { GarmentService } from './garment.service';

const INITIAL_WARDROBES: Wardrobe[] = [
  {
    id: '1',
    name: 'Closet principal',
    location: 'Recámara',
    description: 'Prendas que uso a diario',
    garmentIds: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
  {
    id: '2',
    name: 'Calzado y accesorios',
    location: 'Entrada',
    description: 'Zapatos, bolsos y complementos',
    garmentIds: ['9', '10', '11', '12', '13', '14', '15', '16'],
  },
];

@Injectable({ 
  providedIn: 'root' 
})
export class WardrobeService {
  constructor() { }
  private garmentService = inject(GarmentService);
  private wardrobes = signal<Wardrobe[]>(INITIAL_WARDROBES);

  readonly allWardrobes = this.wardrobes.asReadonly();

  getById(id: string): Wardrobe | undefined {
    return this.wardrobes().find((wardrobe) => wardrobe.id === id);
  }

  getGarmentsForWardrobe(wardrobe: Wardrobe): Garment[] {
    return wardrobe.garmentIds
      .map((id) => this.garmentService.getById(id))
      .filter((garment): garment is Garment => garment !== undefined);
  }

  addWardrobe(wardrobe: Omit<Wardrobe, 'id'>): void {
    const nextId = String(
      Math.max(0, ...this.wardrobes().map((item) => Number(item.id))) + 1,
    );

    this.wardrobes.update((wardrobes) => [
      ...wardrobes,
      { id: nextId, ...wardrobe },
    ]);
  }

  deleteWardrobe(id: string): void {
    this.wardrobes.update((wardrobes) =>
      wardrobes.filter((wardrobe) => wardrobe.id !== id),
    );
  }
}
