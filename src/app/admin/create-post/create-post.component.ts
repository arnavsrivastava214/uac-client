import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AdminPostService, Post, CreatePostPayload, UpdatePostPayload } from '../../services/admin-post.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private adminPostService = inject(AdminPostService);
  private toastService = inject(AlertService);
  document = document;

  posts = signal<Post[]>([]);
  selectedPostId = signal<string | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);
  isEditMode = computed(() => this.selectedPostId() !== null);

  imagePreview = signal<string | null>(null);
  selectedImageFile: File | null = null;

  postForm: FormGroup;
  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.required],
      notifyUsers: [false]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.adminPostService.getAllPosts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (posts) => this.posts.set(posts),
        error: (error) => {
          console.error('Failed to load posts', error);
          this.toastService.error('Failed to load posts');
        }
      });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Please select an image file');
        return;
      }

      this.selectedImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreview.set(null);
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.markFormGroupTouched(this.postForm);
      return;
    }

    if (this.isEditMode()) {
      this.updatePost();
    } else {
      this.createPost();
    }
  }

  createPost(): void {
    if (!this.selectedImageFile) {
      this.toastService.error('Please select an image');
      return;
    }

    this.isSubmitting.set(true);
    
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('description', this.postForm.get('description')!.value);
    formData.append('image', this.selectedImageFile);
    formData.append('notifyUsers', this.postForm.get('notifyUsers')!.value);

    this.adminPostService.createPost(formData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Post created successfully');
          this.resetForm();
          this.loadPosts();
        },
        error: (error) => {
          console.error('Failed to create post', error);
          this.toastService.error('Failed to create post');
        }
      });
  }

  updatePost(): void {
    if (!this.selectedPostId()) return;

    this.isSubmitting.set(true);
    
    const payload: UpdatePostPayload = {
      title: this.postForm.get('title')!.value,
      description: this.postForm.get('description')!.value
    };

    this.adminPostService.updatePostText(this.selectedPostId()!, payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Post updated successfully');
          this.resetForm();
          this.loadPosts();
        },
        error: (error) => {
          console.error('Failed to update post', error);
          this.toastService.error('Failed to update post');
        }
      });
  }

  onEdit(post: any): void {
    this.selectedPostId.set(post.id);
    this.postForm.patchValue({
      title: post.title,
      description: post.description
    });
    this.imagePreview.set(post.imageUrl);
    this.postForm.get('notifyUsers')?.setValue(false);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(postId: string): void {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    this.isLoading.set(true);
    this.adminPostService.deletePost(postId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Post deleted successfully');
          this.loadPosts();
          if (this.selectedPostId() === postId) {
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Failed to delete post', error);
          this.toastService.error('Failed to delete post');
        }
      });
  }

  resetForm(): void {
    this.selectedPostId.set(null);
    this.postForm.reset({
      title: '',
      description: '',
      notifyUsers: false
    });
    this.imagePreview.set(null);
    this.selectedImageFile = null;
    
    // Reset file input
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper getters for template
  get title() { return this.postForm.get('title'); }
  get description() { return this.postForm.get('description'); }
  get notifyUsers() { return this.postForm.get('notifyUsers'); }
}
