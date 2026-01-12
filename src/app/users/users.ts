import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users$!: Observable<any[]>;

  selectedUser: any = null;

  currentPage = 1;
  limit = 5;
  totalCount = 0;

  form = {
    name: '',
    email: '',
    age: null as number | null,
  };

  constructor(private userService: UserService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Initialize ONCE
    this.users$ = this.userService
      .initUsers(this.currentPage, this.limit)
      .pipe(
        map(res => {
          if (res.loading || !res.data?.users) {
            return [];
          }

          this.totalCount = res.data.users.totalCount;
          return res.data.users.users;
        })
      );
  }

  /* ---------- Pagination ---------- */

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.limit);
  }

  nextPage() {
    if (this.currentPage * this.limit < this.totalCount) {
      this.currentPage++;
      this.userService.refetchUsers(this.currentPage, this.limit);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.userService.refetchUsers(this.currentPage, this.limit);
    }
  }

  /* ---------- CRUD ---------- */

  submit() {
    const action$ = this.selectedUser
      ? this.userService.updateUser({
          id: this.selectedUser.id,
          ...this.form,
        })
      : this.userService.addUser(this.form);

    action$.subscribe({
      next: () => {
        this.userService.refetchUsers(this.currentPage, this.limit);
        this.reset();
      },
      error: err => console.error(err),
    });
  }

  edit(user: any) {
    this.selectedUser = user;
    this.form = {
      name: user.name,
      email: user.email,
      age: user.age,
    };
  }

  delete(id: string) {
    if (!confirm('Delete this user?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () =>
        this.userService.refetchUsers(this.currentPage, this.limit),
      error: err => console.error(err),
    });
  }

  reset() {
    this.selectedUser = null;
    this.form = { name: '', email: '', age: null };
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}