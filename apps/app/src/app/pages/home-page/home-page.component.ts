import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  loginForm = this.fb.group({
    login: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private readonly fb: FormBuilder,
    public readonly authService: AuthService
  ) {}

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    this.authService.signIn(
      this.login?.value || '',
      this.password?.value || ''
    );
  }
}
