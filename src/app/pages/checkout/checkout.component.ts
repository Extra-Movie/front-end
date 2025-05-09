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
      this.payment.updatePaymentIntent(this.cartService.cartTotalPrice());
    });
  }

  async ngOnInit() {
    const toastInstance = this.toast;
    await this.payment.initializeStripe({
      paymentElementContainerId: '#payment-element',
      errorHandler(error) {
        toastInstance.error(error.message, {
          title: 'Payment Error',
          showIcon: true,
          cancelable: true,
        });
      },
    });
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
