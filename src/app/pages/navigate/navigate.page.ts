import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ToastService } from '@services/toast.service';
import { IonicModule } from '@ionic/angular';
import { MapsService } from '@services/maps.service';

declare var google: any;

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.page.html',
  styleUrls: ['./navigate.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class NavigatePage implements OnInit {
  map: any;
  directionsService: any;
  directionsRenderer: any;

  originLatitude: number = 0;
  originLongitude: number = 0;
  destinationLatitude: number = 0;
  destinationLongitude: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mapsService: MapsService,
    private toastService: ToastService,
  ) {}

  async ngOnInit() {
    const currentPosition = await Geolocation.getCurrentPosition();
    if (currentPosition) {
      this.originLatitude = currentPosition.coords.latitude;
      this.originLongitude = currentPosition.coords.longitude;
    }

    this.activatedRoute.queryParams.subscribe((params) => {
      const latitude = parseFloat(params['latitude']);
      const longitude = parseFloat(params['longitude']);
      if (!isNaN(latitude) || !isNaN(longitude)) {
        this.destinationLatitude = latitude;
        this.destinationLongitude = longitude;
      }
    });

    await this.mapsService.load();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    await this.loadMap();
    await this.drawRoute();
  }

  async loadMap(): Promise<void> {
    const options = {
      center: { lat: this.originLatitude, lng: this.originLongitude },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: this.mapsService.mapStyles,
    };
    this.map = new google.maps.Map(document.getElementById('map'), options);
    this.directionsRenderer.setMap(this.map);
  }

  async drawRoute(): Promise<void> {
    const request = {
      origin: {
        lat: this.originLatitude,
        lng: this.originLongitude,
      },
      destination: {
        lat: this.destinationLatitude,
        lng: this.destinationLongitude,
      },
      travelMode: 'DRIVING',
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status !== 'OK') {
        this.toastService.toastError({
          header: 'Directions request failed',
          message: 'The directions service is currently not available.',
        });
        return;
      }
      this.directionsRenderer.setDirections(result);
    });
  }
}
