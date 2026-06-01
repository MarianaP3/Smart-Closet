import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../../components/garment-card/garment-card.component';
import { GarmentService } from '../../../services/garment.service';
import { OutfitService } from '../../../services/outfit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-outfit-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './edit-outfit-page.component.html',
  styleUrl: './edit-outfit-page.component.css',
})
export class EditOutfitPageComponent implements OnInit {
  private authService = inject(AuthService);
  private garmentService = inject(GarmentService);
  private outfitService = inject(OutfitService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public outfitId = signal('');
  public name = signal('');
  public style = signal('');
  public occasion = signal('');
  public selectedGarmentIds = signal<string[]>([]);
  public errorMessage = signal('');
  public isSaving = signal(false);
  public isLoading = signal(true);

  public garments = this.garmentService.allGarments;

  public styles = [
    'Casual chic',
    'Bohemio',
    'Minimalista',
    'Western',
    'Urbano',
    'Elegante',
  ];

  public occasions = [
    'Día',
    'Noche',
    'Trabajo',
    'Fin de semana',
    'Casual',
    'Evento',
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
      this.router.navigate(['/outfits']);
      return;
    }

    this.garmentService.loadGarments().subscribe({
      next: () => {
        this.outfitService.getByIdFromApi(id).subscribe({
          next: (outfit) => {
            this.outfitId.set(outfit.id);
            this.name.set(outfit.name);
            this.style.set(outfit.style);
            this.occasion.set(outfit.occasion);
            this.selectedGarmentIds.set([...outfit.garmentIds]);
            this.isLoading.set(false);
          },
          error: () => {
            this.router.navigate(['/not-found']);
          },
        });
      },
      error: () => {
        this.router.navigate(['/not-found']);
      },
    });
  }

  updateName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  updateStyle(event: Event): void {
    this.style.set((event.target as HTMLSelectElement).value);
  }

  updateOccasion(event: Event): void {
    this.occasion.set((event.target as HTMLSelectElement).value);
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
      this.errorMessage.set('Escribe un nombre para tu outfit.');
      return;
    }

    if (!this.style()) {
      this.errorMessage.set('Selecciona un estilo.');
      return;
    }

    if (!this.occasion()) {
      this.errorMessage.set('Selecciona una ocasión.');
      return;
    }

    if (this.selectedGarmentIds().length === 0) {
      this.errorMessage.set('Selecciona al menos una prenda para tu outfit.');
      return;
    }

    this.isSaving.set(true);

    this.outfitService
      .updateOutfit(this.outfitId(), {
        name: this.name().trim(),
        style: this.style(),
        occasion: this.occasion(),
        garmentIds: this.selectedGarmentIds(),
      })
      .subscribe({
        next: () => this.router.navigate(['/outfits']),
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  deleteOutfit(): void {
    this.outfitService.deleteOutfit(this.outfitId()).subscribe({
      next: () => this.router.navigate(['/outfits']),
      error: (error) =>
        this.errorMessage.set(this.getErrorMessage(error)),
    });
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    return error.error?.msg ?? 'No se pudo guardar el outfit. Intenta de nuevo.';
  }
}
