import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users-page',
  imports: [RouterLink],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  public users = this.userService.allUsers;
  public isLoading = signal(true);
  public errorMessage = signal('');

  public filterSearch = signal('');
  public filterRole = signal('');

  public roles = ['Usuario', 'Administrador'];

  public filteredUsers = computed(() =>
    this.users().filter((user) => {
      const search = this.filterSearch().trim().toLowerCase();
      if (search && !user.username.toLowerCase().includes(search)) {
        return false;
      }

      if (this.filterRole() && user.role !== this.filterRole()) return false;

      return true;
    }),
  );

  ngOnInit(): void {
    this.authService.redirectIfNotAdmin();
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.loadUsers().subscribe({
      next: () => this.isLoading.set(false),
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  updateFilterSearch(event: Event): void {
    this.filterSearch.set((event.target as HTMLInputElement).value);
  }

  updateFilterRole(event: Event): void {
    this.filterRole.set((event.target as HTMLSelectElement).value);
  }

  clearFilters(): void {
    this.filterSearch.set('');
    this.filterRole.set('');
  }

  private getErrorMessage(error: { status?: number; error?: { msg?: string } }): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }

    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }

    if (error.status === 403) {
      return 'No tienes permisos para consultar usuarios.';
    }

    return error.error?.msg ?? 'No se pudieron cargar los usuarios.';
  }
}
