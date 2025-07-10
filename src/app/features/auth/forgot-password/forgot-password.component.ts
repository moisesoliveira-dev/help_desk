import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ThemeSelectorComponent } from '../../../shared/theme-selector/theme-selector.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
    CardComponent,
    ThemeSelectorComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl">
              <span class="text-2xl">🎧</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">HelpDesk Pro</h1>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          {{ emailSent ? 'Verifique seu e-mail' : 'Esqueceu sua senha?' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ emailSent 
            ? 'Enviamos instruções de recuperação para seu e-mail'
            : 'Digite seu e-mail para receber instruções de recuperação'
          }}
        </p>
      </div>

      <!-- Form -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <app-card [padding]="false">
          <div class="px-6 py-8">
            <!-- Email Sent State -->
            <div *ngIf="emailSent" class="text-center space-y-6">
              <!-- Success Icon -->
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 dark:bg-success-900/30">
                <span class="text-3xl">📧</span>
              </div>

              <!-- Message -->
              <div class="space-y-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Se o e-mail <strong>{{ submittedEmail }}</strong> estiver registrado em nosso sistema,
                  você receberá um link para redefinir sua senha em alguns minutos.
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  Verifique também sua pasta de spam.
                </p>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <app-button
                  [fullWidth]="true"
                  variant="outline"
                  (clicked)="goBackToForm()"
                >
                  Tentar outro e-mail
                </app-button>
                
                <app-button
                  [fullWidth]="true"
                  variant="ghost"
                  (clicked)="goToLogin()"
                >
                  Voltar ao login
                </app-button>
              </div>

              <!-- Resend Timer -->
              <div *ngIf="resendTimer > 0" class="text-center">
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  Reenviar e-mail em {{ resendTimer }}s
                </p>
              </div>
              
              <div *ngIf="resendTimer === 0" class="text-center">
                <button
                  type="button"
                  class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                  (click)="resendEmail()"
                  [disabled]="isResending"
                >
                  {{ isResending ? 'Reenviando...' : 'Reenviar e-mail' }}
                </button>
              </div>
            </div>

            <!-- Form State -->
            <form *ngIf="!emailSent" [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Email -->
              <app-input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail cadastrado"
                iconLeft="📧"
                [errorMessage]="getFieldError('email')"
                formControlName="email"
                [required]="true"
                helperText="Enviaremos instruções para este e-mail"
              ></app-input>

              <!-- Submit Button -->
              <app-button
                type="submit"
                [fullWidth]="true"
                [loading]="isLoading"
                [disabled]="forgotPasswordForm.invalid"
              >
                {{ isLoading ? 'Enviando...' : 'Enviar instruções' }}
              </app-button>

              <!-- Back to Login -->
              <div class="text-center">
                <a routerLink="/auth/login" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
                  ← Voltar ao login
                </a>
              </div>
            </form>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mt-4 p-3 bg-error-50 border border-error-200 rounded-md dark:bg-error-900/30 dark:border-error-800">
              <p class="text-sm text-error-600 dark:text-error-400">{{ errorMessage }}</p>
            </div>
          </div>
        </app-card>

        <!-- Theme Selector -->
        <div class="mt-6 flex justify-center">
          <app-theme-selector></app-theme-selector>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public forgotPasswordForm: FormGroup;
  public isLoading = false;
  public isResending = false;
  public errorMessage = '';
  public emailSent = false;
  public submittedEmail = '';
  public resendTimer = 0;
  private resendInterval?: number;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      if (errors) {
        if (errors['required']) {
          return 'Este campo é obrigatório';
        }
        if (errors['email']) {
          return 'E-mail inválido';
        }
      }
    }
    return '';
  }

  public onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this.forgotPasswordForm.value.email;

      // Simulação de envio de e-mail (posteriormente será conectado ao AuthService)
      setTimeout(() => {
        // Simulação - sempre "envia" o e-mail por questões de segurança
        this.submittedEmail = email;
        this.emailSent = true;
        this.startResendTimer();

        console.log('E-mail de recuperação enviado para:', email);
        this.isLoading = false;
      }, 1500);
    } else {
      // Marca todos os campos como tocados para mostrar erros
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        const control = this.forgotPasswordForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  public goBackToForm(): void {
    this.emailSent = false;
    this.submittedEmail = '';
    this.errorMessage = '';
    this.forgotPasswordForm.reset();
    this.stopResendTimer();
  }

  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  public resendEmail(): void {
    if (this.resendTimer > 0) return;

    this.isResending = true;
    this.errorMessage = '';

    // Simulação de reenvio
    setTimeout(() => {
      console.log('E-mail reenviado para:', this.submittedEmail);
      this.isResending = false;
      this.startResendTimer();
    }, 1000);
  }

  private startResendTimer(): void {
    this.resendTimer = 60; // 60 segundos
    this.resendInterval = window.setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.stopResendTimer();
      }
    }, 1000);
  }

  private stopResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = undefined;
    }
    this.resendTimer = 0;
  }

  ngOnDestroy(): void {
    this.stopResendTimer();
  }
}
