// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductFilters } from '../product-filters/product-filters.component';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  errorMessage = '';
  activeFilters: ProductFilters = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null
  };
  
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      products => {
        this.allProducts = products;
        this.applyFilters(this.activeFilters);
        this.isLoading = false;
      },
      error => {
        this.errorMessage = 'Error al cargar los productos. Por favor, intente más tarde.';
        this.isLoading = false;
        console.error('Error loading products', error);
      }
    );
  }
  
  applyFilters(filters: ProductFilters): void {
    this.activeFilters = filters;
    this.filteredProducts = this.allProducts.filter(product => {
      // Filtro por nombre
      if (filters.name && !product.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // Filtro por categoría
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Filtro por precio mínimo
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      
      // Filtro por precio máximo
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}