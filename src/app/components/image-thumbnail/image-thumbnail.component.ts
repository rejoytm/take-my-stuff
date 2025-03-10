import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-image-thumbnail',
    templateUrl: './image-thumbnail.component.html',
    styleUrls: ['./image-thumbnail.component.scss'],
    standalone: true,
})
export class ImageThumbnailComponent {
  @Input() src: string = '';
  @Input() alt: string = '';

  constructor() {}
}
