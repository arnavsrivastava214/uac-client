import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationServiceService } from '../../../services/application-service.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

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
  constructor(private fb: FormBuilder,private  service:ApplicationServiceService, private router:Router, private alert:AlertService) {
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
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {

      this.service.createTeacher(this.teacherForm.value, (res:any)=>{
           
        if(res.status==200){
          this.teacherForm.reset();
            this.router.navigate(['admin/teachers']);
            this.alert.success(res.message)
          }else{
            this.alert.error(res.message)
        }
      })

    } else {
      this.teacherForm.markAllAsTouched();
    }
  }

}
