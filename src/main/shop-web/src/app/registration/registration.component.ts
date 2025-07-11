import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RegisterForm } from './register-form';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NzNotificationService);

  registerForm: RegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  };

  register() {
    this.authService.register(this.registerForm).subscribe({
      next: (val) => {
        this.router.navigate(['/login']);
        this.notificationService.success('Account created successfully', 'You can now log in', {
          nzDuration: 3000,
          nzPlacement: 'top'
        }
          
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
