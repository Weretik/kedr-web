import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SessionStore } from '@shared/auth';
import { controlErrorText } from '@shared/forms';
import { NotificationService } from '@shared/ui';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'lib-login',
  imports: [
    ReactiveFormsModule,
    InputText,
    Checkbox,
    ButtonDirective,
    ButtonLabel,
    ButtonIcon,
    Divider,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor() {
    if (this.sessionStore.isAuthenticated()) {
      void this.router.navigate(
        this.localeNavigation.localizedSegments('cabinet', 'dashboard'),
      );
    }
  }

  emailErrorText(): string | null {
    return controlErrorText(this.loginForm.controls.email);
  }

  passwordErrorText(): string | null {
    return controlErrorText(this.loginForm.controls.password);
  }

  async submit(): Promise<void> {
    if (this.isSubmitting()) return;

    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    const credentials = this.loginForm.getRawValue();

    try {
      await firstValueFrom(
        this.authService.login({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      );

      const returnUrl = this.sanitizeReturnUrl(
        this.route.snapshot.queryParamMap.get('returnUrl'),
      );
      if (returnUrl) {
        await this.router.navigateByUrl(returnUrl);
        return;
      }

      await this.router.navigate(
        this.localeNavigation.localizedSegments('cabinet', 'dashboard'),
      );
    } catch {
      this.notificationService.error(
        'Login failed',
        'Check email or password and try again.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private sanitizeReturnUrl(returnUrl: string | null): string | null {
    if (!returnUrl) return null;
    if (!returnUrl.startsWith('/')) return null;
    if (returnUrl.startsWith('//')) return null;
    return returnUrl;
  }
}
