import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  displayRegisterDialog: boolean = false;

  formLogin = new FormGroup({
    login: new FormControl(''), // Inicializa com string vazia
    senha: new FormControl(''), // Inicializa com string vazia
  });

  constructor(private loginService: LoginService,private router:Router) { }

  logar() {
    const username = this.formLogin.get('login')?.value as string;
    const password = this.formLogin.get('senha')?.value as string;

    if (username && password) {
      this.loginService.getLogin(username, password).subscribe(
        (response) => {
          console.log('Login successful', response);
          
          // Corrigido para acessar a propriedade correta do response
          const data: any = response;
          
          // Armazena o id_usuario no localStorage
          localStorage.setItem('iduser', data.usuario.id_usuario.toString());
          localStorage.setItem('nomeuser', data.usuario.nome_login.toString());
          console.log(localStorage.getItem('iduser'));
          console.log(localStorage.getItem('nomeuser'));
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.error('Username or password is missing');
    }
  }
  Register(){
    this.router.navigate(['cad_user']);
  }
}