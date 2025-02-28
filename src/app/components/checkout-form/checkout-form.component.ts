// src/app/components/checkout-form/checkout-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-checkout-form',
  imports: [],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  checkoutForm!: FormGroup;
  submitted = false;
  orderComplete = false;
  
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cart$;
  }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      paymentMethod: ['credit', Validators.required]
    });
  }
  
  get f() { return this.checkoutForm.controls; }
  
  getTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity), 0
        );
        observer.next(total);
        observer.complete();
      });
    });
  }
  
  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }
  
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.checkoutForm.invalid) {
      return;
    }
    
    // Simular procesamiento de pedido
    setTimeout(() => {
      console.log('Order data:', this.checkoutForm.value);
      this.orderComplete = true;
      this.cartService.clearCart();
    }, 1500);
  }
  
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
