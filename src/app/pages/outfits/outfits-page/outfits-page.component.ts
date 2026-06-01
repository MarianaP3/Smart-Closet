import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { OutfitService } from '../../../services/outfit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-outfits-gallery-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './outfits-page.component.html',
  styleUrl: './outfits-page.component.css',
})
export class OutfitsGalleryPageComponent {
  private outfitService = inject(OutfitService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
  }

  public outfits = this.outfitService.allOutfits;

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
}
