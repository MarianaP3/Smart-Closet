import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { GarmentService } from '../../../services/garment.service';
import { OutfitService } from '../../../services/outfit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-outfits-gallery-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './outfits-page.component.html',
  styleUrl: './outfits-page.component.css',
})
export class OutfitsGalleryPageComponent implements OnInit {
  private outfitService = inject(OutfitService);
  private garmentService = inject(GarmentService);
  private authService = inject(AuthService);

  public outfits = this.outfitService.allOutfits;
  public isLoading = signal(true);
  public errorMessage = signal('');

  public filterName = signal('');
  public filterStyle = signal('');
  public filterOccasion = signal('');

  public styles = computed(() =>
    [...new Set(this.outfits().map((outfit) => outfit.style))].sort(),
  );

  public occasions = computed(() =>
    [...new Set(this.outfits().map((outfit) => outfit.occasion))].sort(),
  );

  public filteredOutfits = computed(() =>
    this.outfits()
      .filter((outfit) => {
        const name = this.filterName().trim().toLowerCase();
        if (name && !outfit.name.toLowerCase().includes(name)) return false;
        if (this.filterStyle() && outfit.style !== this.filterStyle())
          return false;
        if (this.filterOccasion() && outfit.occasion !== this.filterOccasion())
          return false;
        return true;
      })
      .map((outfit) => ({
        ...outfit,
        garments: this.outfitService.getGarmentsForOutfit(outfit),
      })),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.garmentService.loadGarments().subscribe({
      next: () => {
        this.outfitService.loadOutfits().subscribe({
          next: () => this.isLoading.set(false),
          error: (error) => {
            this.isLoading.set(false);
            this.errorMessage.set(this.getErrorMessage(error));
          },
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  updateFilterName(event: Event): void {
    this.filterName.set((event.target as HTMLInputElement).value);
  }

  updateFilterStyle(event: Event): void {
    this.filterStyle.set((event.target as HTMLSelectElement).value);
  }

  updateFilterOccasion(event: Event): void {
    this.filterOccasion.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterName.set('');
    this.filterStyle.set('');
    this.filterOccasion.set('');
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.error?.msg ?? 'No se pudo cargar tus outfits.';
  }
}
