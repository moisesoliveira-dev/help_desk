import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ThemeSelectorComponent } from '../../../shared/theme-selector/theme-selector.component';

@Component({
  selector: 'app-login',
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
          Acesse sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <a routerLink="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            crie uma nova conta
          </a>
        </p>
      </div>

      <!-- Form -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <app-card [padding]="false">
          <div class="px-6 py-8">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Email -->
              <app-input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                iconLeft="📧"
                [errorMessage]="getFieldError('email')"
                formControlName="email"
                [required]="true"
              ></app-input>

              <!-- Password -->
              <app-input
                label="Senha"
                [type]="showPassword ? 'text' : 'password'"
                placeholder="Digite sua senha"
                iconLeft="🔒"
                [iconRight]="showPassword ? '🙈' : '👁️'"
                [iconRightClickable]="true"
                [errorMessage]="getFieldError('password')"
                formControlName="password"
                [required]="true"
                (iconRightClicked)="togglePasswordVisibility()"
              ></app-input>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    formControlName="rememberMe"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label for="rememberMe" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Lembrar de mim
                  </label>
                </div>

                <div class="text-sm">
                  <a routerLink="/auth/forgot-password" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <!-- Submit Button -->
              <app-button
                type="submit"
                [fullWidth]="true"
                [loading]="isLoading"
                [disabled]="loginForm.invalid"
              >
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
              </app-button>
            </form>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mt-4 p-3 bg-error-50 border border-error-200 rounded-md dark:bg-error-900/30 dark:border-error-800">
              <p class="text-sm text-error-600 dark:text-error-400">{{ errorMessage }}</p>
            </div>

            <!-- Demo Credentials -->
            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/30 dark:border-blue-800">
              <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Credenciais de Demonstração:</h4>
              <div class="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                <p><strong>Admin:</strong> admin&#64;helpdesk.com / admin123</p>
                <p><strong>Agente:</strong> agent&#64;helpdesk.com / agent123</p>
                <p><strong>Usuário:</strong> user&#64;helpdesk.com / user123</p>
              </div>
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public loginForm: FormGroup;
  public isLoading = false;
  public showPassword = false;
  public errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  public getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      if (errors) {
        if (errors['required']) {
          return 'Este campo é obrigatório';
        }
        if (errors['email']) {
          return 'E-mail inválido';
        }
        if (errors['minlength']) {
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
        }
      }
    }
    return '';
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.loginForm.value;

      // Simulação de autenticação (posteriormente será conectado ao AuthService)
      setTimeout(() => {
        const { email, password } = formValue;

        // Credenciais de demonstração
        const validCredentials = [
          { email: 'admin@helpdesk.com', password: 'admin123', role: 'admin' },
          { email: 'agent@helpdesk.com', password: 'agent123', role: 'agent' },
          { email: 'user@helpdesk.com', password: 'user123', role: 'user' }
        ];

        const validUser = validCredentials.find(
          cred => cred.email === email && cred.password === password
        );

        if (validUser) {
          // Login bem-sucedido
          console.log('Login realizado com sucesso:', formValue);
          this.router.navigate(['/dashboard']);
        } else {
          // Credenciais inválidas
          this.errorMessage = 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
        }

        this.isLoading = false;
      }, 1500);
    } else {
      // Marca todos os campos como tocados para mostrar erros
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
