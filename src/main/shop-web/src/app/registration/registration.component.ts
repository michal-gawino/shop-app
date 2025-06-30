import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RegisterForm } from './register-form';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(NzMessageService);

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
        this.messageService.success(
          'Account successfully created. You can now log in',
          {
            nzDuration: 3000,
          },
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
