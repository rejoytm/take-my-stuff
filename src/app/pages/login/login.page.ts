import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { AuthError } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { LoadingService } from '@services/loading.service';
import { fade } from '@utils/animations';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [fade],
  standalone: true,
  imports: [NgIf, IonicModule, FormsModule, ReactiveFormsModule, RouterLink],
})
export class LoginPage {
  form: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    },
    { updateOn: 'blur' },
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    public loadingService: LoadingService,
    private toastService: ToastService,
  ) {}

  onSubmit(): void {
    this.loadingService.pulse();
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.loadingService.start();
    const formValue = this.form.value;

    this.authService.login(formValue.email, formValue.password).subscribe({
      next: async () => {
        this.loadingService.stop();
        this.router.navigate(['/tabs']);
      },
      error: async (e: AuthError) => {
        this.loadingService.stop();
        await this.toastService.toastAuthError(e);
      },
    });
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }
}
