import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../headers/header/header.component";
import { ApplicationServiceService } from '../../services/application-service.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  uacOfficialMail: string = 'unstoppableacademicclassess@gmail.com'

  formSubmitted: boolean = false;
  copied: boolean = false; // New state for "Copied!" message

  constructor(private service: ApplicationServiceService, private alert:AlertService, private router:Router) { }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.service.sendRequest(this.formData, (res: any) => {
        if(res.status==200){
          this.formSubmitted = true;
          this.resetForm();
          this.alert.success(res.message);
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 3000);
        }else{
          this.resetForm();
          this.alert.error(res.message);
        }
      })
    } else {
      console.log('Form is invalid. Please fill all required fields correctly.');
    }
  }

  isFormValid(): boolean {
    return !!this.formData.name && !!this.formData.email && !!this.formData.message && this.isValidEmail(this.formData.email);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    this.formSubmitted = false;
  }

  /**
   * Copies the given text to the user's clipboard.
   * Provides visual feedback.
   * @param text The text to copy.
   */
  copyToClipboard(text: string): void {
    // Use document.execCommand('copy') for better compatibility in iframes
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in some browsers
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.copied = true; // Show "Copied!" message
      setTimeout(() => {
        this.copied = false; // Hide message after a short delay
      }, 1500);
      console.log('Text copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers or specific environments
      alert('Could not copy text. Please copy manually: ' + text);
    } finally {
      document.body.removeChild(textarea);
    }
  }

  /**
   * Initiates a phone call using the 'tel:' protocol.
   * @param phoneNumber The phone number to call.
   */
  callNumber(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
    console.log('Attempting to call:', phoneNumber);
  }
}
