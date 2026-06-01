import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Outfit } from '../interfaces/outfit.interface';
import { Garment } from '../interfaces/garment.interface';
import { GarmentService } from './garment.service';

@Injectable({
  providedIn: 'root',
})
export class OutfitService {
  private apiUrl = 'http://localhost:8080/api/outfits';
  private garmentService = inject(GarmentService);
  private outfits = signal<Outfit[]>([]);

  readonly allOutfits = this.outfits.asReadonly();

  constructor(private http: HttpClient) {}

  loadOutfits(): Observable<Outfit[]> {
    return this.http.get<Outfit[]>(this.apiUrl).pipe(
      tap((outfits) => this.outfits.set(outfits)),
    );
  }

  getById(id: string): Outfit | undefined {
    return this.outfits().find((outfit) => outfit.id === id);
  }

  getByIdFromApi(id: string): Observable<Outfit> {
    return this.http.get<Outfit>(`${this.apiUrl}/${id}`).pipe(
      tap((outfit) => {
        const exists = this.outfits().some((item) => item.id === outfit.id);

        if (exists) {
          this.outfits.update((items) =>
            items.map((item) => (item.id === outfit.id ? outfit : item)),
          );
        } else {
          this.outfits.update((items) => [...items, outfit]);
        }
      }),
    );
  }

  getGarmentsForOutfit(outfit: Outfit): Garment[] {
    return outfit.garmentIds
      .map((id) => this.garmentService.getById(id))
      .filter((garment): garment is Garment => garment !== undefined);
  }

  addOutfit(outfit: Omit<Outfit, 'id'>): Observable<Outfit> {
    return this.http.post<Outfit>(this.apiUrl, outfit).pipe(
      tap((created) =>
        this.outfits.update((outfits) => [...outfits, created]),
      ),
    );
  }

  updateOutfit(
    id: string,
    changes: Omit<Outfit, 'id'>,
  ): Observable<Outfit> {
    return this.http.put<Outfit>(`${this.apiUrl}/${id}`, changes).pipe(
      tap((updated) =>
        this.outfits.update((outfits) =>
          outfits.map((outfit) => (outfit.id === id ? updated : outfit)),
        ),
      ),
    );
  }

  deleteOutfit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.outfits.update((outfits) =>
          outfits.filter((outfit) => outfit.id !== id),
        ),
      ),
    );
  }

  clearOutfits(): void {
    this.outfits.set([]);
  }
}
