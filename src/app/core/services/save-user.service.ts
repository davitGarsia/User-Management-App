import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SaveUserService extends BaseService {
  saveUser(payload: User): Observable<any> {
    return this.post<any>('save', payload);
  }
}
