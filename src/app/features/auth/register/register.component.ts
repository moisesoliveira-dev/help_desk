import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ThemeSelectorComponent } from '../../../shared/theme-selector/theme-selector.component';

// Custom Validators
function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

function strongPasswordValidator(control: AbstractControl) {
  const value = control.value;
  if (!value) return null;
  
  const hasNumber = /[0-9]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[#?!@$%^&*-]/.test(value);
  
  const valid = hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8;
  
  if (!valid) {
    return { strongPassword: true };
  }
  
  return null;
}

@Component({
  selector: 'app-register',
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
          Crie sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <a routerLink="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            faça login em sua conta existente
          </a>
        </p>
      </div>

      <!-- Form -->
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <app-card [padding]="false">
          <div class="px-6 py-8">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Name Fields -->
              <div class="grid grid-cols-2 gap-4">
                <app-input
                  label="Nome"
                  placeholder="João"
                  iconLeft="👤"
                  [errorMessage]="getFieldError('firstName')"
                  formControlName="firstName"
                  [required]="true"
                ></app-input>

                <app-input
                  label="Sobrenome"
                  placeholder="Silva"
                  iconLeft="👤"
                  [errorMessage]="getFieldError('lastName')"
                  formControlName="lastName"
                  [required]="true"
                ></app-input>
              </div>

              <!-- Email -->
              <app-input
                label="E-mail"
                type="email"
                placeholder="seu&#64;email.com"
                iconLeft="📧"
                [errorMessage]="getFieldError('email')"
                formControlName="email"
                [required]="true"
              ></app-input>

              <!-- Password -->
              <app-input
                label="Senha"
                [type]="showPassword ? 'text' : 'password'"
                placeholder="Digite uma senha forte"
                iconLeft="🔒"
                [iconRight]="showPassword ? '🙈' : '👁️'"
                [iconRightClickable]="true"
                [errorMessage]="getFieldError('password')"
                formControlName="password"
                [required]="true"
                (iconRightClicked)="togglePasswordVisibility()"
              ></app-input>

              <!-- Password Strength Indicator -->
              <div *ngIf="registerForm.get('password')?.value" class="space-y-2">
                <div class="text-xs text-gray-600 dark:text-gray-400">Força da senha:</div>
                <div class="flex space-x-1">
                  <div class="flex-1 h-2 rounded" [class]="getPasswordStrengthColor(0)"></div>
                  <div class="flex-1 h-2 rounded" [class]="getPasswordStrengthColor(1)"></div>
                  <div class="flex-1 h-2 rounded" [class]="getPasswordStrengthColor(2)"></div>
                  <div class="flex-1 h-2 rounded" [class]="getPasswordStrengthColor(3)"></div>
                </div>
                <div class="text-xs" [class]="getPasswordStrengthTextColor()">
                  {{ getPasswordStrengthText() }}
                </div>
              </div>

              <!-- Confirm Password -->
              <app-input
                label="Confirmar Senha"
                [type]="showConfirmPassword ? 'text' : 'password'"
                placeholder="Digite a senha novamente"
                iconLeft="🔒"
                [iconRight]="showConfirmPassword ? '🙈' : '👁️'"
                [iconRightClickable]="true"
                [errorMessage]="getFieldError('confirmPassword')"
                formControlName="confirmPassword"
                [required]="true"
                (iconRightClicked)="toggleConfirmPasswordVisibility()"
              ></app-input>

              <!-- Terms & Conditions -->
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    formControlName="acceptTerms"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="acceptTerms" class="text-gray-700 dark:text-gray-300">
                    Eu aceito os
                    <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Termos de Serviço
                    </a>
                    e a
                    <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Política de Privacidade
                    </a>
                  </label>
                  <div *ngIf="getFieldError('acceptTerms')" class="text-error-600 dark:text-error-400 text-xs mt-1">
                    {{ getFieldError('acceptTerms') }}
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <app-button
                type="submit"
                [fullWidth]="true"
                [loading]="isLoading"
                [disabled]="registerForm.invalid"
              >
                {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
              </app-button>
            </form>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mt-4 p-3 bg-error-50 border border-error-200 rounded-md dark:bg-error-900/30 dark:border-error-800">
              <p class="text-sm text-error-600 dark:text-error-400">{{ errorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="mt-4 p-3 bg-success-50 border border-success-200 rounded-md dark:bg-success-900/30 dark:border-success-800">
              <p class="text-sm text-success-600 dark:text-success-400">{{ successMessage }}</p>
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public registerForm: FormGroup;
  public isLoading = false;
  public showPassword = false;
  public showConfirmPassword = false;
  public errorMessage = '';
  public successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: passwordMatchValidator });
  }

  public getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      if (errors) {
        if (errors['required']) {
          return 'Este campo é obrigatório';
        }
        if (errors['requiredTrue']) {
          return 'Você deve aceitar os termos de serviço';
        }
        if (errors['email']) {
          return 'E-mail inválido';
        }
        if (errors['minlength']) {
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
        }
        if (errors['strongPassword']) {
          return 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial';
        }
      }
    }

    // Check for password mismatch at form level
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch']) {
      const confirmField = this.registerForm.get('confirmPassword');
      if (confirmField && (confirmField.dirty || confirmField.touched)) {
        return 'As senhas não coincidem';
      }
    }

    return '';
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  public getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    if (!password) return 0;

    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[#?!@$%^&*-]/.test(password)) strength++;

    return Math.min(strength, 4);
  }

  public getPasswordStrengthColor(index: number): string {
    const strength = this.getPasswordStrength();
    const baseClass = 'bg-gray-200 dark:bg-gray-600';
    
    if (index >= strength) return baseClass;
    
    if (strength <= 1) return 'bg-error-500';
    if (strength === 2) return 'bg-warning-500';
    if (strength === 3) return 'bg-warning-400';
    return 'bg-success-500';
  }

  public getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
    return texts[strength] || '';
  }

  public getPasswordStrengthTextColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 1) return 'text-error-600 dark:text-error-400';
    if (strength === 2) return 'text-warning-600 dark:text-warning-400';
    if (strength === 3) return 'text-warning-500 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  }

  public onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      
      // Simulação de registro (posteriormente será conectado ao AuthService)
      setTimeout(() => {
        // Simulação de verificação se e-mail já existe
        const existingEmails = ['admin@helpdesk.com', 'agent@helpdesk.com', 'user@helpdesk.com'];
        
        if (existingEmails.includes(formValue.email)) {
          this.errorMessage = 'Este e-mail já está sendo usado. Escolha outro e-mail ou faça login.';
        } else {
          // Registro bem-sucedido
          this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
          console.log('Registro realizado com sucesso:', formValue);
          
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        }
        
        this.isLoading = false;
      }, 1500);
    } else {
      // Marca todos os campos como tocados para mostrar erros
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
