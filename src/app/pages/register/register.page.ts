import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { AuthError, UserCredential } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Availability } from '@interfaces/availability';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { fade } from '@utils/animations';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { MapsService } from '@services/maps.service';
import { getAddressFromGeocoderResult } from '@utils/geolocation';
import { Location } from '@interfaces/location';
import { LoadingService } from '@services/loading.service';
import { AvailabilityPickerComponent } from '@components/availability-picker/availability-picker.component';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

registerSwiperElements();

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  animations: [fade],
  standalone: true,
  imports: [
    NgIf,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AvailabilityPickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterPage implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { updateOn: 'blur' },
  );

  location: Location = {
    address: '',
    coordinates: { latitude: 0.0, longitude: 0.0 },
  };
  availability: Availability = {};

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiperInstance?: Swiper;
  isValidating?: boolean = false;
  isLoading: boolean = false;
  isFauxLoading: boolean = false;

  googleMap?: google.maps.Map;
  googleMapMarker?: google.maps.Marker;
  googleMapsGeocoder?: google.maps.Geocoder;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private mapsService: MapsService,
    public loadingService: LoadingService,
    private database: Database,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.mapsService.load();

    this.googleMap = new google.maps.Map(document.getElementById('map')!, {
      zoom: 14,
      disableDefaultUI: true,
      styles: this.mapsService.mapStyles,
    });

    this.googleMapMarker = new google.maps.Marker({
      map: this.googleMap,
    });

    this.googleMapsGeocoder = new google.maps.Geocoder();

    this.detectAddressAndUpdateMap();
  }

  ngAfterViewInit(): void {
    this.swiperReady();
  }

  swiperReady(): void {
    this.swiperInstance = this.swiperRef?.nativeElement.swiper;
  }

  async detectAddressAndUpdateMap() {
    const permissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus.location !== 'granted') {
      await Geolocation.requestPermissions();
    }

    // Get user coordinates
    const position = await Geolocation.getCurrentPosition();
    this.location.coordinates.latitude = position.coords.latitude;
    this.location.coordinates.longitude = position.coords.longitude;

    // Get user address
    if (this.googleMapsGeocoder) {
      const response = await this.googleMapsGeocoder?.geocode({
        location: {
          lat: this.location.coordinates.latitude,
          lng: this.location.coordinates.longitude,
        },
      });
      this.location.address = getAddressFromGeocoderResult(response.results[0]);
    }

    this.updateGoogleMap();
  }

  updateGoogleMap() {
    this.googleMap?.panTo({
      lat: this.location.coordinates.latitude,
      lng: this.location.coordinates.longitude,
    });

    this.googleMapMarker?.setPosition({
      lat: this.location.coordinates.latitude,
      lng: this.location.coordinates.longitude,
    });
  }

  goToNextStep(): void {
    this.loadingService.pulse();
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.swiperInstance?.slideTo(0); // Form is on the first slide
      return;
    }

    this.swiperInstance?.slideNext();
  }

  goToPreviousStep(): void {
    this.swiperInstance?.slidePrev();
  }

  onSubmit(): void {
    this.loadingService.pulse();
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.loadingService.start();
    const formValue = this.form.value;
    this.authService.register(formValue.email, formValue.password).subscribe({
      next: async (credential: UserCredential) => {
        this.loadingService.stop();
        await this.handleUserCredential(credential);
      },
      error: async (e: AuthError) => {
        this.loadingService.stop();
        await this.toastService.toastAuthError(e, { positionAnchor: 'footer' });
      },
    });
  }

  async handleUserCredential(credential: UserCredential): Promise<void> {
    try {
      const userDataRef = ref(this.database, `users/${credential.user.uid}`);
      await set(userDataRef, {
        id: credential.user.uid,
        email: credential.user.email,
        name: this.name.value,
        location: this.location,
        availability: this.availability,
      });

      this.router.navigateByUrl('/tabs');
    } catch (e) {
      console.error(e);
    }
  }

  get name() {
    return this.form.controls['name'];
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }
}
