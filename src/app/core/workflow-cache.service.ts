import { Injectable, signal } from '@angular/core';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  workflowType: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowCacheService {
  private readonly LAST_WORKFLOW_KEY = 'lastSelectedWorkflow';
  private readonly lastWorkflow = signal<Workflow | null>(null);

  constructor() {
    this.loadLastWorkflow();
  }

  /**
   * Carrega o último workflow do localStorage
   */
  private loadLastWorkflow(): void {
    try {
      const stored = localStorage.getItem(this.LAST_WORKFLOW_KEY);
      if (stored) {
        const workflow = JSON.parse(stored) as Workflow;
        this.lastWorkflow.set(workflow);
        console.log('[WorkflowCache] Último workflow carregado:', workflow);
      }
    } catch (error) {
      console.error('[WorkflowCache] Erro ao carregar último workflow:', error);
      localStorage.removeItem(this.LAST_WORKFLOW_KEY);
    }
  }

  /**
   * Salva o workflow selecionado como último usado
   */
  setLastWorkflow(workflow: Workflow): void {
    try {
      localStorage.setItem(this.LAST_WORKFLOW_KEY, JSON.stringify(workflow));
      this.lastWorkflow.set(workflow);
      console.log('[WorkflowCache] Último workflow salvo:', workflow);
    } catch (error) {
      console.error('[WorkflowCache] Erro ao salvar último workflow:', error);
    }
  }

  /**
   * Retorna o último workflow selecionado
   */
  getLastWorkflow(): Workflow | null {
    return this.lastWorkflow();
  }

  /**
   * Signal reativo do último workflow
   */
  getLastWorkflowSignal() {
    return this.lastWorkflow.asReadonly();
  }

  /**
   * Remove o último workflow do cache
   */
  clearLastWorkflow(): void {
    localStorage.removeItem(this.LAST_WORKFLOW_KEY);
    this.lastWorkflow.set(null);
    console.log('[WorkflowCache] Cache do último workflow limpo');
  }
}