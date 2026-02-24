import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { applyServerErrors, controlErrorText } from '@shared/forms';
import { NotificationService } from '@shared/ui';
import {
  CartFacade,
  CheckoutFacade,
  mapToCheckoutDto,
} from '@storefront/data-access';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputMaskModule, InputMask } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

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
    Dialog,
    RouterLink,
  ],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
  providers: [],
})
export class CheckoutPage implements OnDestroy {
  readonly cart = inject(CartFacade);
  private readonly formBuilder = inject(FormBuilder);
  private readonly facade = inject(CheckoutFacade);
  private readonly notify = inject(NotificationService);

  readonly successDialogVisible = signal(false);

  readonly loading = this.facade.loading;
  readonly success = this.facade.success;
  readonly error = this.facade.error;
  readonly orderId = this.facade.orderId;

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (!this.success()) return;

      this.cart.clear();

      this.successDialogVisible.set(true);

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

      this.notify.error('Виникла помилка', message, { lifeMs: 3500 });
    });

    effect(() => {
      const err = this.facade.validationError();
      if (!err) return;

      applyServerErrors(this.form, err);

      const fieldErrors = Object.values(err.fieldErrors ?? {})
        .flat()
        .join('. ');

      const detail = fieldErrors
        ? `Помилки: ${fieldErrors}`
        : 'Будь ласка, перевірте введені дані';

      this.notify.error('Помилка валідації', detail, { lifeMs: 5000 });
    });
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.notify.warn(
        'Перевірте поля',
        "Будь ласка, заповніть обов'язкові поля",
        { lifeMs: 3500 },
      );
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

  getErrorMessage(name: keyof typeof this.form.controls) {
    return controlErrorText(this.form.controls[name]);
  }

  closeSuccessDialog() {
    this.successDialogVisible.set(false);
    this.facade.reset();
  }

  ngOnDestroy() {
    this.facade.reset();
  }
}
