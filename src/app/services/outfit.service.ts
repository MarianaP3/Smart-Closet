import { Injectable, inject, signal } from '@angular/core';
import { Outfit } from '../interfaces/outfit.interface';
import { Garment } from '../interfaces/garment.interface';
import { GarmentService } from './garment.service';

const INITIAL_OUTFITS: Outfit[] = [
  {
    id: '1',
    name: 'Brunch en la ciudad',
    style: 'Casual chic',
    occasion: 'Día',
    garmentIds: ['2', '8', '9', '16'],
  },
  {
    id: '2',
    name: 'Noche boho',
    style: 'Bohemio',
    occasion: 'Noche',
    garmentIds: ['4', '7', '11', '13'],
  },
  {
    id: '3',
    name: 'Office minimal',
    style: 'Minimalista',
    occasion: 'Trabajo',
    garmentIds: ['3', '5', '9'],
  },
  {
    id: '4',
    name: 'Country western',
    style: 'Western',
    occasion: 'Fin de semana',
    garmentIds: ['1', '6', '12', '15'],
  },
  {
    id: '5',
    name: 'Street cool',
    style: 'Urbano',
    occasion: 'Casual',
    garmentIds: ['2', '6', '9', '14'],
  },
  {
    id: '6',
    name: 'Elegancia dorada',
    style: 'Elegante',
    occasion: 'Evento',
    garmentIds: ['4', '7', '11', '14', '16'],
  },
];

@Injectable({ 
  providedIn: 'root' 
})

export class OutfitService {
  constructor() { }
  private garmentService = inject(GarmentService);
  private outfits = signal<Outfit[]>(INITIAL_OUTFITS);

  readonly allOutfits = this.outfits.asReadonly();

  getById(id: string): Outfit | undefined {
    return this.outfits().find((outfit) => outfit.id === id);
  }

  getGarmentsForOutfit(outfit: Outfit): Garment[] {
    return outfit.garmentIds
      .map((id) => this.garmentService.getById(id))
      .filter((garment): garment is Garment => garment !== undefined);
  }

  addOutfit(outfit: Omit<Outfit, 'id'>): void {
    const nextId = String(
      Math.max(0, ...this.outfits().map((item) => Number(item.id))) + 1,
    );

    this.outfits.update((outfits) => [...outfits, { id: nextId, ...outfit }]);
  }

  updateOutfit(id: string, changes: Omit<Outfit, 'id'>): void {
    this.outfits.update((outfits) =>
      outfits.map((outfit) =>
        outfit.id === id ? { id, ...changes } : outfit,
      ),
    );
  }

  deleteOutfit(id: string): void {
    this.outfits.update((outfits) =>
      outfits.filter((outfit) => outfit.id !== id),
    );
  }
}
