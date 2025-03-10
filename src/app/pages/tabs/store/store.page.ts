import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Listing } from '@interfaces/listing';
import { DataService } from '@services/data.service';
import { Category } from '@interfaces/category';
import { getStorageImageSrc } from '@utils/storage';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppUser } from '@interfaces/app-user';
registerSwiperElements();

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgIf, NgClass, NgFor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StorePage implements OnInit {
  listings: Listing[] = [];
  categories: Category[] = [];
  filterCategory?: Category;
  filteredListings: Listing[] = [];

  userDictionary: { [id: string]: AppUser } = {};
  isLoading: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.isLoading = true;

    this.dataService.users$.subscribe((users) => {
      this.userDictionary = users;
    });

    this.dataService.categories$.subscribe((categories) => {
      this.categories = Object.values(categories);

      // Check if all data has loaded
      if (this.listings.length && this.categories.length) {
        this.isLoading = false;
      }
    });

    this.dataService.listings$.subscribe((listings) => {
      this.listings = Object.values(listings).reverse();
      this.filterListings();

      // Check if all data has loaded
      if (this.listings.length && this.categories.length) {
        this.isLoading = false;
      }
    });
  }

  resetFilter() {
    this.filterCategory = undefined;
    this.filterListings();
  }

  setFilter(category: Category): void {
    if (this.filterCategory?.id === category.id) {
      // This filter is currently active, so deactivate it
      this.filterCategory = undefined;
    } else {
      this.filterCategory = category;
    }

    // Update filteredListings
    this.filterListings();
  }

  filterListings(): void {
    if (this.filterCategory) {
      this.filteredListings = this.listings.filter(
        (listing) => listing.categoryId === this.filterCategory?.id,
      );
    } else {
      this.filteredListings = this.listings;
    }
  }

  getStorageImageSrc = getStorageImageSrc;

  getSellerAddress(sellerId: string) {
    return this.userDictionary[sellerId]?.location.address;
  }
}
