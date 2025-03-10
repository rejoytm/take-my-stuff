import { style, animate, trigger, transition } from '@angular/animations';

export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(75, style({ opacity: 1 })),
  ]),
  transition(':leave', [animate(150, style({ opacity: 0 }))]),
]);
