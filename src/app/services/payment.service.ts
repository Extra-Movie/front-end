import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeElementsOptions,
  Appearance,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from './dark-mode.service';
import { CartItem } from './cart.service';
import { ToastService } from './toast.service';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:5050/api' + '/payment'; // URL to web api
  private http = inject(HttpClient);
  private theme$ = inject(DarkModeService).darkMode$;
  private toast = inject(ToastService);
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  public ClientSecret: string | undefined = undefined;
  public paymentElementReady = signal(false);
  public paymentElementContainerId: string | undefined = undefined;
  private appearance: Appearance | undefined = undefined;
  private LightAppearance: Partial<Appearance> = {
    theme: 'stripe',
    variables: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSizeBase: '16px',
      borderRadius: '4px',
      colorBackground: '#fdfcfc',
      colorText: '#130f07',
      colorPrimary: '#bd9451',
      colorDanger: '#c50035',
      spacingUnit: '4px',
    },
  };
  private DarkAppearance: Appearance = {
    theme: 'stripe',
    variables: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSizeBase: '16px',
      borderRadius: '4px',
      colorBackground: '#060605',
      colorText: '#f8f4ec',
      colorPrimary: '#ae8442',
      colorDanger: '#c50035',
      spacingUnit: '4px',
    },
  };

  constructor() {
    // Subscribe to the theme$ observable to update the appearance based on the theme
    this.theme$.subscribe((isDarkMode) => {
      this.appearance =
        isDarkMode === 'dark' ? this.DarkAppearance : this.LightAppearance;
      if (this.elements) {
        this.appearance = this.appearance || this.LightAppearance;
        this.elements.update({ appearance: this.appearance });
      }
    });
  }

  async initializeStripe({
    paymentElementContainerId,
    errorHandler,
  }: {
    paymentElementContainerId: string;
    errorHandler?: (error: Error) => void;
  }) {
    console.log('Initializing Stripe...');
    this.stripe = await loadStripe(environment.stripe_api_key);
    if (!this.stripe) {
      this.toast.error('Stripe failed to load');
      throw new Error('Stripe failed to load');
    }
    const req$ = this.http.post<PaymentIntentResponse>(
      `${this.apiUrl}/create-payment-intent`,
      {}
    );
    return req$.subscribe({
      next: (response) => {
        if (!response) return;
        if (response.error) {
          console.error('Error creating Payment Intent', response.error);
          errorHandler?.(new Error(response.error));
        }
        console.log('Payment Intent created successfully', response);
        this.ClientSecret = response.clientSecret;
        this.paymentElementContainerId = paymentElementContainerId;
        this.createPaymentElement(paymentElementContainerId);
      },
      error: (error) => {
        console.error('Error creating Payment Intent', error);
        errorHandler?.(new Error(error));
      },
      complete() {
        console.log('Payment Intent creation complete');
      },
    });
  }

  async updatePaymentIntent(cartAmount: number) {
    console.log('Updating Payment Intent...');
    if (!this.stripe) {
      throw new Error('Stripe is not initialized. Cannot create elements.');
    }
    if (!this.paymentElementContainerId) {
      throw new Error(
        'Payment element container ID is not set. Cannot create elements.'
      );
    }
    const req$ = this.http.post<PaymentIntentResponse>(
      `${this.apiUrl}/create-payment-intent`,
      { cartAmount }
    );
    return req$.subscribe({
      next: (response) => {
        if (!response) return;
        if (response.error) {
          throw new Error(response.error);
        }
        this.ClientSecret = response.clientSecret;
        this.elements?.update({
          customerSessionClientSecret: this.ClientSecret,
        });
      },
      error: (error) => {
        this.toast.error(error.error.message, {
          title: 'Payment Error',
          showIcon: true,
          cancelable: true,
        });
        throw new Error('Error updating Payment Intent: ' + error.message);
      },
      complete() {
        console.log('Payment Intent update complete');
      },
    });
  }

  async SubmitPayment(): Promise<paymentConfirmationResponse> {
    if (!this.stripe) {
      return {
        error: new Error('Stripe is not initialized. Cannot handle payment.'),
      };
    }
    if (!this.ClientSecret) {
      return {
        error: new Error('Client secret is not set. Cannot handle payment.'),
      };
    }
    if (!this.paymentElementReady()) {
      return {
        error: new Error(
          'Payment element is not ready. Cannot handle payment.'
        ),
      };
    }
    if (!this.elements) {
      return {
        error: new Error('Elements is not set. Cannot handle payment.'),
      };
    }
    const { error: formError } = await this.elements.submit();
    if (formError) {
      return { error: new Error(formError.message) };
    }
    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      clientSecret: this.ClientSecret,
      redirect: 'if_required',
    });
    if (error) {
      console.error('Error confirming payment', error);
      return { error: new Error(error.message) };
    }
    console.table(paymentIntent);
    this.elements.getElement('payment')?.clear();
    return { success: true };
  }

  private createPaymentElement(paymentElementContainerId: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized. Cannot create elements.');
    }
    if (!this.ClientSecret) {
      throw new Error('Client secret is not set. Cannot create elements.');
    }
    if (!paymentElementContainerId) {
      throw new Error(
        'Payment element container ID is not set. Cannot create elements.'
      );
    }
    if (!paymentElementContainerId.startsWith('#')) {
      paymentElementContainerId = '#' + paymentElementContainerId;
    }
    const options: StripeElementsOptions = {
      clientSecret: this.ClientSecret,
      loader: 'always',
      appearance: this.appearance,
    };
    this.elements = this.stripe.elements(options);
    const paymentElement = this.elements.create('payment', {
      layout: 'tabs',
    });
    paymentElement.mount(paymentElementContainerId);
    paymentElement.once('ready', () => {
      this.paymentElementReady.set(true);
    });
  }
}

export type PaymentIntentResponse = {
  clientSecret: string;
  error?: string;
  success?: boolean;
  message?: string;
};

export type paymentConfirmationResponse = {
  error?: Error;
  success?: boolean;
};
