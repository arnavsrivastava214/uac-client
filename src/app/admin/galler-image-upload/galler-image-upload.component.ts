import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPostService } from '../../services/admin-post.service';

@Component({
  selector: 'app-galler-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galler-image-upload.component.html'
})
export class GallerImageUploadComponent implements OnInit {

  files: File[] = [];
  previews: string[] = [];
  gallery: any[] = [];

  loading = false;
  uploading = false;
  error = '';

  constructor(private service: AdminPostService) {}

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    this.loading = true;

    this.service.getAdminGallery().subscribe({
      next: (res) => {
        this.gallery = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any) {
    const selected = Array.from(event.target.files) as File[];

    this.files = [];
    this.previews = [];
    this.error = '';

    if (selected.length > 20) {
      this.error = 'Max 10 images allowed';
      return;
    }

    selected.forEach(file => {

      if (!file.type.startsWith('image/')) {
        this.error = 'Only image files allowed';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Max size 5MB';
        return;
      }

      this.files.push(file);

      const reader = new FileReader();
      reader.onload = () => this.previews.push(reader.result as string);
      reader.readAsDataURL(file);

    });
  }

  upload() {
    if (!this.files.length) return;

    const formData = new FormData();

    this.files.forEach(file => formData.append('images', file));

    this.uploading = true;

    this.service.uploadGalleryImages(formData).subscribe({
      next: () => {
        this.uploading = false;
        this.files = [];
        this.previews = [];
        this.loadGallery();
      },
      error: () => {
        this.uploading = false;
        this.error = 'Upload failed';
      }
    });
  }

  deleteImage(id: string) {

    if (!confirm('Delete this image?')) return;

    this.service.deleteGalleryImage(id).subscribe(() => {
      this.gallery = this.gallery.filter(img => img.id !== id);
    });

  }

}