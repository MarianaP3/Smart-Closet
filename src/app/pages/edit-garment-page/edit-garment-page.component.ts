import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentService } from '../../services/garment.service';

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

  public garmentId = signal('');
  public name = signal('');
  public type = signal('');
  public color = signal('');
  public size = signal('');
  public image = signal('');

  public types = ['Tops', 'Bottoms', 'Shoes', 'Accessories'];
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '22', '24', '26', 'Única'];

  ngOnInit(): void {
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
    this.type.set(garment.type);
    this.color.set(garment.color);
    this.size.set(garment.size);
    this.image.set(garment.image);
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateType(event: Event): void {
    this.type.set((event.target as HTMLSelectElement).value);
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

    this.garmentService.updateGarment(this.garmentId(), {
      name: this.name(),
      type: this.type(),
      color: this.color(),
      size: this.size(),
      image: this.image(),
    });

    this.router.navigate(['/inventory']);
  }
}
