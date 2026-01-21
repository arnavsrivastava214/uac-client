import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationServiceService } from '../../services/application-service.service';
import { ToastrService } from 'ngx-toastr';

interface SelectedFile {
  file: File;
  previewUrl: string;
  safeName: string;
}

@Component({
  selector: 'app-result-images-upload',
  templateUrl: './result-images-upload.component.html',
  styleUrl: './result-images-upload.component.scss',
  imports: [CommonModule],
})
export class ResultImagesUploadComponent {
  readonly MAX_FILES = 50;

  selectedFiles: SelectedFile[] = [];
  isUploading = false;

  // UI status
  message = '';
  success = false;

  // Progress UI
  progress = 0; // 0-100
  uploadedCount = 0;
  totalToUpload = 0;

  constructor(private appService: ApplicationServiceService,  private toastr: ToastrService
  ) {}

  onSelectFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    const incomingFiles = Array.from(input.files);
    const remaining = this.MAX_FILES - this.selectedFiles.length;
  
    if (remaining <= 0) {
      this.toastr.warning(`Max ${this.MAX_FILES} images allowed!`);
      input.value = '';
      return;
    }
  
    const filesToTake = incomingFiles.slice(0, remaining);
  
    const mapped = filesToTake.map((file) => {
      const previewUrl = URL.createObjectURL(file);
  
      const safeName = file.name
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-_]/g, '');
  
      return { file, previewUrl, safeName };
    });
  
    this.selectedFiles = [...this.selectedFiles, ...mapped];
  
    if (incomingFiles.length > filesToTake.length) {
      this.toastr.info(`Only ${remaining} images added. Limit: ${this.MAX_FILES}`);
    } else {
      this.toastr.success(`${filesToTake.length} image(s) selected ✅`);
    }
  
    input.value = '';
  }
  removeFile(index: number) {
    const removed = this.selectedFiles.splice(index, 1);
    if (removed[0]?.previewUrl) URL.revokeObjectURL(removed[0].previewUrl);
  
    this.toastr.warning('Image removed ❌');
  }
  

  clearAll() {
    this.selectedFiles.forEach((x) => URL.revokeObjectURL(x.previewUrl));
    this.selectedFiles = [];
  
    this.progress = 0;
    this.uploadedCount = 0;
    this.totalToUpload = 0;
  
    this.toastr.info('Selected images cleared 🧹');
  }
  

  uploadAll() {
    if (this.selectedFiles.length === 0) {
      this.toastr.error('Please select at least 1 image!');
      return;
    }
  
    this.isUploading = true;
    this.progress = 0;
    this.uploadedCount = 0;
    this.totalToUpload = this.selectedFiles.length;
  
    this.toastr.info('Uploading started... ⏳');
  
    const fd = new FormData();
    this.selectedFiles.forEach((x) => fd.append('files', x.file, x.safeName));
  
    this.appService.uploadResultImages(fd, (res: any) => {
      this.isUploading = false;
      this.progress = 100;
  
      this.toastr.success(res?.message || 'Upload successful ✅');
  
      // optional auto clear after success
      this.clearAll();
    });
  }
  
  formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  getExt(name: string) {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() : '';
  }
}
