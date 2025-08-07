import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-teachers',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './create-teachers.component.html',
  styleUrl: './create-teachers.component.scss'
})
export class CreateTeachersComponent {

  // Define the form group to hold all form controls
  teacherForm: FormGroup;

  // Inject the FormBuilder service to easily create form controls
  constructor(private fb: FormBuilder) {
    // Initialize the form with controls and validators based on your SQL schema
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required]],
      gender: ['Other'], // Default value
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      address: [''],
      designation: [''],
      joining_date: [''],
      salary: [0, [Validators.min(0)]], // Ensure salary is a non-negative number
      bank_account_number: [''],
      ifsc_code: [''],
      pan_number: ['']
    });
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  // Method to handle form submission
  onSubmit(): void {
    // Check if the form is valid before submitting
    if (this.teacherForm.valid) {
      // Log the form value to the console for demonstration
      console.log('Form Submitted!', this.teacherForm.value);

      // Here you would typically call a service to save the data to your backend API
      // For example: this.teacherService.createTeacher(this.teacherForm.value).subscribe(response => { ... });

      // After successful submission, you might want to reset the form
      this.teacherForm.reset();
    } else {
      // Mark all fields as touched to show validation errors
      this.teacherForm.markAllAsTouched();
    }
  }

}
