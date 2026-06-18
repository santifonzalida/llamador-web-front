import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SystemService {
  constructor(private http: HttpClient) {}

  shutdown(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/system/shutdown`, {});
  }
}
