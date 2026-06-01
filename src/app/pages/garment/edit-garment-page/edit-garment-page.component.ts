import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { GarmentService } from '../../../services/garment.service';

@Component({
  selector: 'app-edit-garment-page',
  imports: [RouterLink],
  templateUrl: './edit-garment-page.component.html',
  styleUrl: './edit-garment-page.component.css',
})
export class EditGarmentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private garmentService = inject(GarmentService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  public garmentId = signal('');
  public name = signal('');
  public categoryId = signal('');
  public color = signal('');
  public size = signal('');
  public image = signal('');

  public categories = this.categoryService.allCategories;
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '22', '24', '26', 'Única'];

  public categoryName = computed(() => {
    const category = this.categoryService.getById(this.categoryId());
    return category?.name ?? '';
  });

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/inventory']);
      return;
    }

    const garment = this.garmentService.getById(id);

    if (!garment) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.garmentId.set(garment.id);
    this.name.set(garment.name);
    this.categoryId.set(garment.categoryId);
    this.color.set(garment.color);
    this.size.set(garment.size);
    this.image.set(garment.image);
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateCategory(event: Event): void {
    this.categoryId.set((event.target as HTMLSelectElement).value);
  }

  updateColor(event: Event): void {
    this.color.set((event.target as HTMLInputElement).value);
  }

  updateSize(event: Event): void {
    this.size.set((event.target as HTMLSelectElement).value);
  }

  updateImage(event: Event): void {
    this.image.set((event.target as HTMLInputElement).value);
  }

  deleteGarment(): void {
    this.garmentService.deleteGarment(this.garmentId());
    this.router.navigate(['/inventory']);
  }

  save(event: Event): void {
    event.preventDefault();

    const category = this.categoryService.getById(this.categoryId());

    if (!category) {
      return;
    }

    this.garmentService.updateGarment(this.garmentId(), {
      name: this.name(),
      type: category.name,
      categoryId: this.categoryId(),
      color: this.color(),
      size: this.size(),
      image: this.image(),
    });

    this.router.navigate(['/inventory']);
  }
}
