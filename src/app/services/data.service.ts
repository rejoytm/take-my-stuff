import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Listing } from '@interfaces/listing';
import { Database, onValue, ref } from '@angular/fire/database';
import { AppUser } from '@interfaces/app-user';
import { Category } from '@interfaces/category';
import { Message } from '@interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private listingsSubject = new BehaviorSubject<{ [id: string]: Listing }>({});
  public listings$ = this.listingsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<{ [id: string]: Message }>({});
  public messages$ = this.messagesSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<{ [id: string]: Category }>(
    {},
  );
  public categories$ = this.categoriesSubject.asObservable();

  private usersSubject = new BehaviorSubject<{ [id: string]: AppUser }>({});
  public users$ = this.usersSubject.asObservable();

  constructor(private database: Database) {
    this.fetchListings();
    this.fetchMessages();
    this.fetchUsers();
    this.fetchCategories();
  }

  fetchListings(): void {
    const listingsRef = ref(this.database, 'listings');
    onValue(listingsRef, (snapshot) => {
      this.listingsSubject.next(snapshot.val());
    });
  }

  fetchMessages(): void {
    const messagesRef = ref(this.database, 'messages');
    onValue(messagesRef, (snapshot) => {
      this.messagesSubject.next(snapshot.val());
    });
  }

  fetchCategories(): void {
    const categoriesRef = ref(this.database, 'categories');
    onValue(categoriesRef, (snapshot) => {
      this.categoriesSubject.next(snapshot.val());
    });
  }

  fetchUsers(): void {
    const usersRef = ref(this.database, 'users');
    onValue(usersRef, (snapshot) => {
      this.usersSubject.next(snapshot.val());
    });
  }

  getUser(id: string): AppUser {
    return this.usersSubject.value[id];
  }
}
