import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationServiceService } from '../../../services/application-service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private service: ApplicationServiceService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false] 
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.errorMessage = null;
  
    if (this.loginForm.valid) {
      this.isLoading = true;
  
      // this.service.login(this.loginForm.value, (res: any) => {
        // if (res.status == 200) {

        if(this.loginForm.value.email=="admin@gmail.com" && this.loginForm.value.password=="admin@gmail.com" ){
          localStorage.setItem('isAdminLoggedIn', 'true');
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['admin/dashboard']);
          }, 1000);

        }
  
        // } else {
          this.errorMessage = 'Please enter valid credentials.';
          localStorage.removeItem('isAdminLoggedIn');
        }
      // });
  
    // } else {
      console.warn('Login Failed: Form is invalid');
      this.loginForm.markAllAsTouched();
    // }
  }
  

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}
