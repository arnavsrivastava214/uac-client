import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'notes',
    loadComponent: () =>
      import('./headers/header/free-notes/free-notes.component').then(
        (m) => m.FreeNotesComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact-us/contact-us.component').then(
        (m) => m.ContactUsComponent
      ),
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./app-uac-results.component').then(
        (m) => m.UacResultsComponent
      ),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./gallery/photo-gallery/photo-gallery.component').then(
        (m) => m.PhotoGalleryComponent
      ),
  },
  {
    path: 'mock-test',
    loadComponent: () =>
      import('./mock-test/test-screen/test-select/test-select.component').then(
        (m) => m.TestSelectComponent
      ),
  },
  {
    path: 'test/:testId',
    loadComponent: () =>
      import('./mock-test/test-screen/test-screen.component').then(
        (m) => m.TestScreenComponent
      ),
  },
  {
    path: 'result/:attemptId',
    loadComponent: () =>
      import('./mock-test/result-screen/result-screen.component').then(
        (m) => m.ResultScreenComponent
      ),
  },
  {
    path: 'mind-game',
    loadComponent: () =>
      import('./memory-game-shell.component').then(
        (m) => m.MemoryGameShellComponent
      ),
  },
  {
    path: 'career',
    loadComponent: () =>
      import('./teacher-courier/teacher-courier.component').then(
        (m) => m.TeacherCourierComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./post-feed.component').then(
        (m) => m.PostFeedComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./admin/dashboard/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'dashboard',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'create-teacher',
        canActivate: [adminGuard],
        loadComponent: () =>
          import(
            './admin/dashboard/create-teachers/create-teachers.component'
          ).then((m) => m.CreateTeachersComponent),
      },
      {
        path: 'edit-teacher/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import(
            './admin/dashboard/create-teachers/create-teachers.component'
          ).then((m) => m.CreateTeachersComponent),
      },
      {
        path: 'teachers',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./admin/dashboard/teachers/teachers.component').then(
            (m) => m.TeachersComponent
          ),
      },
      {
        path: 'students',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./admin/dashboard/students/students.component').then(
            (m) => m.StudentsComponent
          ),
      },
      {
        path: 'image-upload',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./admin/result-images-upload/result-images-upload.component').then(
            (m) => m.ResultImagesUploadComponent
          ),
      },
      {
        path: 'add-notes',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./admin/upload-notes/upload-notes.component').then(
            (m) => m.UploadNotesComponent
          ),
      },
      {
        path: 'create-post',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./admin/create-post/create-post.component').then(
            (m) => m.CreatePostComponent
          ),
      },
    ],
  },
];
