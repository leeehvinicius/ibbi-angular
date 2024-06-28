import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments'; // Importe environment

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl; // Use a URL base do environment

  constructor(private api: ApiService, private auth: AuthService) {}

 

  getLogin(username: string, password: string) {
    const token = this.auth.getToken();
    
    
    const httpOptions = {  
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/login/${username}/${password}`;
    return this.api.get(url, httpOptions);
  }

 postCad(Data:any) {
    const token = this.auth.getToken();
    
    
    const httpOptions = {  
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/usuario_save/`;
    return this.api.post(url,Data,httpOptions);
  }

  logout(){
    this.auth.logout();
  }
}