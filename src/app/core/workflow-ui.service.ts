import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UISchema } from '../components/dynamic-ui/dynamic-ui.component';

export interface JobRequest {
  workflowId: string;
  folderId: string;
  parameters: JobParameter[];
}

export interface JobParameter {
  name: string;
  value: string;
}

export interface JobResponse {
  id: string;
  status: string;
  workflow: WorkflowInfo;
  model: ModelInfo;
  parameters: JobParameter[];
  workflowJson: string;
  createdAt: string;
  updatedAt: string;
  assets: AssetInfo[];
}

export interface WorkflowInfo {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  workflowType: string;
  defaultModel: ModelInfo;
  inputParameters: InputParameter[];
  workflowJson: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  osPath: string;
  enabled: boolean;
  workflowType: string;
  modelType: string;
  inputParameters: InputParameter[];
  createdAt: string;
  updatedAt: string;
}

export interface InputParameter {
  name: string;
  type: string;
  value: string;
  required: boolean;
}

export interface AssetInfo {
  id: string;
  name: string;
  description: string;
  assetType: string;
  assetUrl: string;
  thumbnailUrl: string;
  metadata: string;
  userId: string;
  userEmail: string;
  folderId: string;
  folderName: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowUIService {
  private readonly apiService = inject(ApiService);
  private readonly cachedSchemas = new Map<string, UISchema>();
  
  /**
   * Busca o schema de UI para um workflow específico
   */
  getUISchema(workflowId: string): Observable<UISchema> {
    // Verifica se já está em cache
    if (this.cachedSchemas.has(workflowId)) {
      return new Observable(observer => {
        observer.next(this.cachedSchemas.get(workflowId)!);
        observer.complete();
      });
    }

    // Busca da API
    return new Observable(observer => {
      this.apiService.get<UISchema>(`api/v1/workflows/${workflowId}/ui-schema`)
        .subscribe({
          next: (schema) => {
            // Salva no cache
            this.cachedSchemas.set(workflowId, schema);
            observer.next(schema);
            observer.complete();
          },
          error: (error) => {
            console.error('[WorkflowUIService] Error loading UI schema:', error);
            observer.error(error);
          }
        });
    });
  }

  /**
   * Executa um workflow criando um job
   */
  executeWorkflow(workflowId: string, formData: any, folderId?: string): Observable<JobResponse> {
    // Extrai o folderId do formData, se não foi fornecido como parâmetro separado
    const folderIdToUse = folderId || formData.folderId;
    
    // Valida se o folderId foi fornecido
    if (!folderIdToUse) {
      throw new Error('FolderId is required');
    }
    
    // Converte os dados do formulário para o formato esperado pela API
    // Remove o folderId dos parâmetros, pois ele é tratado separadamente
    // Também filtra valores vazios/nulos
    const parameters = Object.keys(formData)
      .filter(key => key !== 'folderId') // Filtrar o folderId dos parâmetros
      .filter(key => formData[key] !== null && formData[key] !== undefined && formData[key] !== '') // Filtrar valores vazios
      .map(key => ({
        name: key,
        value: String(formData[key]).trim() // Remove espaços desnecessários
      }));

    const jobRequest: JobRequest = {
      workflowId,
      folderId: folderIdToUse,
      parameters
    };

    console.log('[WorkflowUIService] Job request:', jobRequest);
    return this.apiService.post<JobResponse>('api/v1/jobs', jobRequest);
  }

  /**
   * Limpa o cache de schemas
   */
  clearCache(): void {
    this.cachedSchemas.clear();
  }

  /**
   * Remove um schema específico do cache
   */
  clearCacheForWorkflow(workflowId: string): void {
    this.cachedSchemas.delete(workflowId);
  }
}
