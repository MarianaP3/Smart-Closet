import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UpdateUserPayload, User } from '../interfaces/user.interface';
import { buildApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = buildApiUrl('/api/users');
  private users = signal<User[]>([]);

  readonly allUsers = this.users.asReadonly();

  constructor(private http: HttpClient) {}

  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap((users) => this.users.set(users)),
    );
  }

  getById(id: string): User | undefined {
    return this.users().find((user) => user.id === id);
  }

  getByIdFromApi(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap((user) => {
        const exists = this.users().some((item) => item.id === user.id);

        if (exists) {
          this.users.update((items) =>
            items.map((item) => (item.id === user.id ? user : item)),
          );
        } else {
          this.users.update((items) => [...items, user]);
        }
      }),
    );
  }

  updateUser(id: string, changes: UpdateUserPayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, changes).pipe(
      tap((updated) => {
        this.users.update((users) =>
          users.map((user) => (user.id === id ? updated : user)),
        );
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.users.update((users) => users.filter((user) => user.id !== id)),
      ),
    );
  }

  clearUsers(): void {
    this.users.set([]);
  }
}
