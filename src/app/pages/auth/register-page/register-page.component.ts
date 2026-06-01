import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationError: string = '';

  onRegister() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.registrationError = 'Por favor, complete todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.registrationError = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.registrationError = 'Usuario registrado con éxito';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 400 && error.error.msg === 'Username ya existente') {
          this.registrationError =
            'El nombre de usuario ya está registrado. Intenta con otro.';
        } else {
          this.registrationError =
            error.error?.msg ??
            'Hubo un error al registrar el usuario. Intenta nuevamente.';
        }
      },
    });
  }
}
