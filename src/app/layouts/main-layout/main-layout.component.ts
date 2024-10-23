import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { HideIfClaimsNotMetDirective } from '../../directives/hide-if-claims-not-met.directive';
import { claimReq } from "../../shared/utils/claimReq-utils"


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HideIfClaimsNotMetDirective],
  templateUrl: './main-layout.component.html',
  styles: ``
})
export class MainLayoutComponent {

  claimReq = claimReq;
  constructor(private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  onLogout() {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');

  }
}
