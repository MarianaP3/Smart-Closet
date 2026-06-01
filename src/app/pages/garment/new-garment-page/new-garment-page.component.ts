import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-garment-page',
  imports: [],
  templateUrl: './new-garment-page.component.html',
  styleUrl: './new-garment-page.component.css'
})
export class NewGarmentPageComponent {
  private authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.redirectIfNotUserArea();
  }

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'Única'];
}
