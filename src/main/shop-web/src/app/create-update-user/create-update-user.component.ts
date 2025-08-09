import { Component, inject, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { User } from '../auth/user';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Role } from '../shared/models/role';

@Component({
  selector: 'app-create-update-user',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './create-update-user.component.html',
  styleUrl: './create-update-user.component.css',
})
export class CreateUpdateUserComponent implements OnInit {
  user: User = inject(NZ_MODAL_DATA);
  roles: Role[] = Object.values(Role);

  ngOnInit(): void {
  }
}
