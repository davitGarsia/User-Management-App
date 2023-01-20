import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { FindUser } from '../interfaces/findUser';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class ControlUsersService extends BaseService {
  userId = {
    id: '',
  };
  getUsers(payload: FindUser): Observable<any> {
    return this.post<any>('find', payload);
  }

  saveUser(payload: User): Observable<any> {
    return this.post<any>('save', payload);
  }

  deleteUser(payload: any): Observable<any> {
    return this.post<any>('remove', payload);
  }

  // getIndividualUser(payload: any): Observable<any> {
  //   return this.post<any>('find-one', payload);
  // }
}
