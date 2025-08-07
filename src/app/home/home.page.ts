import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkflowModalComponent, Workflow } from '../components/workflow-modal/workflow-modal.component';
import { DynamicUIComponent, UISchema } from '../components/dynamic-ui/dynamic-ui.component';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonText, AlertController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkflowCacheService } from '../core/workflow-cache.service';
import { WorkflowUIService, JobResponse } from '../core/workflow-ui.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    IonButton, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonSpinner,
    IonText,
    ReactiveFormsModule, 
    WorkflowModalComponent, 
    DynamicUIComponent
  ],
})
export class HomePage {
  private readonly workflowCacheService = inject(WorkflowCacheService);
  private readonly workflowUIService = inject(WorkflowUIService);
  private readonly alertController = inject(AlertController);
  
  protected readonly selectedWorkflow = signal<Workflow | null>(null);
  protected readonly uiSchema = signal<UISchema | null>(null);
  protected readonly loadingSchema = signal(false);
  protected readonly executingWorkflow = signal(false);

  constructor() {
    // Carrega o último workflow selecionado ao inicializar
    const lastWorkflow = this.workflowCacheService.getLastWorkflow();
    this.selectedWorkflow.set(lastWorkflow);
    
    // Se há um workflow selecionado, carrega seu schema
    if (lastWorkflow) {
      this.loadUISchema(lastWorkflow.id);
    }
  }

  onWorkflowSelected(workflow: Workflow): void {
    console.log('[HomePage] Workflow selecionado:', workflow);
    this.selectedWorkflow.set(workflow);
    this.loadUISchema(workflow.id);
  }

  private loadUISchema(workflowId: string): void {
    this.loadingSchema.set(true);
    this.uiSchema.set(null);
    
    this.workflowUIService.getUISchema(workflowId).subscribe({
      next: (schema) => {
        console.log('[HomePage] UI Schema loaded:', schema);
        this.uiSchema.set(schema);
        this.loadingSchema.set(false);
      },
      error: (error) => {
        console.error('[HomePage] Error loading UI schema:', error);
        this.loadingSchema.set(false);
      }
    });
  }

  onFormSubmitted(formData: any): void {
    const workflow = this.selectedWorkflow();
    if (!workflow) {
      console.error('[HomePage] No workflow selected');
      return;
    }

    console.log('[HomePage] Form submitted:', formData);
    
    this.executingWorkflow.set(true);
    
    this.workflowUIService.executeWorkflow(workflow.id, formData).subscribe({
      next: (result: JobResponse) => {
        console.log('[HomePage] Workflow executed successfully:', result);
        this.executingWorkflow.set(false);
        
        // Mostra uma mensagem de sucesso simples
        this.showSuccessAlert('Sucesso!', 'O workflow foi executado com sucesso.');
      },
      error: (error) => {
        console.error('[HomePage] Error executing workflow:', error);
        this.executingWorkflow.set(false);
        
        // Mostra uma mensagem de erro
        this.showErrorAlert('Erro ao executar workflow', 'Ocorreu um erro ao criar o job. Tente novamente.');
      }
    });
  }

  private async showSuccessAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showErrorAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
