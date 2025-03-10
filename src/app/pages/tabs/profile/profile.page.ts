import { Component, OnInit} from '@angular/core';
import { AuthService } from '@services/auth.service';
import { IonicModule } from '@ionic/angular';
import { AppUser } from '@interfaces/app-user';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink],
})
export class ProfilePage implements OnInit {
  currentUser: AppUser | null | undefined;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
