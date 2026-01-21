import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../headers/header/header.component";
import { ApplicationServiceService } from '../services/application-service.service';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-teacher-courier',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './teacher-courier.component.html',
  styleUrl: './teacher-courier.component.scss'
})
export class TeacherCourierComponent {
  applyForm: FormGroup;
  isSubmitting = false;
  uacOfficialMail:any= 'unstoppableacdemicclassess@gmail.com';
  // Form options
  subjects = [
    'Maths', 'Science', 'English', 'SST', 
    'Physics', 'Chemistry', 'Biology', 'Computer'
  ];
  
  classes = [
    { id: '6th-8th', label: '6th–8th' },
    { id: '9th-10th', label: '9th–10th' },
    { id: '11th-12th', label: '11th–12th' },
    { id: 'competitive', label: 'Competitive' }
  ];
  
  teachingModes = [
    { id: 'offline', label: 'Offline' },
    { id: 'online', label: 'Online' },
    { id: 'both', label: 'Both' }
  ];
  
  experienceLevels = [
    'Fresher', '0-1 year', '1-3 years', '3-5 years', '5+ years'
  ];
  
  // Institute highlights
  highlights = [
    {
      icon: '🏆',
      title: 'Competitive Salary',
      description: 'Attractive compensation with performance bonuses'
    },
    {
      icon: '📚',
      title: 'Curriculum Support',
      description: 'Pre-designed lesson plans and teaching materials'
    },
    {
      icon: '🎓',
      title: 'Professional Growth',
      description: 'Regular training and career advancement opportunities'
    },
    {
      icon: '🤝',
      title: 'Collaborative Environment',
      description: 'Work with experienced educators and mentors'
    },
    {
      icon: '⚖️',
      title: 'Work-Life Balance',
      description: 'Flexible schedules and manageable workloads'
    },
    {
      icon: '🏢',
      title: 'Modern Facilities',
      description: 'Well-equipped classrooms and digital tools'
    }
  ];


// Resume Upload Status
isResumeUploading = false;
resumeUploadProgressText = '';
resumeUploadSuccess = false;
resumeUploadError = '';
driveResume: any = null; // {viewUrl, downloadUrl, fileId}

driveUploadUrl ='https://script.google.com/macros/s/AKfycbyjcyzBf2y--CpS3Kd-r34XqRhP9e-iE9RVZIoX8juL_WQ6J7kprDeHnyfVB4632m4t/exec';

resumeUploaded = false;

resumeViewUrl: string | null = null;
resumeDownloadUrl: string | null = null;



  

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService, 
    private applicationService: ApplicationServiceService
  ) {
    this.applyForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      classes: [[], [Validators.required]],
      teachingMode: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      expectedSalary: ['', [Validators.required, Validators.min(10000)]],
      resume: [null, [this.fileValidator]],
      aboutYourself: ['', [Validators.maxLength(300)]],
      demoClassReady: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {}

  // Custom file validator for PDF upload
  fileValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) {
      return null;
    }
    
    if (file.type !== 'application/pdf') {
      return { fileType: true };
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
      return { fileSize: true };
    }
    
    return null;
  }

  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files?.[0];
  
    if (!file) return;
  
    // ✅ Validation
    if (file.type !== 'application/pdf') {
      this.toastr.error('Only PDF allowed', 'Invalid File');
      event.target.value = '';
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) {
      this.toastr.error('PDF must be less than 2MB', 'File too large');
      event.target.value = '';
      return;
    }
  
    // ✅ form me file set
    this.applyForm.patchValue({ resume: file });
    this.applyForm.get('resume')?.updateValueAndValidity();
  
    // ✅ Auto upload start
    await this.uploadResumeToDrive(file);
  }
   


  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.applyForm.patchValue({ resume: file });
    }
  }
  
  // Toggle class selection
  toggleClassSelection(className: string): void {
    const currentClasses: string[] = this.applyForm.get('classes')?.value || [];
    const index = currentClasses.indexOf(className);
    
    if (index === -1) {
      currentClasses.push(className);
    } else {
      currentClasses.splice(index, 1);
    }
    
    this.applyForm.patchValue({ classes: currentClasses });
  }

  // Check if class is selected
  isClassSelected(className: string): boolean {
    const currentClasses: string[] = this.applyForm.get('classes')?.value || [];
    return currentClasses.includes(className);
  }

  // Form submission
 // Form submission
 async onSubmit(): Promise<void> {

  if (this.isResumeUploading) {
    this.toastr.warning("Resume is still uploading... Please wait", "Uploading");
    return;
  }

  if (!this.driveResume?.viewUrl) {
    this.toastr.error("Please upload resume first", "Resume Required");
    return;
  }

  if (this.applyForm.invalid) {
    this.applyForm.markAllAsTouched();
    this.toastr.error("Please fill all required fields correctly", "Form Error");
    return;
  }

  this.isSubmitting = true;

  const v = this.applyForm.value;

  const payload = {
    fullName: v.fullName,
    mobile: v.mobile,
    email: v.email,
    city: v.city,
    role: "Teacher",
    subject: v.subject,
    classes: v.classes || [],
    teachingMode: v.teachingMode,
    experience: v.experience,
    expectedSalary: String(v.expectedSalary),
    aboutYourself: v.aboutYourself || "",
    demoClassReady: Boolean(v.demoClassReady),

    // ✅ Drive resume urls
    resumeViewUrl: this.driveResume.viewUrl,
    resumeDownloadUrl: this.driveResume.downloadUrl,
    resumeFileId: this.driveResume.fileId,
  };

  this.applicationService.applyCareerJson(payload).subscribe({
    next: (res: any) => {
      console.log("Career Apply Response:", res);

      this.isSubmitting = false;
      this.toastr.success(
        "Application submitted successfully! We will contact you soon.",
        "Success!"
      );

      this.applyForm.reset();
      this.driveResume = null;
      this.resumeUploaded = false;
      this.resumeViewUrl = null;
      this.resumeDownloadUrl = null;

      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    },
    error: (err: any) => {
      console.log("Career Apply Error FULL:", err);
    
      this.isSubmitting = false;
    
      const msg =
        err?.error?.error ||
        err?.error?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
    
      this.toastr.error(msg, "Error");
    }
    
  });
}
  
  // Getter for form controls (for easy access in template)
  get f() {
    return this.applyForm.controls;
  }

  // Character counter for about yourself
  get remainingChars(): number {
    const maxLength = 300;
    const currentLength = this.applyForm.get('aboutYourself')?.value?.length || 0;
    return maxLength - currentLength;
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // remove data:...base64,
        resolve(base64);
      };
  
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  async uploadResumeToDrive(file: File) {
    try {
      this.isResumeUploading = true;
  
      // reset old values
      this.resumeUploaded = false;
      this.resumeViewUrl = null;
      this.resumeDownloadUrl = null;
      this.driveResume = null;
  
      this.toastr.info('Resume uploading started...', 'Uploading');
  
      const base64 = await this.fileToBase64(file);
  
      const payload = {
        fileName: file.name,
        mimeType: file.type,
        base64: base64,
      };
  
      const res = await fetch(this.driveUploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps Script safe
        },
        body: JSON.stringify(payload),
      });
  
      const data: any = await res.json();
  
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }
  
      // ✅ IMPORTANT: store full response in driveResume
      this.driveResume = data;
  
      // optional: also store separately
      this.resumeViewUrl = data.viewUrl;
      this.resumeDownloadUrl = data.downloadUrl;
  
      this.resumeUploaded = true;
  
      this.toastr.success('Resume uploaded successfully ✅', 'Uploaded');
    } catch (err: any) {
      console.log('Drive Upload Error:', err);
  
      this.resumeUploaded = false;
      this.resumeViewUrl = null;
      this.resumeDownloadUrl = null;
      this.driveResume = null;
  
      this.toastr.error(err?.message || 'Resume upload failed', 'Error');
    } finally {
      this.isResumeUploading = false;
    }
  }
    
}
