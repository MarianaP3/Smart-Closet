import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-inventory-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './garment-page.component.html',
  styleUrl: './garment-page.component.css',
})
export class InventoryPageComponent {
  private garmentService = inject(GarmentService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
  }

  public garments = this.garmentService.allGarments;
  public categories = this.categoryService.allCategories;

  public filterName = signal('');
  public filterCategoryId = signal('');
  public filterColor = signal('');
  public filterSize = signal('');

  public colors = computed(() =>
    [...new Set(this.garments().map((g) => g.color))].sort(),
  );
  public sizes = computed(() =>
    [...new Set(this.garments().map((g) => g.size))].sort(),
  );

  public filteredGarments = computed(() =>
    this.garments().filter((garment) => {
      const name = this.filterName().trim().toLowerCase();
      if (name && !garment.name.toLowerCase().includes(name)) return false;
      if (
        this.filterCategoryId() &&
        garment.categoryId !== this.filterCategoryId()
      )
        return false;
      if (this.filterColor() && garment.color !== this.filterColor())
        return false;
      if (this.filterSize() && garment.size !== this.filterSize()) return false;
      return true;
    }),
  );

  updateFilterName(event: Event): void {
    this.filterName.set((event.target as HTMLInputElement).value);
  }

  updateFilterCategory(event: Event): void {
    this.filterCategoryId.set((event.target as HTMLSelectElement).value);
  }

  updateFilterColor(event: Event): void {
    this.filterColor.set((event.target as HTMLSelectElement).value);
  }

  updateFilterSize(event: Event): void {
    this.filterSize.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterName.set('');
    this.filterCategoryId.set('');
    this.filterColor.set('');
    this.filterSize.set('');
  }
}
