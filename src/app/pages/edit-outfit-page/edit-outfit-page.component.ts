import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GarmentCardComponent } from '../../components/garment-card/garment-card.component';
import { GarmentService } from '../../services/garment.service';
import { OutfitService } from '../../services/outfit.service';

@Component({
  selector: 'app-edit-outfit-page',
  imports: [GarmentCardComponent, RouterLink],
  templateUrl: './edit-outfit-page.component.html',
  styleUrl: './edit-outfit-page.component.css',
})
export class EditOutfitPageComponent implements OnInit {
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
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/outfits']);
      return;
    }

    const outfit = this.outfitService.getById(id);

    if (!outfit) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.outfitId.set(outfit.id);
    this.name.set(outfit.name);
    this.style.set(outfit.style);
    this.occasion.set(outfit.occasion);
    this.selectedGarmentIds.set([...outfit.garmentIds]);
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

    this.outfitService.updateOutfit(this.outfitId(), {
      name: this.name().trim(),
      style: this.style(),
      occasion: this.occasion(),
      garmentIds: this.selectedGarmentIds(),
    });

    this.router.navigate(['/outfits']);
  }

  deleteOutfit(): void {
    this.outfitService.deleteOutfit(this.outfitId());
    this.router.navigate(['/outfits']);
  }
}
