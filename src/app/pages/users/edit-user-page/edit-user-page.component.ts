import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-user-page',
  imports: [RouterLink],
  templateUrl: './edit-user-page.component.html',
  styleUrl: './edit-user-page.component.css',
})
export class EditUserPageComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public userId = signal('');
  public username = signal('');
  public role = signal<'Usuario' | 'Administrador'>('Usuario');
  public password = signal('');
  public errorMessage = signal('');
  public isSaving = signal(false);
  public isLoading = signal(true);

  public roles: Array<'Usuario' | 'Administrador'> = ['Usuario', 'Administrador'];

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/usuarios']);
      return;
    }

    this.userService.getByIdFromApi(id).subscribe({
      next: (user) => {
        this.userId.set(user.id);
        this.username.set(user.username);
        this.role.set(user.role);
        this.isLoading.set(false);
      },
      error: () => {
        this.router.navigate(['/not-found']);
      },
    });
  }

  updateUsername(event: Event): void {
    this.username.set((event.target as HTMLInputElement).value);
  }

  updateRole(event: Event): void {
    this.role.set(
      (event.target as HTMLSelectElement).value as 'Usuario' | 'Administrador',
    );
  }

  updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  save(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.username().trim()) {
      this.errorMessage.set('Escribe el nombre de usuario.');
      return;
    }

    const duplicate = this.userService
      .allUsers()
      .some(
        (user) =>
          user.id !== this.userId() &&
          user.username.toLowerCase() === this.username().trim().toLowerCase(),
      );

    if (duplicate) {
      this.errorMessage.set('Ya existe otro usuario con ese nombre de usuario.');
      return;
    }

    if (this.password().trim() && this.password().trim().length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.isSaving.set(true);

    this.userService
      .updateUser(this.userId(), {
        username: this.username().trim(),
        role: this.role(),
        password: this.password().trim() || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  deleteUser(): void {
    this.errorMessage.set('');

    this.userService.deleteUser(this.userId()).subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: (error) =>
        this.errorMessage.set(this.getErrorMessage(error)),
    });
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 403) {
      return 'No tienes permisos para modificar usuarios.';
    }

    if (error.status === 400 && error.error?.msg === 'Username ya existente') {
      return 'Ya existe otro usuario con ese nombre de usuario.';
    }

    return error.error?.msg ?? 'No se pudo guardar el usuario. Intenta de nuevo.';
  }
}
