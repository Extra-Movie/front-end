import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { loginResponse, loginUser } from './../../Types/Authentication.types';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RequestState } from '../../services/apiRequest.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  state: WritableSignal<RequestState<loginResponse>>;
  constructor(
    private router: Router,
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.state = this.auth.loginState.state;
  }

  //form login
  loginForm = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl(null, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rememberMe: new FormControl(false),
  });

  //login function
  loginFun() {
    if (!this.loginForm.valid) {
      this.toast.error('Please enter valid credentials', {
        title: 'Invalid Credentials',
        cancelable: true,
        showIcon: true,
      });
      return;
    }
    const loginData: loginUser = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
      rememberMe: this.loginForm.value.rememberMe ?? false,
    };
    this.auth.login(loginData).subscribe((res) => {
      if (this.state().success) {
        this.router.navigate(['/home']);
        this.toast.success('Login Successful', {
          title: 'Success',
          cancelable: true,
          showIcon: true,
        });
      } else {
        this.toast.error(this.state().error ?? '', {
          title: 'Error',
          cancelable: true,
          showIcon: true,
        });
      }
    });
  }
}
