import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-fab-bar',
    templateUrl: './fab-bar.component.html',
    styleUrls: ['./fab-bar.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
    standalone: true,
    imports: [IonicModule, NgClass],
})
export class FabBarComponent implements OnInit {
  @Input()
  slot: 'bottom' | 'top' = 'bottom';

  constructor() {}

  ngOnInit() {}
}
