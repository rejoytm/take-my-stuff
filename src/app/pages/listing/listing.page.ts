import {
  Component,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '@services/data.service';
import { Listing } from '@interfaces/listing';
import { AppUser } from '@interfaces/app-user';
import { days, formatAvailabilityForDay } from '@utils/availability';
import { fade } from '@utils/animations';
import { NgIf, NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { getStorageImageSrc } from '@utils/storage';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fade],
  standalone: true,
  imports: [IonicModule, RouterLink, NgIf, NgFor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListingPage {
  listing: Listing | undefined;
  seller: AppUser | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    const requestedListingId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!requestedListingId) return;

    this.dataService.listings$.subscribe((listings) => {
      const listing = listings[requestedListingId];
      if (!listing) return;
      this.listing = listings[requestedListingId];

      this.dataService.users$.subscribe((users) => {
        const seller = users[listing.sellerId];
        if (!seller) return;
        this.seller = seller;
      });
    });
  }

  getStorageImageSrc = getStorageImageSrc;
  days = days;
  formatAvailabilityForDay = formatAvailabilityForDay;
}
