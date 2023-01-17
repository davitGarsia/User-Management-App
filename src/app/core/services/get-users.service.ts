import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { FindUser } from '../interfaces/findUser';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetUsersService extends BaseService {
  getUsers(payload: FindUser): Observable<any> {
    return this.post<any>('find', payload);
  }
}
