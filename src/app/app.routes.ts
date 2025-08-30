import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./dashboard/dashboard.component").then(m => m.DashboardComponent)
  },
  {
    path: 'notes',
    loadComponent: () => import("./notes/free-notes/free-notes.component").then(m => m.FreeNotesComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import("./contact/contact-us/contact-us.component").then(m => m.ContactUsComponent)
  },
  {
    path: 'result',
    loadComponent: () => import("./carousel/result-carousel/result-carousel.component").then(m => m.ResultCarouselComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import("./gallery/photo-gallery/photo-gallery.component").then(m => m.PhotoGalleryComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import("./admin/admin/admin.component").then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import("./admin/dashboard/login/login.component").then(m => m.LoginComponent) },
      { path: 'dashboard', canActivate: [adminGuard], loadComponent: () => import("./admin/dashboard/dashboard.component").then(m => m.DashboardComponent) },
      { path: 'create-teacher', canActivate: [adminGuard], loadComponent: () => import("./admin/dashboard/create-teachers/create-teachers.component").then(m => m.CreateTeachersComponent) },
      { path: 'edit-teacher/:id', canActivate: [adminGuard], loadComponent: () => import("./admin/dashboard/create-teachers/create-teachers.component").then(m => m.CreateTeachersComponent) },
      { path: 'teachers', canActivate: [adminGuard], loadComponent: () => import("./admin/dashboard/teachers/teachers.component").then(m => m.TeachersComponent) },
      { path: 'students', canActivate: [adminGuard], loadComponent: () => import("./admin/dashboard/students/students.component").then(m => m.StudentsComponent) },
    ]
  }

];
