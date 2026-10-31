import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}

@Component({
  selector: 'lib-contact-us',
  imports: [InputText, FormsModule, ButtonLabel, ButtonDirective, Textarea, TranslocoPipe],
  templateUrl: './contact-us.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-us.css',
})
export class ContactUs {
  contact: ContactForm = {
    name: '',
    email: '',
    company: '',
    message: '',
  };
}
