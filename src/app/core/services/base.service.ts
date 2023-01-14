import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class BaseService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post<T>(url: string, body?: any): Observable<T> {
    return this.http.post<T>(this.apiUrl + url, body);
  }
}
