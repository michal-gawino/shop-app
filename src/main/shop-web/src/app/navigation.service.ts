import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private history: string[] = [];
  private router = inject(Router);
  private location = inject(Location);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.history.push(event.urlAfterRedirects);
      });
  }

  goBack(): void {
    if (this.history.length > 1) {
      this.location.back();
      this.history.pop();
    } else {
      this.router.navigate(['/']);
    }
  }
}
