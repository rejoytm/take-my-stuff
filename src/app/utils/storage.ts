import { environment } from 'environments/environment';

export function getStorageImageSrc(folder: string, imageId: string) {
  return `https://storage.googleapis.com/${environment.firebase.storageBucket}/${folder}/${imageId}`;
}
