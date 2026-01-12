import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN, REGISTER } from '../graphql/auth.graphql';
import { map } from 'rxjs/operators';
import { jwtDecode }from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private apollo: Apollo) {}

  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN,
      variables: { email, password },
    }).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.data.login.token);
        return res.data.login.user;
      })
    );
  }

  register(name: string, email: string, password: string, age: number) {
    return this.apollo.mutate({
      mutation: REGISTER,
      variables: { name, email, password, age },
    }).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.data.register.token);
        return res.data.register.user;
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
