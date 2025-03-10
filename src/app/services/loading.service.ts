import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading: boolean = false;
  private _isFauxLoading: boolean = false;
  private _pulseTimeout: NodeJS.Timeout | undefined;
  minDuration: number = 1000;

  constructor() {}

  start() {
    clearTimeout(this._pulseTimeout);

    this._isLoading = true;
    this._isFauxLoading = true;

    setTimeout(() => {
      this._isFauxLoading = false;
    }, this.minDuration);
  }

  stop() {
    this._isLoading = false;
  }

  pulse() {
    this._isLoading = true;
    this._isFauxLoading = true;

    this._pulseTimeout = setTimeout(() => {
      this._isFauxLoading = false;
      this._isLoading = false;
    }, this.minDuration);
  }

  get loading() {
    return this._isLoading || this._isFauxLoading;
  }
}
