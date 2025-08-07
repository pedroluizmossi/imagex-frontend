import { ChangeDetectionStrategy, Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonLabel,
  IonRange,
  IonNote
} from '@ionic/angular/standalone';
import { ApiService } from '../../core/api.service';

export interface UISchema {
  type: string;
  properties: { [key: string]: PropertySchema };
  required?: string[];
}

export interface PropertySchema {
  type: string;
  title?: string;
  description?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  order?: number;
  ui?: {
    component?: 'textarea' | 'number' | 'slider' | 'text';
    placeholder?: string;
    step?: number;
  };
}

@Component({
  selector: 'dynamic-ui',
  templateUrl: './dynamic-ui.component.html',
  styleUrls: ['./dynamic-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonLabel,
    IonRange,
    IonNote
  ],
})
export class DynamicUIComponent {
  public readonly workflowId = input<string>('');
  public readonly schema = input<UISchema | null>(null);
  public readonly disabled = input<boolean>(false);
  
  public readonly formSubmitted = output<any>();
  
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  
  protected readonly loading = signal(false);
  protected readonly form = signal<FormGroup | null>(null);
  
  protected readonly schemaProperties = computed(() => {
    const schema = this.schema();
    if (!schema) return [];
    
    // Cria array de objetos com chave e order para ordenação
    const properties = Object.keys(schema.properties).map(key => ({
      key,
      order: schema.properties[key].order ?? 999 // Se não tem order, coloca no final
    }));
    
    // Ordena por order e retorna apenas as chaves
    return properties
      .sort((a, b) => a.order - b.order)
      .map(prop => prop.key);
  });

  constructor() {
    // Observa mudanças no schema para recriar o formulário
    effect(() => {
      const schema = this.schema();
      this.createForm();
    });

    // Observa mudanças no disabled para habilitar/desabilitar o form
    effect(() => {
      const disabled = this.disabled();
      const form = this.form();
      if (form) {
        if (disabled) {
          form.disable();
        } else {
          form.enable();
          this.loading.set(false);
        }
      }
    });
  }

  private createForm(): void {
    const schema = this.schema();
    if (!schema) {
      this.form.set(null);
      return;
    }

    const formControls: { [key: string]: any } = {};
    
    // Sempre adicionar o campo folderId como obrigatório
    formControls['folderId'] = ['', Validators.required];
    
    Object.keys(schema.properties).forEach(key => {
      // Pular folderId se estiver no schema, pois já foi adicionado acima
      if (key === 'folderId') return;
      
      const property = schema.properties[key];
      const isRequired = schema.required?.includes(key) || false;
      const defaultValue = property.default ?? '';
      
      const validators = [];
      if (isRequired) {
        validators.push(Validators.required);
      }
      
      if (property.type === 'integer' && property.minimum !== undefined) {
        validators.push(Validators.min(property.minimum));
      }
      
      if (property.type === 'integer' && property.maximum !== undefined) {
        validators.push(Validators.max(property.maximum));
      }
      
      formControls[key] = [defaultValue, validators];
    });

    const newForm = this.formBuilder.group(formControls);
    this.form.set(newForm);
  }

  getPropertyType(propertyKey: string): string {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.type || 'string';
  }

  getPropertyTitle(propertyKey: string): string {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.title || propertyKey;
  }

  getPropertyDescription(propertyKey: string): string {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.description || '';
  }

  getPropertyMinimum(propertyKey: string): number | undefined {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.minimum;
  }

  getPropertyMaximum(propertyKey: string): number | undefined {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.maximum;
  }

  getPropertyOrder(propertyKey: string): number {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.order ?? 999;
  }

  getPropertyPlaceholder(propertyKey: string): string {
    const schema = this.schema();
    const property = schema?.properties[propertyKey];
    
    // Se tem placeholder customizado, usa ele
    if (property?.ui?.placeholder) {
      return property.ui.placeholder;
    }
    
    // Fallback para o título da propriedade
    return this.getPropertyTitle(propertyKey);
  }

  getPropertyStep(propertyKey: string): number | undefined {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.ui?.step;
  }

  getUIComponent(propertyKey: string): string {
    const schema = this.schema();
    return schema?.properties[propertyKey]?.ui?.component || 'text';
  }

  isRequired(propertyKey: string): boolean {
    const schema = this.schema();
    return schema?.required?.includes(propertyKey) || false;
  }

  isTextArea(propertyKey: string): boolean {
    const schema = this.schema();
    const property = schema?.properties[propertyKey];
    
    // Verifica se o component UI é textarea
    if (property?.ui?.component === 'textarea') {
      return true;
    }
    
    // Fallback para o comportamento anterior (prompt no nome ou description)
    const description = this.getPropertyDescription(propertyKey).toLowerCase();
    const title = this.getPropertyTitle(propertyKey).toLowerCase();
    return propertyKey.toLowerCase().includes('prompt') || 
           description.includes('prompt') || 
           title.includes('prompt');
  }

  isRangeInput(propertyKey: string): boolean {
    const schema = this.schema();
    const property = schema?.properties[propertyKey];
    
    // Verifica se o component UI é slider
    if (property?.ui?.component === 'slider') {
      return true;
    }
    
    // Fallback para o comportamento anterior (integer com min/max)
    return property?.type === 'integer' && 
           property.minimum !== undefined && 
           property.maximum !== undefined;
  }

  onSubmit(): void {
    const form = this.form();
    if (!form || form.invalid || form.disabled) {
      console.error('[DynamicUI] Form is invalid or disabled');
      return;
    }

    this.loading.set(true);
    const formData = form.value;
    
    console.log('[DynamicUI] Submitting form:', formData);
    this.formSubmitted.emit(formData);
  }

  onReset(): void {
    const form = this.form();
    if (form) {
      form.reset();
      // Limpar explicitamente o folderId também
      form.get('folderId')?.setValue('');
      this.createForm(); // Recriar o form com valores default
    }
  }

  getFormControl(propertyKey: string) {
    const form = this.form();
    return form?.get(propertyKey);
  }

  isFieldInvalid(propertyKey: string): boolean {
    const control = this.getFormControl(propertyKey);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getFieldErrorMessage(propertyKey: string): string {
    const control = this.getFormControl(propertyKey);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      if (propertyKey === 'folderId') {
        return 'ID da pasta é obrigatório';
      }
      return `${this.getPropertyTitle(propertyKey)} é obrigatório`;
    }
    
    if (control.errors['min']) {
      return `Valor mínimo: ${control.errors['min'].min}`;
    }
    
    if (control.errors['max']) {
      return `Valor máximo: ${control.errors['max'].max}`;
    }

    return 'Campo inválido';
  }
}
