import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Database, onValue, ref } from '@angular/fire/database';
import { Router } from '@angular/router';
import { User as FirebaseAuthUser } from '@angular/fire/auth';
import { DataService } from './services/data.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private database: Database,
  ) {}

  ngOnInit(): void {
    this.authService.authUser$.subscribe(
      (authUser: FirebaseAuthUser | null) => {
        if (authUser) {
          this.handleLoggedInUser(authUser);
        } else {
          this.authService.userSubject.next(null);
          this.router.navigate(['/login']);
        }
      },
    );
  }

  handleLoggedInUser(authUser: FirebaseAuthUser) {
    const userDataRef = ref(this.database, `users/${authUser.uid}`);

    onValue(userDataRef, (snapshot) => {
      if (snapshot.exists()) {
        this.authService.userSubject.next(snapshot.val());
      } else {
        // Although the user logged in successfully, their records are missing in the database.
        // In this scenario, logging out the user is necessary to avoid errors.
        this.authService.logout();
      }
    });
  }
}
