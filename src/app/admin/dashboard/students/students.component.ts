import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-students',
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent {
  students = [
    {
      name: 'Anjali Singh',
      gender: 'Female',
      course: 'Science',
      email: 'anjali.s@example.com',
      joiningDate: 'May 10, 2024',
      status: 'Active'
    },
    {
      name: 'Rohan Gupta',
      gender: 'Male',
      course: 'Commerce',
      email: 'rohan.g@example.com',
      joiningDate: 'Mar 15, 2023',
      status: 'Active'
    },
    {
      name: 'Deepika Sharma',
      gender: 'Female',
      course: 'Arts',
      email: 'deepika.s@example.com',
      joiningDate: 'Jan 22, 2025',
      status: 'Inactive'
    },
    {
      name: 'Kabir Khan',
      gender: 'Male',
      course: 'Science',
      email: 'kabir.k@example.com',
      joiningDate: 'Oct 01, 2023',
      status: 'Active'
    },
    {
      name: 'Pooja Varma',
      gender: 'Female',
      course: 'Commerce',
      email: 'pooja.v@example.com',
      joiningDate: 'Sep 05, 2024',
      status: 'Active'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}