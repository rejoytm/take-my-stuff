import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { RouterLink } from '@angular/router';
import { FabBarComponent } from '@components/fab-bar/fab-bar.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, FabBarComponent, RouterLink],
})
export class TabsPage implements OnInit {
  authService: AuthService = inject(AuthService);

  constructor() {}

  ngOnInit() {}
}
