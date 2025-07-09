import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ThemeSelectorComponent } from '../../shared/theme-selector/theme-selector.component';

@Component({
    selector: 'app-theme-showcase',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        InputComponent,
        CardComponent,
        ThemeSelectorComponent
    ],
    template: `
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sistema de Design - HelpDesk Pro
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Demonstração dos componentes base com suporte a temas
        </p>
        <div class="mt-4 flex justify-center">
          <app-theme-selector></app-theme-selector>
        </div>
      </div>

      <!-- Botões -->
      <app-card title="Componentes de Botão" subtitle="Diferentes variantes e estados">
        <div class="space-y-4">
          <!-- Variantes -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Variantes</h4>
            <div class="flex flex-wrap gap-3">
              <app-button variant="primary">Primary</app-button>
              <app-button variant="secondary">Secondary</app-button>
              <app-button variant="outline">Outline</app-button>
              <app-button variant="ghost">Ghost</app-button>
              <app-button variant="danger">Danger</app-button>
            </div>
          </div>

          <!-- Tamanhos -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tamanhos</h4>
            <div class="flex flex-wrap items-center gap-3">
              <app-button size="sm">Small</app-button>
              <app-button size="md">Medium</app-button>
              <app-button size="lg">Large</app-button>
            </div>
          </div>

          <!-- Estados -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estados</h4>
            <div class="flex flex-wrap gap-3">
              <app-button iconLeft="📧">Com Ícone</app-button>
              <app-button [loading]="true">Carregando</app-button>
              <app-button [disabled]="true">Desabilitado</app-button>
              <app-button [fullWidth]="true" class="max-w-xs">Full Width</app-button>
            </div>
          </div>
        </div>
      </app-card>

      <!-- Inputs -->
      <app-card title="Componentes de Input" subtitle="Campos de entrada com validação">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <app-input
              label="Nome Completo"
              placeholder="Digite seu nome"
              iconLeft="👤"
              helperText="Este campo é obrigatório"
              [required]="true"
            ></app-input>

            <app-input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              iconLeft="📧"
            ></app-input>

            <app-input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              iconLeft="🔒"
              iconRight="👁️"
              [iconRightClickable]="true"
            ></app-input>
          </div>

          <div class="space-y-4">
            <app-input
              label="Buscar"
              type="search"
              placeholder="Buscar tickets..."
              iconLeft="🔍"
              size="lg"
            ></app-input>

            <app-input
              label="Campo com Erro"
              placeholder="Campo inválido"
              errorMessage="Este campo contém um erro"
              iconLeft="⚠️"
            ></app-input>

            <app-input
              label="Campo Carregando"
              placeholder="Verificando..."
              [loading]="true"
              iconLeft="📁"
            ></app-input>
          </div>
        </div>
      </app-card>

      <!-- Cards -->
      <app-card title="Componentes de Card" subtitle="Containers flexíveis para conteúdo">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card Default -->
          <app-card title="Card Padrão" subtitle="Estilo padrão com borda">
            <p class="text-gray-600 dark:text-gray-300">
              Este é um card com o estilo padrão. Inclui título, subtítulo e conteúdo.
            </p>
            <div slot="footer" class="flex justify-end space-x-2">
              <app-button variant="ghost" size="sm">Cancelar</app-button>
              <app-button size="sm">Confirmar</app-button>
            </div>
          </app-card>

          <!-- Card Elevated -->
          <app-card 
            title="Card Elevado" 
            subtitle="Com sombra" 
            variant="elevated"
            [hoverable]="true"
          >
            <p class="text-gray-600 dark:text-gray-300">
              Card com sombra que aumenta no hover.
            </p>
          </app-card>

          <!-- Card Outlined -->
          <app-card 
            title="Card Outlined" 
            subtitle="Borda destacada" 
            variant="outlined"
            [clickable]="true"
          >
            <p class="text-gray-600 dark:text-gray-300">
              Card clicável com borda destacada.
            </p>
          </app-card>
        </div>
      </app-card>

      <!-- Paleta de Cores -->
      <app-card title="Paleta de Cores" subtitle="Cores do sistema com suporte a tema escuro">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Primary -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Primary</h4>
            <div class="space-y-2">
              <div class="h-12 bg-primary-500 rounded flex items-center justify-center text-white text-sm font-medium">500</div>
              <div class="h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs">600</div>
              <div class="h-8 bg-primary-700 rounded flex items-center justify-center text-white text-xs">700</div>
            </div>
          </div>

          <!-- Success -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Success</h4>
            <div class="space-y-2">
              <div class="h-12 bg-success-500 rounded flex items-center justify-center text-white text-sm font-medium">500</div>
              <div class="h-8 bg-success-600 rounded flex items-center justify-center text-white text-xs">600</div>
              <div class="h-8 bg-success-700 rounded flex items-center justify-center text-white text-xs">700</div>
            </div>
          </div>

          <!-- Warning -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Warning</h4>
            <div class="space-y-2">
              <div class="h-12 bg-warning-500 rounded flex items-center justify-center text-white text-sm font-medium">500</div>
              <div class="h-8 bg-warning-600 rounded flex items-center justify-center text-white text-xs">600</div>
              <div class="h-8 bg-warning-700 rounded flex items-center justify-center text-white text-xs">700</div>
            </div>
          </div>

          <!-- Error -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Error</h4>
            <div class="space-y-2">
              <div class="h-12 bg-error-500 rounded flex items-center justify-center text-white text-sm font-medium">500</div>
              <div class="h-8 bg-error-600 rounded flex items-center justify-center text-white text-xs">600</div>
              <div class="h-8 bg-error-700 rounded flex items-center justify-center text-white text-xs">700</div>
            </div>
          </div>
        </div>
      </app-card>

      <!-- Tipografia -->
      <app-card title="Tipografia" subtitle="Escalas de texto e hierarquia">
        <div class="space-y-4">
          <div class="text-4xl font-bold text-gray-900 dark:text-white">Heading 1 - 4xl Bold</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white">Heading 2 - 3xl Bold</div>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">Heading 3 - 2xl Semibold</div>
          <div class="text-xl font-semibold text-gray-900 dark:text-white">Heading 4 - xl Semibold</div>
          <div class="text-lg font-medium text-gray-900 dark:text-white">Heading 5 - lg Medium</div>
          <div class="text-base text-gray-700 dark:text-gray-300">Body Text - base Regular</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Small Text - sm Regular</div>
          <div class="text-xs text-gray-500 dark:text-gray-500">Caption - xs Regular</div>
        </div>
      </app-card>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class ThemeShowcaseComponent { }