import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const gapi: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
               
     this.googleInit();
 }


 get token(): string{
   return localStorage.getItem('token') || '';
 }

 get uid(): string {
   return this.usuario.uid || '';
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

    return this.http.get(`${ base_url}/login/renew`,{
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any ) => {
        //console.log(resp);
        const { email, google, nombre, role,img='', uid} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', role, google, img, uid);
        
        localStorage.setItem('token', resp.token);
        return true;
      }),
      
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

   actualizarPerfil( data: {email: string, nombre: string, role: string}){

    data ={
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${ base_url}/usuarios/${ this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    })
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
