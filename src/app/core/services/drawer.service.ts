import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DrawerService {
  drawerOpen = new BehaviorSubject<boolean>(false);
  isDrawerOpen$: Observable<boolean> = this.drawerOpen.asObservable();

  openDrawer() {
    this.drawerOpen.next(true);
  }

  closeDrawer() {
    this.drawerOpen.next(false);
  }
}
