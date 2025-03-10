import { Injectable } from '@angular/core';
import {
  user,
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AppUser } from '@interfaces/app-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser$ = user(this.firebaseAuth);

  public userSubject = new BehaviorSubject<AppUser | null | undefined>(
    undefined,
  );
  public user$ = this.userSubject.asObservable();

  constructor(private firebaseAuth: Auth) {}

  register(email: string, password: string): Observable<UserCredential> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    );
    return from(promise);
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    );
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
