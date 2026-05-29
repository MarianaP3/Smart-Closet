import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../components/garment-card/garment-card.component';
import { WardrobeService } from '../../services/wardrobe.service';

@Component({
  selector: 'app-armarios-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './armarios-page.component.html',
  styleUrl: './armarios-page.component.css',
})
export class ArmariosPageComponent {
  private wardrobeService = inject(WardrobeService);

  public wardrobes = this.wardrobeService.allWardrobes;

  public filterSearch = signal('');
  public filterLocation = signal('');

  public locations = computed(() =>
    [...new Set(this.wardrobes().map((wardrobe) => wardrobe.location))].sort(),
  );

  public filteredWardrobes = computed(() =>
    this.wardrobes()
      .filter((wardrobe) => {
        const search = this.filterSearch().trim().toLowerCase();
        if (search) {
          const matchesName = wardrobe.name.toLowerCase().includes(search);
          const matchesDescription = wardrobe.description
            .toLowerCase()
            .includes(search);
          if (!matchesName && !matchesDescription) return false;
        }
        if (
          this.filterLocation() &&
          wardrobe.location !== this.filterLocation()
        )
          return false;
        return true;
      })
      .map((wardrobe) => ({
        ...wardrobe,
        garments: this.wardrobeService.getGarmentsForWardrobe(wardrobe),
      })),
  );

  updateFilterSearch(event: Event): void {
    this.filterSearch.set((event.target as HTMLInputElement).value);
  }

  updateFilterLocation(event: Event): void {
    this.filterLocation.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterSearch.set('');
    this.filterLocation.set('');
  }
}
