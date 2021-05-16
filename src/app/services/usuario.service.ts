import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const gapi: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
               
     this.googleInit();
 }

  googleInit(){

    return new Promise ( (resolve: any) => {
      gapi.load('auth2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id: '930496783638-rts3lbscbn63jafc8ihpgvciqjo6ofi3.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

         resolve();
      });
    })
  }

  logout(){
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() =>{
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url}/login/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any ) => {
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
      catchError ( error => of (false))
    );
  }

  crearUsuario ( formData: RegisterForm ){
   //console.log('Creando Usuario')

   return this.http.post(`${ base_url}/usuarios`,formData)
   .pipe(
    tap( (resp: any) => {  //console.log(resp)
      localStorage.setItem('token', resp.token);
    })
  )  
  }

  login ( formData: LoginForm ){   //console.log('Creando Usuario')
    return this.http.post(`${ base_url}/login`,formData)
    .pipe(
      tap( (resp: any) => {  //console.log(resp)
        localStorage.setItem('token', resp.token);
      })
    )
   }



   loginGoogle ( token ){   //console.log('Creando Usuario')
    return this.http.post(`${ base_url}/login/google`,{ token })
    .pipe(
      tap( (resp: any) => {  //console.log(resp)
        localStorage.setItem('token', resp.token);
      })
    )
   }

}
