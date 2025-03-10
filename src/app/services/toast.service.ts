import { Injectable } from '@angular/core';
import { AuthError } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { StorageError } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async toast(options: {
    header?: string;
    message: string;
    icon?: string;
    position?: 'bottom' | 'top' | 'middle';
    positionAnchor?: string | HTMLElement;
    duration?: number;
  }) {
    const {
      header,
      message = 'Something went wrong. Please try again later.',
      icon,
      position = 'bottom',
      positionAnchor,
      duration = 5000,
    } = options;

    const toast = await this.toastController.create({
      header,
      message,
      duration,
      icon,
      position,
      positionAnchor,
      cssClass: 'app-toast',
    });
    toast.present();
  }

  async toastError(options: {
    header?: string;
    message: string;
    positionAnchor?: string | HTMLElement;
  }) {
    const { header = 'An error occured', message, positionAnchor } = options;
    await this.toast({
      header,
      message,
      positionAnchor,
      icon: 'alert-circle-outline',
    });
  }

  async toastAuthError(
    e: AuthError,
    options?: {
      positionAnchor?: string | HTMLElement;
    },
  ) {
    let toastHeader = 'An authentication error occured';
    let toastMessage = e.message;

    if (e.code === 'auth/email-already-in-use') {
      toastHeader = 'Email Address Already In Use';
      toastMessage =
        'Please use a different email address or sign in if you already have an account.';
    } else if (e.code === 'auth/invalid-credential') {
      toastHeader = 'Invalid Email Address or Password';
      toastMessage = 'Please double-check your credentials and try again.';
    } else if (e.code === 'auth/network-request-failed') {
      toastHeader = 'No internet connection';
      toastMessage = 'Please double-check your connection and try again.';
    }

    await this.toastError({
      header: toastHeader,
      message: toastMessage,
      positionAnchor: options?.positionAnchor,
    });
  }
}
