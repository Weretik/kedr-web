import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [InputText, FormsModule, ButtonLabel, ButtonDirective, Textarea],
  templateUrl: './contact-us.html',
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
