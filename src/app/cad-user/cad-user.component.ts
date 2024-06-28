import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cad-user',
  templateUrl: './cad-user.component.html',
  styleUrls: ['./cad-user.component.css']
})
export class CadUserComponent {
  displayRegisterDialog: boolean = false;

  formCad = new FormGroup({
    login: new FormControl(''), // Inicializa com string vazia
    senha: new FormControl(''), // Inicializa com string vazia
  });

  constructor(private loginService: LoginService,private router:Router) { }

  cadastrado() {
    if (this.formCad.valid) {
      this.loginService.postCad(this.formCad.value).subscribe(
        (response) => {
          console.log('Cadastrado com sucesso', response);          
          this.router.navigate(['login']);
        },
        (error) => {
          console.error('Falha no cadastro', error);
        }
      );
    } else {
      console.error('Formulário inválido');
    }
  }

  Login(){
    this.router.navigate(['login']);
  }

}
