// src/app/services/product.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = '/data/products.json'; // Para usar JSON local
  // Alternativa: private productsUrl = 'http://localhost:3000/products'; // Para JSON Server

  private readonly http: HttpClient = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`);
    // Nota: para JSON local, esto requeriría filtrado manual en el componente
  }
}