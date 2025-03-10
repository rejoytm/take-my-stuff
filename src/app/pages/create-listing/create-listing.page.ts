import { Component, OnInit } from '@angular/core';
import { fade } from '@utils/animations';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoadingService } from '@services/loading.service';
import { Database, push, ref, set } from '@angular/fire/database';
import { Category } from '@interfaces/category';
import { AuthService } from '@services/auth.service';
import { Listing } from '@interfaces/listing';
import { ToastService } from '@services/toast.service';
import { FirebaseError } from 'firebase/app';
import { Router } from '@angular/router';
import { DataService } from '@services/data.service';
import { ImagePickerComponent } from '@components/image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.page.html',
  styleUrls: ['./create-listing.page.scss'],
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
export class CreateListingPage implements OnInit {
  categoryOptions: Category[] = [];

  form: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    categoryId: new FormControl(null, Validators.required),
    imageIds: new FormControl(null, Validators.required),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private database: Database,
    public loadingService: LoadingService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.dataService.categories$.subscribe((categories) => {
      this.categoryOptions = Object.values(categories);
    });
  }

  onSubmit() {
    this.loadingService.pulse();
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const formValue = this.form.value;
    const seller = this.authService.userSubject.value;
    if (!seller) return;

    const listingsRef = ref(this.database, 'listings');
    const newListingRef = push(listingsRef);

    const listing: Listing = {
      id: newListingRef.key!,
      title: formValue.title,
      description: formValue.description,
      price: formValue.price,
      categoryId: formValue.categoryId,
      imageIds: formValue.imageIds,
      sellerId: seller.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      views: 0,
    };

    set(newListingRef, listing)
      .then(() => {
        this.form.reset();
        this.router.navigate(['/listings', listing.id]);
      })
      .catch((e: FirebaseError) => {
        this.toastService.toastError({
          header: 'A database error occured',
          message: e.message,
          positionAnchor: 'footer',
        });
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
