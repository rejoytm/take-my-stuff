import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class WelcomePage implements OnInit {
  userCheckInterval: NodeJS.Timeout | undefined;
  private userSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      if (!user) return;
      this.userSubscription?.unsubscribe();
      this.router.navigateByUrl('/tabs');
    });
  }
}
