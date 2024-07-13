import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormCardComponent } from '../../form-card/form-card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FormCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Initialized');
  }

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value);
    // const token = this.authService.authUser(loginForm.value);
    // this.authService.authUser(loginForm.value).subscribe(
    // (response: UserForLogin) => {
    //     console.log(response);
    //     const user = response;
    //     if (user) {
    //         localStorage.setItem('token', user.token);
    //         localStorage.setItem('userName', user.userName);
    //         this.alertify.success('Login Successful');
    //         this.router.navigate(['/']);
    //     }
    // }
    // );
  }
}
