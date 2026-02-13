import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartFacade } from '@storefront/data-access';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputMaskModule, InputMask } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { mapToCheckoutDto } from '../mappers/checkout.mapper';
import { CheckoutFacade } from '../state/checkout.facade';

@Component({
  selector: 'lib-checkout-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    InputMaskModule,
    InputNumberModule,
    InputTextModule,
    RadioButtonModule,
    InputGroup,
    InputGroupAddon,
    ReactiveFormsModule,
    FloatLabel,
    InputMask,
  ],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
  providers: [MessageService],
})
export class CheckoutPage {
  readonly cart = inject(CartFacade);
  private readonly formBuilder = inject(FormBuilder);
  private readonly facade = inject(CheckoutFacade);
  private readonly toast = inject(MessageService);

  readonly loading = this.facade.loading;
  readonly success = this.facade.success;
  readonly error = this.facade.error;

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (!this.success()) return;

      this.toast.add({
        severity: 'success',
        summary: 'Замовлення відправлено',
        detail: "Дякуємо за замовлення! Ми зв'яжемося з вами найближчим часом.",
        life: 3500,
      });

      this.cart.clear();

      this.form.reset({
        firstName: '',
        phone: '',
      });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    });

    effect(() => {
      const message = this.error();
      if (!message) return;

      this.toast.add({
        severity: 'error',
        summary: 'Виникла помилка',
        detail: message,
        life: 3500,
      });
    });
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toast.add({
        severity: 'warn',
        summary: 'Перевірте поля',
        detail: "Будь ласка, заповніть обов'язкові поля",
        life: 3500,
      });
      return;
    }

    const contact = this.form.getRawValue();
    const dto = mapToCheckoutDto(contact, this.cart.lines());
    this.facade.placeOrder(dto);
  }

  isInvalid(name: keyof typeof this.form.controls) {
    const formControl = this.form.controls[name];
    return formControl.touched && formControl.invalid;
  }
}
