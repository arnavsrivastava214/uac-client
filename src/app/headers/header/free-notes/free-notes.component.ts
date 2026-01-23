import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header.component";
import { FooterComponent } from "../../../footer/footer.component";
import { ApplicationServiceService } from '../../../services/application-service.service';

interface Note {
  id: number;
  className: string;
  subjectName: string;
  chapterName: string;
  fileName: string;
  pdfLink: string;
  downloadLink: string;
  uploadedAt: Date;
}

interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-free-notes',
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './free-notes.component.html',
  styleUrls: ['./free-notes.component.scss']
})
export class FreeNotesComponent implements OnInit {
  // Data
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  
  // Filters
  searchTerm: string = '';
  selectedClass: string = '';
  selectedSubject: string = '';
  selectedChapter: string = '';
  
  // Dropdown options
  classOptions: DropdownOption[] = [];
  subjectOptions: DropdownOption[] = [];
  chapterOptions: DropdownOption[] = [];
  
  // UI state
  isLoading: boolean = true;
  
  // Constants
  readonly ALL_OPTION: DropdownOption = { value: '', label: 'All' };

  constructor(private appService: ApplicationServiceService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.appService.getNotes().subscribe({
      next: (res: any) => {
        if (res.success && res.notes) {
          // Map snake_case to camelCase
          this.notes = res.notes.map((note: any) => ({
            id: note.id,
            className: note.class_name,
            subjectName: note.subject_name,
            chapterName: note.chapter_name,
            fileName: note.file_name,
            pdfLink: note.pdf_link,
            downloadLink: note.download_link,
            uploadedAt: new Date(note.uploaded_at)
          }));
          
          this.initializeFilters();
          this.filterNotes();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.isLoading = false;
      }
    });
  }

  initializeFilters(): void {
    // Initialize class options
    const uniqueClasses = [...new Set(this.notes.map(note => note.className))];
    this.classOptions = [this.ALL_OPTION, ...uniqueClasses.map(cls => ({ 
      value: cls, 
      label: cls 
    }))];
    
    // Initialize subject options based on selected class
    this.updateSubjectOptions();
  }

  updateSubjectOptions(): void {
    let filteredNotes = this.notes;
    
    if (this.selectedClass) {
      filteredNotes = filteredNotes.filter(note => note.className === this.selectedClass);
    }
    
    const uniqueSubjects = [...new Set(filteredNotes.map(note => note.subjectName))];
    this.subjectOptions = [this.ALL_OPTION, ...uniqueSubjects.map(sub => ({ 
      value: sub, 
      label: sub 
    }))];
    
    // Reset subject and chapter if parent filter changes
    if (this.selectedClass) {
      this.selectedSubject = '';
      this.selectedChapter = '';
    }
    
    this.updateChapterOptions();
  }

  updateChapterOptions(): void {
    let filteredNotes = this.notes;
    
    if (this.selectedClass) {
      filteredNotes = filteredNotes.filter(note => note.className === this.selectedClass);
    }
    if (this.selectedSubject) {
      filteredNotes = filteredNotes.filter(note => note.subjectName === this.selectedSubject);
    }
    
    const uniqueChapters = [...new Set(filteredNotes.map(note => note.chapterName))];
    this.chapterOptions = [this.ALL_OPTION, ...uniqueChapters.map(ch => ({ 
      value: ch, 
      label: ch 
    }))];
    
    // Reset chapter if subject changes
    if (this.selectedSubject) {
      this.selectedChapter = '';
    }
  }

  filterNotes(): void {
    let tempNotes = [...this.notes];
    
    // Apply class filter
    if (this.selectedClass) {
      tempNotes = tempNotes.filter(note => note.className === this.selectedClass);
    }
    
    // Apply subject filter
    if (this.selectedSubject) {
      tempNotes = tempNotes.filter(note => note.subjectName === this.selectedSubject);
    }
    
    // Apply chapter filter
    if (this.selectedChapter) {
      tempNotes = tempNotes.filter(note => note.chapterName === this.selectedChapter);
    }
    
    // Apply search filter
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      tempNotes = tempNotes.filter(note =>
        note.fileName.toLowerCase().includes(searchTermLower) ||
        note.chapterName.toLowerCase().includes(searchTermLower) ||
        note.subjectName.toLowerCase().includes(searchTermLower)
      );
    }
    
    this.filteredNotes = tempNotes;
  }

  onClassChange(): void {
    this.updateSubjectOptions();
    this.filterNotes();
  }

  onSubjectChange(): void {
    this.updateChapterOptions();
    this.filterNotes();
  }

  onChapterChange(): void {
    this.filterNotes();
  }

  onSearchChange(): void {
    this.filterNotes();
  }

  clearFilters(): void {
    this.selectedClass = '';
    this.selectedSubject = '';
    this.selectedChapter = '';
    this.searchTerm = '';
    this.initializeFilters();
    this.filterNotes();
  }

  downloadNote(downloadLink: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFileType(fileName: string): string {
    return fileName.split('.').pop()?.toUpperCase() || 'PDF';
  }
}