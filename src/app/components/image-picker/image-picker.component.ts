import { Component, Input } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { fade } from '@utils/animations';
import { Storage, deleteObject, ref, uploadBytes } from '@angular/fire/storage';
import { ItemReorderEventDetail, IonicModule } from '@ionic/angular';
import { environment } from 'environments/environment';
import { ToastService } from '@services/toast.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageThumbnailComponent } from '../image-thumbnail/image-thumbnail.component';
import { NgIf, NgFor } from '@angular/common';

interface UploadableImage {
  id: string;
  blob: Blob;
  src: string;
}

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  animations: [fade],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ImagePickerComponent,
    },
  ],
  standalone: true,
  imports: [NgIf, IonicModule, NgFor, ImageThumbnailComponent],
})
export class ImagePickerComponent implements ControlValueAccessor {
  @Input() min: number = 0;
  @Input() max: number = Infinity;
  @Input() label: string | undefined;
  @Input() helperText: string | undefined;
  @Input() errorText: string | undefined;

  images: string[] = [];
  uploadingImages: UploadableImage[] = [];

  // Properties for implementing ControlValueAccessor methods
  isTouched: boolean = false;
  onTouched = () => {};
  onChange = (images: string[]) => {};

  constructor(
    private storage: Storage,
    private toastService: ToastService,
  ) {}

  async pickImage() {
    const uploadableImage = await this.getImageFromCamera();
    this.markAsTouched();
    if (!uploadableImage) return;

    this.addToUploadingImages(uploadableImage);
    const image = await this.uploadImage(uploadableImage);
    this.removeFromUploadingImages(uploadableImage);

    if (!image) return;
    this.images.push(image);
    this.onChange(this.images);
  }

  async getImageFromCamera(): Promise<UploadableImage | undefined> {
    try {
      if (Capacitor.getPlatform() !== 'web') await Camera.requestPermissions();

      const photo = await Camera.getPhoto({
        source: CameraSource.Prompt,
        quality: 90,
        resultType: CameraResultType.DataUrl,
      });

      return this.photoToUploadableImage(photo);
    } catch (e: any) {
      if (e.message === 'User cancelled photos app') return;
      this.toastService.toastError({
        message: e.message,
      });
      return undefined;
    }
  }

  async uploadImage(
    uploadableImage: UploadableImage,
  ): Promise<string | undefined> {
    try {
      const imageRef = ref(this.storage, `images/${uploadableImage.id}`);
      await uploadBytes(imageRef, uploadableImage.blob);
      return uploadableImage.id;
    } catch (e: any) {
      this.toastService.toastError({
        header: 'A storage error occurred',
        message: e.message,
      });
      return undefined;
    }
  }

  async photoToUploadableImage(photo: Photo): Promise<UploadableImage> {
    const id = `${Date.now()}${Math.floor(Math.random() * (99 - 10 + 1)) + 10}.${photo.format}`;
    const blob = await (await fetch(photo.dataUrl!)).blob();
    const src = photo.dataUrl!;
    return { id, blob, src };
  }

  addToUploadingImages(uploadableImage: UploadableImage) {
    this.uploadingImages.push(uploadableImage);
  }

  removeFromUploadingImages(uploadableImage: UploadableImage) {
    const imageIndex = this.uploadingImages.findIndex(
      (x) => x.id === uploadableImage.id,
    );
    this.uploadingImages.splice(imageIndex, 1);
  }

  getImageSrc(image: string) {
    return `https://storage.googleapis.com/${environment.firebase.storageBucket}/images/${image}`;
  }

  reorderImage(e: CustomEvent<ItemReorderEventDetail>) {
    const imageToMove = this.images.splice(e.detail.from, 1)[0];
    this.images.splice(e.detail.to, 0, imageToMove);
    e.detail.complete();
    this.onChange(this.images);
    this.markAsTouched();
  }

  deleteImage(image: string): void {
    // Delete image from local list
    const imageIndex = this.images.indexOf(image);
    this.images.splice(imageIndex, 1);
    this.onChange(this.images);
    this.markAsTouched();

    // Delete image from firebase storage
    const imageRef = ref(this.storage, `images/${image}`);
    deleteObject(imageRef);
  }

  // Implementing ControlValueAccessor methods to suppport use in ReactiveForms

  writeValue(images: string[]): void {
    if (Array.isArray(images)) {
      this.images = images;
    } else {
      this.images = [];
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouched();
    }
  }
}
