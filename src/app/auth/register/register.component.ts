import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css'
  ]
})
export class RegisterComponent  {

//lleva el control en el momento que se envia el formulario
  public formSubmitted = false;


  //asigna valores a formulario
  public registerForm = this.fb.group({
    nombre: ['freddy',[Validators.required]],
    email: ['frsandovalr@ejercito.mil.pe',[Validators.required, Validators.email]],
    password: ['123456',[Validators.required]],
    password2: ['123456',[Validators.required]],
    terminos: [true,[Validators.required]],
  },{
    validators: this.passwordsIguales('password','password2')
  });
  
  constructor( private fb: FormBuilder, 
               private usuarioService: UsuarioService,
               private router: Router) { }

  crearUsuario( ) {
    this.formSubmitted = true;
    console.log ( this.registerForm.value );
    if( this.registerForm.invalid) {
    return
    }
    //Enviando formulario 
    this.usuarioService.crearUsuario( this.registerForm.value)
      .subscribe( resp => {
        console.log('Usuario creado')
        console.log(resp);
        //Navegar al dashboard
      this.router.navigateByUrl('/');
      }, (err) => {
        //SI SUCEDE UN ERROR
        Swal.fire('error',err.error.msg,'error');
      });
    
  }



  campoNoValido( campo: string): boolean {
    if( this.registerForm.get(campo).invalid && this.formSubmitted){
      
      return true;
    } else {
      
      return false;
    }
  }
  
  passwordsNoValidos() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;
  
    if ( (pass1 !== pass2) && this.formSubmitted ) {
        return true;
    }else {
      return false;
    }
  }
  
  aceptarTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordsIguales( pass1Name: string, pass2Name: string){

    return ( formGroup: FormGroup ) =>{

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value){

        pass2Control.setErrors(null)
      }else {

        pass2Control.setErrors( {noEsIgual : true})
      }

    }
  }
  
}
