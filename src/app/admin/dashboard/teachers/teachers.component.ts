import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { ApplicationServiceService } from '../../../services/application-service.service';


export interface Teacher {
  id: number;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone?: string;
  address?: string;
  designation?: string;
  joining_date?: Date;
  salary?: number;
  bank_account_number?: string;
  ifsc_code?: string;
  pan_number?: string;
  status?: 'Active' | 'Inactive';
  created_at?: Date;
  updated_at?: Date;
}
@Component({
  selector: 'app-teachers',
  imports: [CommonModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent {

  teachers: Teacher[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(){
    this.getTeachers()
  }
  constructor(private service:ApplicationServiceService){}
  
  getTeachers(){
this.service.fetchAllteacher((res:any)=>{
  if(res.status==200){
    this.teachers = res.data;
    this.isLoading = false
  }
  
})


    //  this.teachers = [
    //   { id: 1, name: 'John Smith', gender: 'Male', email: 'john.smith@school.edu', designation: 'Professor', joining_date: new Date('2018-09-01'), status: 'Active' },
    //   { id: 2, name: 'Emily White', gender: 'Female', email: 'emily.white@school.edu', designation: 'Senior Lecturer', joining_date: new Date('2015-05-15'), status: 'Active' },
    //   { id: 3, name: 'Michael Brown', gender: 'Other', email: 'michael.b@school.edu', designation: 'Teaching Assistant', joining_date: new Date('2022-01-20'), status: 'Inactive' },
    // ];

    // Return the mock data as an observable
  }
}


  
