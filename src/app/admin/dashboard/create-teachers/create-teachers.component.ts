import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationServiceService } from '../../../services/application-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-create-teachers',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './create-teachers.component.html',
  styleUrl: './create-teachers.component.scss'
})
export class CreateTeachersComponent {
  teacherForm: FormGroup;
  cardUuid: any
  constructor(private fb: FormBuilder, private service: ApplicationServiceService, private router: Router, private alert: AlertService, private route: ActivatedRoute) {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required]],
      gender: ['Other'],
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      address: [''],
      designation: [''],
      joining_date: [''],
      salary: [0, [Validators.min(0)]],
      bank_account_number: [''],
      ifsc_code: [''],
      pan_number: ['']
    });
     this.route.params.subscribe((params: any) => {
      this.cardUuid = params['id'];
      if(this.cardUuid){

        this.service.getTeacherById(this.cardUuid, (res: any) => {
          if (res.status == 200) {
            console.log(res);
            this.teacherForm.patchValue(res.data);
          }
        })
      }
    })


  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      let formValue = { ...this.teacherForm.value };
  
      // CREATE mode: if no date entered, use today
      if (!this.cardUuid) {
        if (!formValue.joining_date) {
          formValue.joining_date = new Date().toISOString().split('T')[0]; 
        }
      }
  
      if (this.cardUuid) {
        const updateData = { ...formValue, id: this.cardUuid };
  
        this.service.updateTeacher(updateData, (res: any) => {
          if (res.status == 200) {
            this.alert.success("Teacher updated successfully!");
            this.router.navigate(['admin/teachers']);
          } else {
            this.alert.error(res.message);
          }
        });
      } else {
        this.service.createTeacher(formValue, (res: any) => {
          if (res.status == 200) {
            this.teacherForm.reset();
            this.router.navigate(['admin/teachers']);
            this.alert.success(res.message);
          } else {
            this.alert.error(res.message);
          }
        });
      }
    } else {
      this.teacherForm.markAllAsTouched();
    }
  }
  
  

}
