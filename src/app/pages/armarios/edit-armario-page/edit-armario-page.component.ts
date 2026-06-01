import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { AuthService } from '../../../services/auth.service';
import { GarmentService } from '../../../services/garment.service';
import { WardrobeService } from '../../../services/wardrobe.service';

@Component({
  selector: 'app-edit-armario-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './edit-armario-page.component.html',
  styleUrl: './edit-armario-page.component.css',
})
export class EditArmarioPageComponent implements OnInit {
  private authService = inject(AuthService);
  private garmentService = inject(GarmentService);
  private wardrobeService = inject(WardrobeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public wardrobeId = signal('');
  public name = signal('');
  public location = signal('');
  public description = signal('');
  public selectedGarmentIds = signal<string[]>([]);
  public errorMessage = signal('');

  public garments = this.garmentService.allGarments;

  public locations = [
    'Recámara',
    'Entrada',
    'Guardado',
    'Oficina',
    'Viaje',
    'Otro',
  ];

  public selectedGarments = computed(() =>
    this.garments().filter((garment) =>
      this.selectedGarmentIds().includes(garment.id),
    ),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/armarios']);
      return;
    }

    const wardrobe = this.wardrobeService.getById(id);

    if (!wardrobe) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.wardrobeId.set(wardrobe.id);
    this.name.set(wardrobe.name);
    this.location.set(wardrobe.location);
    this.description.set(wardrobe.description);
    this.selectedGarmentIds.set([...wardrobe.garmentIds]);
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateLocation(event: Event): void {
    this.location.set((event.target as HTMLSelectElement).value);
  }

  updateDescription(event: Event): void {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  isSelected(garmentId: string): boolean {
    return this.selectedGarmentIds().includes(garmentId);
  }

  toggleGarment(garmentId: string): void {
    this.selectedGarmentIds.update((ids) =>
      ids.includes(garmentId)
        ? ids.filter((id) => id !== garmentId)
        : [...ids, garmentId],
    );
  }

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.name().trim()) {
      this.errorMessage.set('Escribe un nombre para tu armario.');
      return;
    }

    if (!this.location()) {
      this.errorMessage.set('Selecciona una ubicación.');
      return;
    }

    if (this.selectedGarmentIds().length === 0) {
      this.errorMessage.set('Selecciona al menos una prenda para el armario.');
      return;
    }

    this.wardrobeService.updateWardrobe(this.wardrobeId(), {
      name: this.name().trim(),
      location: this.location(),
      description: this.description().trim(),
      garmentIds: this.selectedGarmentIds(),
    });

    this.router.navigate(['/armarios']);
  }

  deleteWardrobe(): void {
    this.wardrobeService.deleteWardrobe(this.wardrobeId());
    this.router.navigate(['/armarios']);
  }
}
