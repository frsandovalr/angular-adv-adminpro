import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {
  
  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  //constructuctor
  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  //on init
  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  //Metodo actaulizar perfil
  actualizarPerfil() {
    const nombreAnterior = this.usuario.nombre;
    const emailAnterio = this.usuario.email;
    // console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe((resp) => {
        const { nombre, email } = this.perfilForm.value;
       // console.log(resp);
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        // *** Mensaje al Usuario de conformidad
        //console.log('estoy aqyi');
        Swal.fire('Actualizado', 'Cambios fueron guardados', 'success');
      }, (err) => {
        // *** Mensaje al Usuario de error
        console.log (nombreAnterior); 
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  //Metodo cambiar imagen
  cambiarImagen(file: File) {    
      this.imagenSubir = file;

      if (!file) {
        return this.imgTemp = null;
        //return this.imgTemp = null;
      } else {
        const nombreCortado = this.imagenSubir.name.split('.'); // separa el nombre del archivo por el punto
        const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];
        //Validar extension
        const extensionesValidas = ['png','jpg','jpeg','gif'];
        if ( !extensionesValidas.includes(extensionArchivo) ) {
        Swal.fire('Error', 'No es un archivo de imagen', 'error');
         return this.imagenSubir = null;
         //return this.imgTemp = null;
            } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                //this.imgTemp = reader.result;
                this.imgTemp = reader.result
                }
            } 
      }
    }
  

    //Metodo Subir imagen imagen
  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then(img =>  {
        this.usuario.img = img;
        // *** Mensaje al Usuario de conformidad de subir img a la BD
        Swal.fire('Actualizado', 'Imagen guardada en la BD', 'success');
      }).catch(err => {
        // *** Mensaje al Usuario de error
        Swal.fire('Error', 'No se pudo subir imagen', 'error');
      });

  }
}
