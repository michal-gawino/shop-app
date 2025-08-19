import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
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
  LoadingOutline,
  ProductOutline,
  UsergroupAddOutline,
  DeleteFill,
  EditFill,
  PlusOutline,
  PictureTwoTone,
  DownloadOutline,
  UploadOutline,
  ShoppingCartOutline,
  MessageOutline,
  SendOutline} from '@ant-design/icons-angular/icons';
import { routes } from './app.routes';

import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { authInterceptor } from './auth/auth.interceptor';
import { loadingInterceptor } from './loader/loading.interceptor';

registerLocaleData(en);

const icons: IconDefinition[] = [
  LoginOutline,
  UserAddOutline,
  LockOutline,
  UserOutline,
  LogoutOutline,
  MailOutline,
  LoadingOutline,
  ProductOutline,
  UsergroupAddOutline,
  DeleteFill,
  EditFill,
  PlusOutline,
  PictureTwoTone,
  DownloadOutline,
  UploadOutline,
  ShoppingCartOutline,
  MessageOutline,
  SendOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNzIcons(icons),
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
  ],
};
