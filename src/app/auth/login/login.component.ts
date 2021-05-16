import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {


  ngOnInit(): void {
    this.renderButton();
  }


  //lleva el control en el momento que se envia el formulario
  public formSubmitted = false;
  public auth2: any;


  //asigna valores a formulario
  public loginForm = this.fb.group({
    email: [localStorage.getItem('email')||'',[Validators.required, Validators.email]],
    password: ['',[Validators.required]],
    remenber: [false]
  });

  constructor( private router: Router, 
               private fb : FormBuilder,
               private usuarioService : UsuarioService,
               private ngZone: NgZone) { }

  
  login(){

    this.usuarioService.login( this.loginForm.value)
    .subscribe( res => {// console.log( res)
      if(this.loginForm.get('remenber').value) {
        localStorage.setItem('email', this.loginForm.get('email').value);


      }else {
        localStorage.removeItem('email');
      }

      //Navegar al dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
      Swal.fire('error',err.error.msg,'error');
    })
    // console.log(this.loginForm.value);    
    // this.router.navigateByUrl('/');
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
  }

  async startApp() {
     
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
    
  };


  attachSignin(element) {
    //console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
         // console.log(id_token);

          this.usuarioService.loginGoogle(id_token).subscribe(
            resp => {
              //Navegar al dashboard
              this.ngZone.run(() => {
                this.router.navigateByUrl('/');
              })
            }
          );

          
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }
}
