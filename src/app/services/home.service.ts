import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments'; // Importe environment
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiUrl; // Use a URL base do environment
  private exchangeRateApiUrl = 'https://api.exchangerate-api.com/v4/latest/BRL'; // URL da API de taxa de câmbio

  constructor(private api: ApiService, private auth: AuthService, private http: HttpClient) {}

  getProduto() {
    const token = this.auth.getToken();
    const httpOptions = {  
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/produtos/`;
    return this.api.get(url, httpOptions);
  }

  getExchangeRate(): Observable<number> {
    return this.http.get(this.exchangeRateApiUrl).pipe(
      map((data: any) => data.rates.USD)
    );
  }

  postCompra(produtoId: number, compraData: { quantidade: number }) {
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/produtos_compra/${produtoId}`;
    return this.api.put(url, compraData, httpOptions);
  }

  postCompra_adicionar(produtoId: number, compraData: { quantidade: number }) {
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/produtos_compra_adicionar/${produtoId}`;
    return this.api.put(url, compraData, httpOptions);
  }

  postCategoria(categoriaData: { descricao: string }) { // Corrigido para receber descricao como string
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/categoria_save/`;
    return this.api.post(url, categoriaData, httpOptions); // Utiliza método POST ao invés de PUT para criar nova categoria
  }

  getCategoria() {
    const token = this.auth.getToken();
    const httpOptions = {  
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/categorias/`;
    return this.api.get(url, httpOptions);
  }

  postProduto(produtoData: any) {
    const token = this.auth.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    const url = `${this.apiUrl}/produtos_save/`;
    return this.http.post(url, produtoData, httpOptions);
  }


}