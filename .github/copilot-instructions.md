# Copilot Instructions for imagex-frontend

---
# Copilot Instructions for imagex-frontend

## Project Overview
- This is an Angular + Ionic application, using Capacitor for native integration.
- Main app code is in `src/app/`, with feature modules in subfolders (e.g., `home/`, `login/`, `layouts/`, `components/`, `core/`).
- The app uses OAuth2 authentication via `angular-oauth2-oidc` (see `core/auth.service.ts`).
- API calls are made through `core/api.service.ts`, which injects auth tokens from `AuthService`.
- The UI is built with Ionic components, using standalone Angular components and the latest Angular module system.

## Key Patterns & Conventions
- **Authentication:**
  - Use `AuthService` for login/logout and token management.
  - User info (name/email) is derived from `identityClaims` in `AuthService`.
- **API Access:**
  - Use `ApiService` for HTTP requests; it automatically attaches the bearer token.

## Modern Angular 20+ Examples
These are modern examples of how to write an Angular 20 component with signals:

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: '{{tag-name}}-root',
  templateUrl: '{{tag-name}}.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {{ClassName}} {
  protected readonly isServerRunning = signal(true);
  toggleServerStatus() {
    this.isServerRunning.update(isServerRunning => !isServerRunning);
  }
}
```

```css
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

    button {
        margin-top: 10px;
    }
}
```

```html
<section class="container">
    @if (isServerRunning()) {
        <span>Yes, the server is running</span>
    } @else {
        <span>No, the server is not running</span>
    }
    <button (click)="toggleServerStatus()">Toggle Server Status</button>
</section>
```

When you update a component, be sure to put the logic in the ts file, the styles in the css file and the html template in the html file.

## Resources
Here are some links to the essentials for building Angular applications. Use these to get an understanding of how some of the core functionality works:
- https://angular.dev/essentials/components
- https://angular.dev/essentials/signals
- https://angular.dev/essentials/templates
- https://angular.dev/essentials/dependency-injection

## Best practices & Style guide
Here are the best practices and the style guide information.

### Coding Style guide
- [Angular Style Guide](https://angular.dev/style-guide)

### TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices
- Always use standalone components over `NgModules`
- Do NOT set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead

### Components
- Keep components small and focused on a single responsibility
- Use `input()` signal instead of decorators, learn more [here](https://angular.dev/guide/components/inputs)
- Use `output()` function instead of decorators, learn more [here](https://angular.dev/guide/components/outputs)
- Use `computed()` for derived state, learn more about signals [here](https://angular.dev/guide/signals)
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead ([context](https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings))
- DO NOT use `ngStyle`, use `style` bindings instead ([context](https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings))

### State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Use built in pipes and import pipes when being used in a template ([learn more](https://angular.dev/guide/templates/pipes#))

### Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

---
  - API base URL is set via `environment.ts`.
- **Component Structure:**
  - Layouts (e.g., `main/`) use Ionic's split-pane and menu for navigation.
  - Modals (e.g., `workflow-modal`) are opened via method calls on child components using `@ViewChild` and a public `open()` method.
- **Icons:**
  - All icons used must be registered via `addIcons` from `ionicons` in the component constructor.
- **Styling:**
  - Global styles in `src/global.scss`, theme variables in `src/theme/variables.scss`.

## Developer Workflows
- **Start Dev Server:**
  - `npm start` or `ng serve` (see `package.json` scripts)
- **Build:**
  - `npm run build` or `ng build`
- **Test:**
  - `npm test` or `ng test` (uses Karma/Jasmine)
- **Lint:**
  - `npm run lint` or `ng lint` (uses ESLint)
- **Capacitor:**
  - Use Capacitor CLI for native builds/deploys (see `@capacitor/cli` in devDependencies)

## Integration Points
- **OAuth2:**
  - Configured via `environment.ts` and used in `AuthService`.
- **API:**
  - All HTTP requests go through `ApiService` for consistent auth and error handling.
- **Routing:**
  - Angular Router is used; routes are defined in `app.routes.ts`.

## Examples
- To open a modal from a parent component:
  ```typescript
  @ViewChild(WorkflowModalComponent) workflowModal!: WorkflowModalComponent;
  this.workflowModal.open();
  ```
- To make an authenticated API call:
  ```typescript
  this.apiService.get('endpoint').subscribe(...);
  ```

## File References
- `src/app/core/auth.service.ts` — Auth logic
- `src/app/core/api.service.ts` — API logic
- `src/app/layouts/main/main.component.ts` — Main layout and navigation
- `src/app/components/workflow-modal/workflow-modal.component.ts` — Example modal
- `src/environments/environment.ts` — Environment config

---
If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.
