# 🎯 HelpDesk Pro

Sistema completo de helpdesk desenvolvido com Angular 19 e TailwindCSS.

## 🚀 Tecnologias

- **Angular 19** - Framework frontend
- **TailwindCSS** - Framework CSS utilitário
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 📋 Pré-requisitos

- Node.js (v18+)
- npm ou yarn
- Angular CLI

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Aplicação estará disponível em http://localhost:4200
```

## 📜 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm test` - Executa testes unitários
- `npm run lint` - Verifica qualidade do código
- `npm run format` - Formata o código

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/          # Serviços singleton e guards
│   ├── shared/        # Componentes, pipes e diretivas compartilhadas
│   ├── features/      # Módulos de funcionalidades
│   ├── layout/        # Componentes de layout
│   └── app.component.* # Componente raiz
├── environments/      # Configurações de ambiente
└── styles.scss       # Estilos globais
```

## 🎨 Design System

Este projeto utiliza TailwindCSS com um design system customizado incluindo:

- Paleta de cores personalizada
- Componentes reutilizáveis
- Sistema de theming (dark/light mode)
- Responsividade mobile-first

## 📊 Status do Projeto

- [x] **Fase 1.1** - Configuração do ambiente
- [ ] **Fase 1.2** - Layout base e navegação
- [ ] **Fase 1.3** - Sistema de theming

## 🤝 Contribuição

Este é um projeto de aprendizado. Siga as convenções estabelecidas e mantenha a qualidade do código.

## 📄 Licença

MIT License

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
