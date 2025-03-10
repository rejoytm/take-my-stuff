import { Component, OnInit } from '@angular/core';
import { Listing } from '@interfaces/listing';
import { Database, onValue, ref } from '@angular/fire/database';
import { environment } from 'environments/environment';
import { ImageThumbnailComponent } from '@components/image-thumbnail/image-thumbnail.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataService } from '@services/data.service';
import { AuthService } from '@services/auth.service';
import { AppUser } from '@interfaces/app-user';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgFor, RouterLink, ImageThumbnailComponent],
})
export class MyListingsPage implements OnInit {
  user: AppUser | null | undefined;
  userListings: Listing[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.authService.user$.subscribe((user) => {
      if (!user) return;

      this.dataService.listings$.subscribe((listingDictionary) => {
        const listings = Object.values(listingDictionary);
        this.userListings = listings.filter(
          (listing) => listing.sellerId === user.id,
        );
      });

      this.isLoading = false;
    });
  }

  getImageSrc(image: string) {
    return `https://storage.googleapis.com/${environment.firebase.storageBucket}/images/${image}`;
  }
}
