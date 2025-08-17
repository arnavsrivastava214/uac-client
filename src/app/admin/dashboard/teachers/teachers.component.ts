import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { ApplicationServiceService } from '../../../services/application-service.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';


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
  teachersa:any=[]
  showDeleteModal = false;
  teacherToDelete: Teacher | null = null;

  ngOnInit() {
    this.getTeachers();
  }

  constructor(private service: ApplicationServiceService, private router:Router, private alert: AlertService) { }

  getTeachers() {
    this.service.fetchAllteacher((res: any) => {
      if (res.status == 200) {
        this.teachers = res.data;
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  addTeacher() {
    console.log('Add teacher button clicked. Implement your navigation or modal here.');
    Example: this.router.navigate(['/admin/create-teacher']);
  }

  openDeleteModal(teacher: Teacher) {
    this.teacherToDelete = teacher;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.teacherToDelete = null;
  }

  deleteTeacher() {
    if (this.teacherToDelete) {

      this.service.deleteTeacher(this.teacherToDelete.id,(res:any)=>{
        if(res.status==200){
          this.alert.success(res.message)
          this.closeDeleteModal();
          this.getTeachers();
        }else{
          this.alert.error(res.message)
        }

      })
    }
  }

  onEdit(id:any){
    this.router.navigate(['admin/edit-teacher',id])
  }
}


  
