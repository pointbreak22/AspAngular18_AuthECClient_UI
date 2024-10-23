import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toasrt = inject(ToastrService);

  if (authService.isLoggedIn()) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken())
    })
    return next(clonedReq).pipe(
      tap({
        error: (err: any) => {
          if (err.status == 401) {//dont have a valid token
            authService.deleteToken();
            setTimeout(() => {
              toasrt.info('Please login again', 'Session Expired!')
            }, 1500)
            router.navigateByUrl('/signin')
          }
          else if (err.status == 403)
            toasrt.error("Oops! It seems you're not authorized to perform the action.")
        }
      }
      )
    )
  }


  else
    return next(req);
}
