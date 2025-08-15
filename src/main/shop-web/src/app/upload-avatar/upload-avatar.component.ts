import { Component, Inject, inject, OnInit } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
} from 'ng-zorro-antd/upload';
import { environment } from '../../environments/environment.development';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { User } from '../auth/user';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-upload-avatar',
  imports: [NzUploadModule, NzIconModule, NzButtonModule],
  templateUrl: './upload-avatar.component.html',
  styleUrl: './upload-avatar.component.css',
})
export class UploadAvatarComponent implements OnInit {
  private authService = inject(AuthService);
  uploadUrl = environment.apiUrl + '/profile/avatar';
  headers!: {};
  currentUser!: User | null;

  ngOnInit(): void {
    this.headers = {
      'Access-Control-Allow-Origin': location.origin,
    };
    this.currentUser = this.authService.getCurrentUserValue();
  }

  handleAvatarChange(upload: NzUploadChangeParam) {
    switch (upload.file.status) {
      case 'uploading':
        break;
      case 'done':
        this.uploadAvatar(upload.file.originFileObj!);
        break;
      case 'error':
        break;
    }
  }

  async uploadAvatar(file: File) {
    this.currentUser!.avatar = await this.getBase64(file)!;
  }

  getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result!.toString());
      reader.onerror = (error) => reject(error);
    });

}
