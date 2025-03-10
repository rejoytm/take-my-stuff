import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@services/data.service';
import { Listing } from '@interfaces/listing';
import { Category } from '@interfaces/category';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Database, ref, remove, set } from '@angular/fire/database';
import {
  Storage,
  deleteObject,
  ref as storageRef,
} from '@angular/fire/storage';
import { fade } from '@utils/animations';
import { ImagePickerComponent } from '@components/image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.page.html',
  styleUrls: ['./edit-listing.page.scss'],
  animations: [fade],
  standalone: true,
  imports: [
    NgIf,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    ImagePickerComponent,
  ],
})
export class EditListingPage implements OnInit {
  listing?: Listing;
  categoryOptions: Category[] = [];
  isLoading: boolean = false;

  form: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    categoryId: new FormControl(null, Validators.required),
    imageIds: new FormControl(null, Validators.required),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService,
    private database: Database,
    private storage: Storage,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const listingId = params['id'];
      if (!listingId) return;

      this.dataService.listings$.subscribe((listings) => {
        this.listing = listings[listingId];
        if (!this.listing) return;

        this.form.controls['title'].setValue(this.listing.title);
        this.form.controls['description'].setValue(this.listing.description);
        this.form.controls['price'].setValue(this.listing.price);
        this.form.controls['categoryId'].setValue(this.listing.categoryId);
        this.form.controls['imageIds'].setValue(this.listing.imageIds);
      });
    });

    this.dataService.categories$.subscribe((categories) => {
      this.categoryOptions = Object.values(categories);
    });
  }

  deleteListing() {
    if (!this.listing) return;
    this.isLoading = true;

    // Delete images from firebase storage
    this.listing.imageIds.forEach((id) => {
      const imageRef = storageRef(this.storage, `images/${id}`);
      deleteObject(imageRef);
    });

    // Delete listing from firebase database
    const listingRef = ref(this.database, `listings/${this.listing.id}`);
    remove(listingRef).then(() => {
      this.isLoading = false;
      this.router.navigate(['/tabs/store']);
    });
  }

  onSubmit() {
    if (!this.listing) return;
    this.isLoading = true;

    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const formValue = this.form.value;
    const seller = this.authService.userSubject.value;
    if (!seller) return;

    const updatedListing: Listing = {
      id: this.listing.id,
      createdAt: this.listing.createdAt,
      views: this.listing.views,
      title: formValue.title,
      description: formValue.description,
      price: formValue.price,
      categoryId: formValue.categoryId,
      imageIds: formValue.imageIds,
      sellerId: seller.id,
      updatedAt: Date.now(),
    };

    const listingRef = ref(this.database, `listings/${this.listing.id}`);
    set(listingRef, updatedListing).then(() => {
      this.isLoading = false;
      this.form.reset();
      this.router.navigate(['/listings', updatedListing.id]);
    });
  }

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }

  get price() {
    return this.form.controls['price'];
  }

  get categoryId() {
    return this.form.controls['categoryId'];
  }

  get imageIds() {
    return this.form.controls['imageIds'];
  }
}
