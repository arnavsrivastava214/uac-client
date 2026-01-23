import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = [
    { title: 'Total Students', value: '1,234', icon: 'users', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { title: 'Active Courses', value: '45', icon: 'book-open', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { title: 'Upcoming Sessions', value: '7', icon: 'calendar', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { title: 'Pending Enquiries', value: '18', icon: 'bell', color: 'text-red-400', bgColor: 'bg-red-500/20' }
  ];

  quickLinks = [
    { name: 'Teachers', icon: 'user-plus', route: '/admin/teachers' },
    { name: 'Create New Course', icon: 'file-plus', route: '/admin/create-course' },
    { name: 'View All Students', icon: 'users', route: '/admin/students' },
    { name: 'Add Result Images', icon: 'book-open', route: '/admin/image-upload' },
    { name: 'Add Notes', icon: 'book-open', route: '/admin/add-notes' }
  ];
  

  constructor() { }

  ngOnInit(): void {
  }

  getIconPath(iconName: string): string {
    switch (iconName) {
      case 'users': return 'M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 9a4 4 0 100-8 4 4 0 000 8zm6.921 4.764c.264-.08.5-.236.702-.438a4 4 0 00-5.874-5.874c-.202.202-.358.438-.438.702M16 16v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2';
      case 'book-open': return 'M12 6.25a.75.75 0 100 1.5.75.75 0 000-1.5zM12 10.25a.75.75 0 100 1.5.75.75 0 000-1.5zM12 14.25a.75.75 0 100 1.5.75.75 0 000-1.5zM17.801 2.375A2.25 2.25 0 0120 4.5V17.25a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25V4.5c0-1.11.89-2.001 1.999-2.25l-.001-.002h11.002zM18.75 4.5h-13.5a.75.75 0 00-.75.75v11.75c0 .414.336.75.75.75h13.5c.414 0 .75-.336.75-.75V5.25a.75.75 0 00-.75-.75z';
      case 'calendar': return 'M6.75 3.75c-.621 0-1.125.504-1.125 1.125v1.5a.75.75 0 001.5 0v-1.5h2.25V6.75a.75.75 0 001.5 0v-1.5h2.25V6.75a.75.75 0 001.5 0v-1.5h2.25v1.5a.75.75 0 001.5 0v-1.5c0-.621-.504-1.125-1.125-1.125H6.75zM12 10.5a.75.75 0 00-.75.75v3.75a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75v-3.75a.75.75 0 00-.75-.75H12zM18.75 9H5.25c-.414 0-.75.336-.75.75v8.25c0 .414.336.75.75.75h13.5c.414 0 .75-.336.75-.75V9.75c0-.414-.336-.75-.75-.75z';
      case 'bell': return 'M14.857 17.082a2.396 2.396 0 01-1.577 2.196 2.396 2.396 0 01-2.542 0 2.396 2.396 0 01-1.577-2.196M18 10.5a3 3 0 10-6 0v2.25a3 3 0 00-3 3H3.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H15a3 3 0 00-3-3V10.5A3 3 0 0018 10.5z';
      case 'user-plus': return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.246V7.5a.75.75 0 00-1.5 0v1.754m10.5-5.517v.75m-4.5 0h-1.5m-3.75 2.25H12M9 6h3.75M9 12H3.75M9 18H3.75M2.25 21h19.5c.414 0 .75-.336.75-.75V3.75a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v16.5c0 .414.336.75.75.75z';
      case 'file-plus': return 'M9 12h6m-3-3v6m2-12H9a2 2 0 00-2 2v7.586a1 1 0 00.293.707L12.414 20H15a2 2 0 002-2V7a2 2 0 00-2-2z';
      default: return '';
    }
  }
}
