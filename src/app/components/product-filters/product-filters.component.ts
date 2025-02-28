
// src/app/components/product-filters/product-filters.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../models/product.model';
import { debounceTime } from 'rxjs/operators';

export interface ProductFilters {
  name: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-product-filters',
  imports: [],
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.css']
})
export class ProductFiltersComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() filtersChanged = new EventEmitter<ProductFilters>();
  
  filterForm!: FormGroup;
  categories: string[] = [];
  
  constructor(private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
      category: [''],
      minPrice: [null],
      maxPrice: [null]
    });
    
    // Extraer categorías únicas de los productos
    this.categories = [...new Set(this.products.map(p => p.category))];
    
    // Escuchar cambios en los filtros
    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(filters => {
        this.filtersChanged.emit(filters);
      });
  }
  
  resetFilters(): void {
    this.filterForm.reset({
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null
    });
  }
}