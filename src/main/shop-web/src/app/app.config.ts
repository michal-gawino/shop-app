import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  LockOutline,
  LoginOutline,
  LogoutOutline,
  MailOutline,
  UserAddOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { routes } from './app.routes';

import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { AuthService } from './auth/auth.service';
import { authInterceptor } from './auth/auth.interceptor';

registerLocaleData(en);

const icons: IconDefinition[] = [
  LoginOutline,
  UserAddOutline,
  LockOutline,
  UserOutline,
  LogoutOutline,
  MailOutline
];

function appInit(): void {
  const authSerivce = inject(AuthService);
  if(localStorage.getItem(authSerivce.AUTH_FLAG) != null){
    authSerivce.setAuthenticated(true);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(appInit),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNzIcons(icons),
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
