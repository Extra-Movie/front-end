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
import {
  registeredUser,
  registerResponse,
} from './../../Types/Authentication.types';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RequestState } from '../../services/apiRequest.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],

  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent {
  state: WritableSignal<RequestState<registerResponse>>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.state = this.auth.registerState.state;
  }

  //form register
  registerForm = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z-_.]{3,}$/),
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^[a-zA-Z][a-zA-Z0-9_.]{3,}@[a-zA-Z]{3,}.[a-zA-Z]{3,}$/
      ),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
      Validators.minLength(8),
      Validators.maxLength(30),
    ]),
    checkPrivacyStatus: new FormControl(false, [Validators.requiredTrue]),
  });

  //status for input fields
  get emailStatus(): boolean {
    return (
      !this.registerForm.controls.email.valid &&
      this.registerForm.controls.email.dirty
    );
  }
  get nameStatus(): boolean {
    return (
      !this.registerForm.controls.name.valid &&
      this.registerForm.controls.name.dirty
    );
  }
  get passwordStatus(): boolean {
    return (
      this.registerForm.controls.password.dirty &&
      !this.registerForm.controls.password.valid
    );
  }
  get privacyStatus(): boolean {
    return (
      this.registerForm.controls.checkPrivacyStatus.dirty &&
      !this.registerForm.controls.checkPrivacyStatus.valid
    );
  }

  //getter values
  get emailValue(): string {
    return this.registerForm.controls.email.value ?? '';
  }
  get nameValue(): string {
    return this.registerForm.controls.name.value ?? '';
  }
  get passwordValue(): string {
    return this.registerForm.controls.password.value ?? '';
  }
  get privacyValue(): boolean {
    return this.registerForm.controls.checkPrivacyStatus.value ?? false;
  }

  //resister user function
  registerUser() {
    //check form validation
    if (!this.registerForm.valid) {
      console.log(this.registerForm.valid);
      for (const control in this.registerForm.controls) {
        (this.registerForm.controls as { [key: string]: FormControl<unknown> })[
          control
        ].markAsDirty();
      }
      return;
    }
    const newUser: registeredUser = {
      name: this.nameValue.trim(),
      email: this.emailValue.trim(),
      password: this.passwordValue.trim(),
    };
    this.auth.register(newUser).subscribe((res) => {
      if (res?.success) {
        this.router.navigate(['/login']);
        this.toast.success(res.message, {
          title: 'Registration successful!',
          duration: 3000,
          cancelable: true,
          showIcon: true,
        });
        this.router.navigate(['/login']);
        this.registerForm.reset();
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
