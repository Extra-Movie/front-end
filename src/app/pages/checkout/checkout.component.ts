import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { currencyFormatter } from '../../utils/formatters';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCreditCard, faSolidXmark } from '@ng-icons/font-awesome/solid';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [NgIcon, CommonModule],
  templateUrl: './checkout.component.html',
  providers: [provideIcons({ faSolidXmark, faSolidCreditCard })],
})
export class CheckoutComponent implements OnInit {
  payment = inject(PaymentService);
  cartService = inject(CartService);
  toast = inject(ToastService);
  router = inject(Router);
  currencyFormatter = currencyFormatter;
  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      if (this.cartService.cart()?.length === 0) {
        this.router.navigate(['/']);
        this.toast.error('Your cart is empty', {
          title: 'Error',
          showIcon: true,
          cancelable: true,
        });
        return;
      }
      const errorHandlerFunction = this.errorHandler.bind(this);
      this.payment.updatePaymentIntent({
        cartAmount: this.cartService.cartTotalPrice() || 0,
        errorHandler: errorHandlerFunction,
      });
    });
  }

  async ngOnInit() {
    if (this.cartService.cart()?.length === 0) {
      this.router.navigate(['/']);
      this.toast.error('Your cart is empty now', {
        title: 'Sorry',
        showIcon: true,
        cancelable: true,
      });
    }
    const errorHandlerFunction = this.errorHandler.bind(this);
    await this.payment.initializeStripe({
      paymentElementContainerId: '#payment-element',
      errorHandler: errorHandlerFunction,
    });
  }

  errorHandler(error: Error) {
    console.error('Error:', error);
    this.toast.error(error.message, {
      title: 'Payment Error',
      showIcon: true,
      cancelable: true,
    });
    // this.router.navigate(['/']);
  }

  async handlePaymentSubmit(e: Event) {
    e.preventDefault();
    this.isSubmitting.set(true);
    const { error, success } = await this.payment.SubmitPayment();
    this.isSubmitting.set(false);
    if (error) {
      this.toast.error(error.message, {
        title: 'Payment Error',
        showIcon: true,
        cancelable: true,
      });
      return;
    }
    if (success) {
      this.toast.success('Your Payment was successful!', {
        title: 'Success',
        showIcon: true,
        cancelable: true,
        duration: 6000,
      });
      this.router.navigate(['/']);
    }
  }
}
