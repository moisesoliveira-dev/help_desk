import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
    <div class="space-y-1">
      <!-- Label -->
      <label
        *ngIf="label"
        [for]="inputId"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        [class.text-error-600]="hasError"
        [class.dark:text-error-400]="hasError"
      >
        {{ label }}
        <span *ngIf="required" class="text-error-500 ml-1">*</span>
      </label>

      <!-- Input Container -->
      <div class="relative">
        <!-- Icon Left -->
        <div
          *ngIf="iconLeft"
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span [innerHTML]="iconLeft" class="text-gray-400 dark:text-gray-500"></span>
        </div>

        <!-- Input -->
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [class]="inputClasses"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [attr.aria-invalid]="hasError"
          [attr.aria-describedby]="hasError ? inputId + '-error' : null"
        />

        <!-- Icon Right -->
        <div
          *ngIf="iconRight"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
          [class.pointer-events-none]="!iconRightClickable"
        >
          <span
            [innerHTML]="iconRight"
            class="text-gray-400 dark:text-gray-500"
            [class.cursor-pointer]="iconRightClickable"
            [class.hover:text-gray-600]="iconRightClickable"
            [class.dark:hover:text-gray-300]="iconRightClickable"
            (click)="onIconRightClick()"
          ></span>
        </div>

        <!-- Loading Spinner -->
        <div
          *ngIf="loading"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      </div>

      <!-- Helper Text -->
      <p
        *ngIf="helperText && !hasError"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        {{ helperText }}
      </p>

      <!-- Error Message -->
      <p
        *ngIf="errorMessage && hasError"
        [id]="inputId + '-error'"
        class="text-sm text-error-600 dark:text-error-400"
      >
        {{ errorMessage }}
      </p>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() type: InputType = 'text';
    @Input() size: InputSize = 'md';
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() required = false;
    @Input() loading = false;
    @Input() iconLeft?: string;
    @Input() iconRight?: string;
    @Input() iconRightClickable = false;
    @Input() helperText?: string;
    @Input() errorMessage?: string;

    @Output() valueChange = new EventEmitter<string>();
    @Output() focusEvent = new EventEmitter<void>();
    @Output() blurEvent = new EventEmitter<void>();
    @Output() iconRightClicked = new EventEmitter<void>();

    public value = '';
    public inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

    // ControlValueAccessor
    private onChange = (value: string) => { };
    private onTouched = () => { };

    public get hasError(): boolean {
        return !!this.errorMessage;
    }

    public get inputClasses(): string {
        const baseClasses = [
            'block',
            'w-full',
            'border',
            'rounded-lg',
            'transition-colors',
            'duration-200',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-offset-2',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
            'dark:bg-gray-700',
            'dark:border-gray-600',
            'dark:text-white',
            'dark:placeholder-gray-400'
        ];

        // Size classes
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-3 py-2 text-sm',
            lg: 'px-4 py-3 text-base'
        };
        baseClasses.push(sizeClasses[this.size]);

        // Icon padding
        if (this.iconLeft) {
            const iconPadding = {
                sm: 'pl-8',
                md: 'pl-10',
                lg: 'pl-12'
            };
            baseClasses.push(iconPadding[this.size]);
        }

        if (this.iconRight || this.loading) {
            const iconPadding = {
                sm: 'pr-8',
                md: 'pr-10',
                lg: 'pr-12'
            };
            baseClasses.push(iconPadding[this.size]);
        }

        // State classes
        if (this.hasError) {
            baseClasses.push(
                'border-error-500',
                'focus:ring-error-500',
                'focus:border-error-500'
            );
        } else {
            baseClasses.push(
                'border-gray-300',
                'focus:ring-primary-500',
                'focus:border-primary-500',
                'dark:focus:ring-primary-400',
                'dark:focus:border-primary-400'
            );
        }

        return baseClasses.join(' ');
    }

    public onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    public onBlur(): void {
        this.onTouched();
        this.blurEvent.emit();
    }

    public onFocus(): void {
        this.focusEvent.emit();
    }

    public onIconRightClick(): void {
        if (this.iconRightClickable) {
            this.iconRightClicked.emit();
        }
    }

    // ControlValueAccessor implementation
    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}