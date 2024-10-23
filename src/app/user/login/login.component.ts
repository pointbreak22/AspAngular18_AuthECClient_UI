import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  isSubmitted: boolean = false;
  constructor(public fb: FormBuilder, private service: AuthService, private router: Router, private toasrt: ToastrService) {

  }
  ngOnInit(): void {
    if (this.service.isLoggedIn())
      this.router.navigateByUrl('/dashboard')

    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],


    })


  }
  hasDisplayableError(controlName: string): Boolean {

    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res: any) => {
          this.service.saveToken(res.token);
          this.router.navigateByUrl('/dashboard');
        },
        error: err => {
          if (err.status == 400) {
            this.toasrt.error('Incorrect email or password.', 'Login failed')

          }
          else {
            console.log('error durning login:\n', err);
          }
        }
      })

    }
  }
}
