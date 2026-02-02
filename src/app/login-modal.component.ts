import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AdminPostService } from './services/admin-post.service';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
  <!-- Backdrop -->
<div
  class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
  [class.hidden]="!isVisible()"
  [class.opacity-0]="!isVisible()"
  [class.opacity-100]="isVisible()"
>
  <!-- Modal Container -->
  <div class="w-full max-w-md max-h-[90vh] overflow-hidden">
    <!-- Modal Content -->
    <div
      class="bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-out"
      [class.scale-95]="!isVisible()"
      [class.scale-100]="isVisible()"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white rounded-t-3xl z-10 border-b border-gray-100 px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 leading-tight">
                {{ isLoginMode() ? 'Welcome Back' : 'Join Us' }}
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                {{ isLoginMode() ? 'Sign in to continue' : 'Create your account' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="close()"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200 touch-manipulation"
            aria-label="Close modal"
          >
            <svg
              class="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form Content - Scrollable -->
      <div class="overflow-y-auto px-6 py-5" style="max-height: calc(90vh - 200px)">
        <!-- Main Auth Form -->
        <form
        *ngIf="!isForgotPasswordMode() && !isEmailVerifyMode()"
          [formGroup]="authForm"
          (ngSubmit)="onSubmit()"
          class="space-y-5"
        >
        <!-- Forgot flow error message -->
<div
  *ngIf="errorMessage()"
  class="p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
>
  <div class="flex items-start gap-3">
    <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
         fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414
           1.414L8.586 10l-1.293 1.293a1 1 0 101.414
           1.414L10 11.414l1.293 1.293a1 1 0 001.414
           -1.414L11.414 10l1.293-1.293a1 1 0 00
           -1.414-1.414L10 8.586 8.707 7.293z"
        clip-rule="evenodd"/>
    </svg>

    <p class="text-sm text-red-700">
      {{ errorMessage() }}
    </p>
  </div>
</div>

          <!-- Name Field (Register only) -->
          <div *ngIf="!isLoginMode()" class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Full Name
            </label>
            <input
              type="text"
              formControlName="name"
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-base"
              placeholder="Your full name"
              [class.border-red-300]="authForm.get('name')?.invalid && authForm.get('name')?.touched"
            />
            <div
              *ngIf="authForm.get('name')?.invalid && authForm.get('name')?.touched"
              class="text-sm text-red-600 px-2"
            >
              Name is required
            </div>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Email Address
            </label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-base"
              placeholder="you@example.com"
              [class.border-red-300]="authForm.get('email')?.invalid && authForm.get('email')?.touched"
            />
            <div
              *ngIf="authForm.get('email')?.invalid && authForm.get('email')?.touched"
              class="text-sm text-red-600 px-2"
            >
              Valid email is required
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Password
            </label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-base"
              placeholder="Create a password"
              [class.border-red-300]="authForm.get('password')?.invalid && authForm.get('password')?.touched"
            />
            <div
              *ngIf="authForm.get('password')?.invalid && authForm.get('password')?.touched"
              class="text-sm text-red-600 px-2"
            >
              Minimum 6 characters required
            </div>
          </div>

          <!-- Login Mode Options -->
          <div *ngIf="isLoginMode()" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label class="flex items-center gap-2 touch-manipulation">
              <input
                type="checkbox"
                formControlName="rememberMe"
                class="w-5 h-5 rounded-lg border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <span class="text-sm text-gray-700">Remember me</span>
            </label>
            <button
              type="button"
              (click)="switchToForgotPassword()"
              class="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline text-right touch-manipulation"
            >
              Forgot password?
            </button>
          </div>

          <!-- Error Message -->
          <div
            *ngIf="errorMessage()"
            class="p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <p class="text-sm text-red-700">{{ errorMessage() }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="authForm.invalid || isLoading()"
            class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 touch-manipulation min-h-[56px] flex items-center justify-center gap-3"
          >
            <div *ngIf="isLoading()" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span class="text-lg">
              {{ isLoading() ? 'Please wait...' : (isLoginMode() ? 'Sign In' : 'Create Account') }}
            </span>
          </button>

          <!-- Divider -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 bg-white text-sm text-gray-500">or</span>
            </div>
          </div>

          <!-- Switch Mode -->
          <div class="text-center">
            <p class="text-gray-600">
              {{ isLoginMode() ? "Don't have an account?" : 'Already have an account?' }}
              <button
                type="button"
                (click)="toggleMode()"
                class="text-blue-600 hover:text-blue-700 font-bold hover:underline ml-1 touch-manipulation"
              >
                {{ isLoginMode() ? 'Sign up here' : 'Sign in here' }}
              </button>
            </p>
          </div>
        </form>

        <!-- Forgot Password Modal -->
        <div *ngIf="isForgotPasswordMode() || isEmailVerifyMode()" class="space-y-6">
        <!-- Progress Steps -->
       <!-- Progress Steps -->
<div class="flex items-center justify-between mb-6">

<!-- EMAIL VERIFY FLOW -->
<ng-container *ngIf="isEmailVerifyMode(); else forgotSteps">

  <div class="flex-1 text-center">
    <div
      class="w-8 h-8 rounded-full bg-blue-500 text-white font-bold
             flex items-center justify-center mx-auto mb-2 text-sm">
      1
    </div>
    <span class="text-xs font-semibold text-blue-600">
      Verify Email
    </span>
  </div>

  <div class="flex-1 h-0.5 bg-gray-200"></div>

  <div class="flex-1 text-center">
    <div
      class="w-8 h-8 rounded-full bg-blue-500 text-white font-bold
             flex items-center justify-center mx-auto mb-2 text-sm">
      2
    </div>
    <span class="text-xs font-semibold text-blue-600">
      Verify OTP
    </span>
  </div>

</ng-container>

<!-- FORGOT PASSWORD FLOW -->
<ng-template #forgotSteps>

  <div class="flex-1 text-center">
    <div class="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">1</div>
    <span class="text-xs font-semibold text-blue-600">Enter Email</span>
  </div>

  <div class="flex-1 h-0.5 bg-gray-200"></div>

  <div class="flex-1 text-center">
    <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold flex items-center justify-center mx-auto mb-2 text-sm">2</div>
    <span class="text-xs font-semibold text-gray-500">Verify OTP</span>
  </div>

  <div class="flex-1 h-0.5 bg-gray-200"></div>

  <div class="flex-1 text-center">
    <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold flex items-center justify-center mx-auto mb-2 text-sm">3</div>
    <span class="text-xs font-semibold text-gray-500">New Password</span>
  </div>

</ng-template>

</div>

          <!-- Email Stage -->
          <div *ngIf="!isOtpStage() && !isResetStage()" class="space-y-5">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Enter your email
              </label>
              <input
                type="email"
                [(ngModel)]="forgotPasswordEmail"
                placeholder="your@email.com"
                class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-base"
              />
            </div>

            <button
              (click)="submitForgotPassword()"
              [disabled]="!forgotPasswordEmail || forgotPasswordLoading()"
              class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 touch-manipulation min-h-[56px] flex items-center justify-center gap-3"
            >
              <div *ngIf="forgotPasswordLoading()" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span class="text-lg">Send Reset Link</span>
            </button>

            <button
              type="button"
              (click)="closeForgotPassword()"
              class="w-full py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition-colors touch-manipulation"
            >
              Back to login
            </button>
          </div>

          <!-- OTP Stage -->
          <div *ngIf="isOtpStage() && !isResetStage()" class="space-y-5">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                [(ngModel)]="otp"
                placeholder="Enter OTP"
                maxlength="6"
                class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-base text-center tracking-widest text-2xl"
              />
              <p class="text-sm text-gray-500 text-center">
                Check your email for the OTP code
              </p>
            </div>

            <button
            (click)="onVerifyOtpClick()"
            [disabled]="!otp || otp.length < 6"
              class="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 touch-manipulation min-h-[56px]"
            >
              Verify OTP
            </button>
          </div>

          <!-- Reset Password Stage -->
          <div *ngIf="isResetStage()" class="space-y-5">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  New Password
                </label>
                <input
                  type="password"
                  [(ngModel)]="newPassword"
                  placeholder="Enter new password"
                  class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-200 text-base"
                />
              </div>

              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Confirm Password
                </label>
                <input
                  type="password"
                  [(ngModel)]="confirmPassword"
                  placeholder="Confirm new password"
                  class="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-200 text-base"
                />
              </div>
            </div>

            <button
              (click)="submitResetPassword()"
              [disabled]="!newPassword || !confirmPassword || newPassword !== confirmPassword"
              class="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 touch-manipulation min-h-[56px]"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoginModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminPostService = inject(AdminPostService);
  private authService = inject(AuthService);

  @Output() closed = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  // State signals
  isVisible = signal(false);
  isLoginMode = signal(true);
  isForgotPasswordMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  forgotPasswordEmail = '';
  forgotPasswordLoading = signal(false);
  forgotPasswordSuccess = signal(false);

  // Form
  isOtpStage = signal(false);
isResetStage = signal(false);
isEmailVerifyMode = signal(false);
confirmPassword = '';

  authForm: FormGroup;
  otp = '';
  newPassword = '';

  constructor(private alert:AlertService) {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.isVisible.set(true), 10);
  }

  open(mode: 'login' | 'register' = 'login'): void {
    this.isLoginMode.set(mode === 'login');

    if (mode === 'register') {
      this.authForm.get('name')?.setValidators(Validators.required);
    } else {
      this.authForm.get('name')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();

    this.authForm.reset({
      name: '',
      email: '',
      password: '',
      rememberMe: false,
    });

    this.isVisible.set(true);
    this.errorMessage.set('');
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.closed.emit(), 300);
  }

  toggleMode(): void {
    this.isLoginMode.set(!this.isLoginMode());
    this.errorMessage.set('');
    this.authForm.patchValue({
      name: '',
      password: '',
    });

    if (!this.isLoginMode()) {
      this.authForm.get('name')?.setValidators(Validators.required);
    } else {
      this.authForm.get('name')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  switchToForgotPassword(): void {
    this.isForgotPasswordMode.set(true);
  }
  closeForgotPassword(): void {

    this.isForgotPasswordMode.set(false);
  
    this.isOtpStage.set(false);
    this.isResetStage.set(false);
  
    this.forgotPasswordSuccess.set(false);
    this.forgotPasswordEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
  
    this.errorMessage.set('');
  }
  
  async submitForgotPassword(): Promise<void> {

    if (!this.forgotPasswordEmail) return;
  
    this.forgotPasswordLoading.set(true);
    this.errorMessage.set('');
  
    try {
  
      await this.adminPostService
        .forgotPassword(this.forgotPasswordEmail)
        .toPromise();
  
      this.isOtpStage.set(true);     // ✅ only OTP stage open
  
    } catch (error) {
  
      this.errorMessage.set('Failed to send reset email. Please try again.');
  
    } finally {
      this.forgotPasswordLoading.set(false);
    }
  }
  

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.markFormGroupTouched(this.authForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.authForm.value;

    if (this.isLoginMode()) {
      this.adminPostService
        .login({
          email: formValue.email,
          password: formValue.password,
          rememberMe: formValue.rememberMe,
        })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            this.authService.login(response, formValue.rememberMe);
            this.success.emit();
            this.close();
          },
          error: (error) => {
            this.errorMessage.set(
              error.error?.message ||
                'Login failed. Please check your credentials.'
            );
          },
        });
    } else {
      this.adminPostService
        .register({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password,
        })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
            next: () => {

                this.authForm.markAsPristine();
              
                this.openEmailVerification(this.authForm.value.email);
              
              },
              
          error: (error) => {
            this.errorMessage.set(
              error.error?.message || 'Registration failed. Please try again.'
            );
          },
        });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  submitResetPassword() {

    this.errorMessage.set('');
  
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Password is required');
      return;
    }
  
    if (this.newPassword.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }
  
    this.forgotPasswordLoading.set(true);
  
    this.adminPostService
      .resetPassword(
        this.forgotPasswordEmail,
        this.otp,
        this.newPassword
      )
      .pipe(
        finalize(() => this.forgotPasswordLoading.set(false))
      )
      .subscribe({
        next: () => {
  
          this.isResetStage.set(false);
          this.isOtpStage.set(false);
          this.isForgotPasswordMode.set(false);
  
          this.otp = '';
          this.newPassword = '';
          this.confirmPassword = '';
  
          this.errorMessage.set('');
        },
        error: (err) => {
  
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            'Unable to reset password. Please try again.';
  
          this.errorMessage.set(msg);
        }
      });
  
  }
  
  

  verifyOtp() {

    this.errorMessage.set('');
  
    if (!this.otp || this.otp.length < 6) {
      this.errorMessage.set('Please enter 6 digit OTP');
      return;
    }
  
    this.adminPostService.verifyOtp(
      this.forgotPasswordEmail,
      this.otp
    ).subscribe({
      next: () => {
        this.isOtpStage.set(false);
        this.isResetStage.set(true);
      },
      error: (err) => {
  
        const msg =
          err?.error?.message ||
          err?.message ||
          'Invalid or expired OTP';
  
        this.alert.error(msg);
      }
    });
  
  }
  
  openEmailVerification(email: string) {

    this.forgotPasswordEmail = email;
  
    this.isForgotPasswordMode.set(false);
    this.isEmailVerifyMode.set(true);
  
    this.isOtpStage.set(true);
    this.isResetStage.set(false);
  
    this.otp = '';
    this.errorMessage.set('');
  }

  onVerifyOtpClick() {

    if (this.isEmailVerifyMode()) {
      this.verifyEmailOtp();
    } else {
      this.verifyOtp();
    }
  
  }

  verifyEmailOtp() {

    this.errorMessage.set('');
  
    if (!this.otp || this.otp.length < 6) {
      this.errorMessage.set('Please enter 6 digit OTP');
      return;
    }
  
    this.forgotPasswordLoading.set(true);
  
    this.adminPostService.verifyEmailOtp(
      this.forgotPasswordEmail,
      this.otp
    )
    .pipe(
      finalize(() => this.forgotPasswordLoading.set(false))
    )
    .subscribe({
  
      next: () => {
  
        this.alert.success('Email verified successfully');
  
        this.isEmailVerifyMode.set(false);
        this.isForgotPasswordMode.set(false);
        this.isOtpStage.set(false);
  
        this.otp = '';
        this.forgotPasswordEmail = '';
  
        // back to login screen
        this.isLoginMode.set(true);
  
      },
  
      error: (err) => {
  
        const msg =
          err?.error?.message ||
          err?.message ||
          'Invalid or expired OTP';
  
        this.errorMessage.set(msg);
        this.alert.error(msg);
      }
  
    });
  
  }
  
  
  
}
