import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  private authService = inject(AuthService);
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.accessToken;
    let headers = new HttpHeaders({ 'accept': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(endpoint: string, params?: HttpParams | {[param: string]: string | string[]}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  post<T>(endpoint: string, body: any, options?: object): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers: this.getAuthHeaders(),
      ...(options || {})
    });
  }

  put<T>(endpoint: string, body: any, options?: object): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers: this.getAuthHeaders(),
      ...(options || {})
    });
  }

  delete<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getAuthHeaders(),
      ...(options || {})
    });
  }
}
