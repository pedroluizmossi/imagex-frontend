import { ChangeDetectionStrategy, Component, signal, input, output } from '@angular/core';
import { IonModal, IonList, IonItem, IonButton, ModalController, IonButtons, IonBadge } from "@ionic/angular/standalone";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";
import { inject } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { WorkflowCacheService } from '../../core/workflow-cache.service';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  workflowType: string;
}

@Component({
  selector: 'workflow-modal',
  templateUrl: './workflow-modal.component.html',
  styleUrls: ['./workflow-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButtons,
    IonButton,
    IonItem,
    IonList,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBadge
  ],
})
export class WorkflowModalComponent {
  protected readonly workflows = signal<Workflow[]>([]);
  public readonly workflowType = input<string>('');
  protected readonly loading = signal(false);
  protected readonly page = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalElements = signal(0);
  
  // Output para notificar quando um workflow for selecionado
  public readonly workflowSelected = output<Workflow>();
  
  private readonly apiService = inject(ApiService);
  private readonly workflowCacheService = inject(WorkflowCacheService);


  constructor(private modalCtrl: ModalController) {}

  refresh() {
    this.fetchWorkflows();
  }

  open() {
    console.log('[WorkflowModal] open() called');
    this.page.set(0);
    this.fetchWorkflows();
    this.modalCtrl.create({
      component: WorkflowModalComponent,
      componentProps: {
        workflowType: this.workflowType(),
      },
    }).then(modal => {
      console.log('[WorkflowModal] modal presented');
      modal.present();
    });
  }

  fetchWorkflows() {
    const url = `api/v1/workflows?page=${this.page()}&size=${this.pageSize()}`;
    console.log('[WorkflowModal] fetchWorkflows() called, url:', url);
    this.loading.set(true);
    this.apiService.get<{ content: Workflow[], totalElements: number }>(url)
      .subscribe({
        next: resp => {
          console.log('[WorkflowModal] fetchWorkflows() success:', resp);
          this.workflows.set(resp.content.filter(w => w.workflowType === this.workflowType()));
          this.totalElements.set(resp.totalElements);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('[WorkflowModal] fetchWorkflows() error:', err);
          this.workflows.set([]);
          this.loading.set(false);
        }
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  /**
   * Seleciona um workflow e salva como último usado
   */
  selectWorkflow(workflow: Workflow): void {
    console.log('[WorkflowModal] Workflow selecionado:', workflow);
    
    // Salva o workflow no cache
    this.workflowCacheService.setLastWorkflow(workflow);
    
    // Emite o evento para o componente pai
    this.workflowSelected.emit(workflow);
    
    // Fecha o modal
    this.close();
  }

  /**
   * Verifica se um workflow é o último selecionado
   */
  isLastSelected(workflow: Workflow): boolean {
    const lastWorkflow = this.workflowCacheService.getLastWorkflow();
    return lastWorkflow?.id === workflow.id;
  }

  get filteredWorkflows() {
    return this.workflows().filter(w => w.workflowType === this.workflowType());
  }
}
