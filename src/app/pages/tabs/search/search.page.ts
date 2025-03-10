import { Location, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageThumbnailComponent } from '@components/image-thumbnail/image-thumbnail.component';
import { Listing } from '@interfaces/listing';
import { IonicModule } from '@ionic/angular';
import { DataService } from '@services/data.service';
import { getStorageImageSrc } from '@utils/storage';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgFor, ImageThumbnailComponent, RouterLink],
})
export class SearchPage implements OnInit {
  listings: Listing[] = [];
  searchableListings: { listing: Listing; searchTerm: string }[] = [];
  searchResults: Listing[] = [];

  constructor(
    private location: Location,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService.listings$.subscribe((listingDictionary) => {
      const listings = Object.values(listingDictionary);
      this.searchableListings = listings.map((listing) => ({
        listing: listing,
        searchTerm: this.normalizeSearchTerm(listing.title),
      }));
    });
  }

  onSearchbarInput(search: string | null | undefined): void {
    if (!search) {
      this.searchResults = [];
      return;
    }

    const normalizedSearch = this.normalizeSearchTerm(search);

    this.searchResults = this.searchableListings
      .filter((searchableListing) =>
        searchableListing.searchTerm.includes(normalizedSearch),
      )
      .map((searchableListing) => searchableListing.listing);
  }

  normalizeSearchTerm(searchTerm: string) {
    return ` ${searchTerm.toLowerCase()}`;
  }

  onSearchbarCancel() {
    this.location.back();
  }

  getStorageImageSrc = getStorageImageSrc;
}
