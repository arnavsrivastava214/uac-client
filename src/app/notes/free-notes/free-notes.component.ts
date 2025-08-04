import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Required if downloading from an API
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../headers/header/header.component";

interface DownloadNote {
  id: string;
  title: string;
  description: string;
  fileType: string; // e.g., 'pdf', 'docx', 'txt'
  fileSize: string; // e.g., '2.5 MB', '500 KB'
  downloadUrl: string; // The actual URL to the file
  category: string; // e.g., 'Math', 'Science', 'History'
}

@Component({
  selector: 'app-free-notes',
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './free-notes.component.html',
  styleUrl: './free-notes.component.scss'
})
export class FreeNotesComponent {
    notes: DownloadNote[] = [];
  filteredNotes: DownloadNote[] = [];
  searchTerm: string = '';
  categories: string[] = [];
  selectedCategory: string = 'All';

  constructor(private http: HttpClient) { } // Inject HttpClient if you plan to fetch notes from an API

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    // Simulate fetching data
    this.notes = [
      {
        id: '1',
        title: 'Introduction to Calculus',
        description: 'Comprehensive notes covering limits, derivatives, and integrals.',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        downloadUrl: '/assets/notes/calculus_intro.pdf', // Example path
        category: 'Mathematics'
      },
      {
        id: '2',
        title: 'World History: Ancient Civilizations',
        description: 'Detailed summary of major ancient civilizations from Mesopotamia to Rome.',
        fileType: 'docx',
        fileSize: '1.8 MB',
        downloadUrl: '/assets/notes/ancient_history.docx',
        category: 'History'
      },
      {
        id: '3',
        title: 'Basics of Organic Chemistry',
        description: 'Fundamentals of organic chemistry, including nomenclature and basic reactions.',
        fileType: 'pdf',
        fileSize: '4.5 MB',
        downloadUrl: '/assets/notes/organic_chem_basics.pdf',
        category: 'Science'
      },
      {
        id: '4',
        title: 'Principles of Economics',
        description: 'Key concepts in micro and macroeconomics explained simply.',
        fileType: 'pdf',
        fileSize: '2.1 MB',
        downloadUrl: '/assets/notes/economics_principles.pdf',
        category: 'Economics'
      },
      {
        id: '5',
        title: 'Literary Analysis: Poetry',
        description: 'Tips and techniques for analyzing poetic structures and themes.',
        fileType: 'txt',
        fileSize: '500 KB',
        downloadUrl: '/assets/notes/poetry_analysis.txt',
        category: 'Literature'
      },
      {
        id: '6',
        title: 'Advanced Linear Algebra',
        description: 'Notes on vector spaces, eigenvalues, and eigenvectors.',
        fileType: 'pdf',
        fileSize: '5.1 MB',
        downloadUrl: '/assets/notes/linear_algebra_advanced.pdf',
        category: 'Mathematics'
      },
      {
        id: '7',
        title: 'Introduction to Computer Science',
        description: 'Covers basic programming concepts, algorithms, and data structures.',
        fileType: 'pdf',
        fileSize: '3.8 MB',
        downloadUrl: '/assets/notes/comp_sci_intro.pdf',
        category: 'Computer Science'
      },
      {
        id: '8',
        title: 'Biology: Cell Structure and Function',
        description: 'Detailed notes on prokaryotic and eukaryotic cells.',
        fileType: 'pdf',
        fileSize: '2.9 MB',
        downloadUrl: '/assets/notes/cell_biology.pdf',
        category: 'Science'
      }
    ];

    // Extract unique categories for filters
    this.categories = [...new Set(this.notes.map(note => note.category))];
    this.filterNotes(); // Initialize filtered notes
  }

  filterNotes(): void {
    let tempNotes = this.notes;

    // Apply category filter
    if (this.selectedCategory !== 'All') {
      tempNotes = tempNotes.filter(note => note.category === this.selectedCategory);
    }

    // Apply search term filter
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      tempNotes = tempNotes.filter(note =>
        note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        note.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        note.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    this.filteredNotes = tempNotes;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterNotes();
  }

  downloadNote(url: string, filename: string): void {
    // This is the simplest way to trigger a download for static files.
    // The 'download' attribute on an anchor tag suggests a filename to the browser.
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Suggested filename for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // If you need to download files from an API that requires special headers or handles large files:
    // You'd use HttpClient and potentially a library like 'file-saver'.
    /*
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      // For more robust client-side saving, especially for dynamically generated blobs
      // import { saveAs } from 'file-saver';
      // saveAs(blob, filename);
    });
    */
    console.log(`Downloading: ${filename} from ${url}`);
  }
}
