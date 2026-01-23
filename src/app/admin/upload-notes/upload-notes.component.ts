import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationServiceService } from '../../services/application-service.service';

interface Chapter {
  id: number;
  name: string;
  order: number;
}

interface Subject {
  id: number;
  name: string;
  classId: number;
  chapters: Chapter[];
}

interface Class {
  id: number;
  name: string;
  value: number;
  subjects: Subject[];
}

interface UploadedNote {
  id?: string;
  className: string;
  subjectName: string;
  chapterName: string;
  fileName: string;
  pdfLink: string;
  downloadLink: string;
  uploadedAt: Date;
}

interface UploadResponse {
  status: boolean;
  message: string;
  pdfLink: string;
  downloadLink: string;
}


@Component({
  selector: 'app-upload-notes',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './upload-notes.component.html',
  styleUrl: './upload-notes.component.scss'
})
export class UploadNotesComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadedNotes: UploadedNote[] = [];
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';
  
  classes: Class[] = [];
  filteredSubjects: Subject[] = [];
  filteredChapters: Chapter[] = [];
  
  API_URL = "https://script.google.com/macros/s/AKfycbzdLU0GofvKm5falVkRf-NCgWs64CC0N8U2YFbUvhe5_y3N_yHzESsuvpEWlbr93ig_-Q/exec";

  constructor(private fb: FormBuilder, private appService: ApplicationServiceService) {
    this.uploadForm = this.fb.group({
      classId: ['', Validators.required],
      subjectId: [{ value: '', disabled: true }, Validators.required],
      chapterId: [{ value: '', disabled: true }, Validators.required]
    });
    
    this.loadClasses();
    this.setupFormListeners();
  }

  private loadClasses(): void {
    this.classes = [
      {
        id: 1,
        name: 'Class 6',
        value: 6,
        subjects: [
          {
            id: 101,
            name: 'Mathematics',
            classId: 1,
            chapters: [
              { id: 1001, name: 'Knowing Our Numbers', order: 1 },
              { id: 1002, name: 'Whole Numbers', order: 2 },
              { id: 1003, name: 'Playing with Numbers', order: 3 },
              { id: 1004, name: 'Basic Geometrical Ideas', order: 4 },
              { id: 1005, name: 'Understanding Elementary Shapes', order: 5 },
              { id: 1006, name: 'Integers', order: 6 },
              { id: 1007, name: 'Fractions', order: 7 },
              { id: 1008, name: 'Decimals', order: 8 },
              { id: 1009, name: 'Data Handling', order: 9 },
              { id: 1010, name: 'Mensuration', order: 10 },
              { id: 1011, name: 'Algebra', order: 11 },
              { id: 1012, name: 'Ratio and Proportion', order: 12 },
              { id: 1013, name: 'Symmetry', order: 13 },
              { id: 1014, name: 'Practical Geometry', order: 14 }
            ]
          },
          {
            id: 102,
            name: 'Science',
            classId: 1,
            chapters: [
              { id: 1101, name: 'Food: Where Does It Come From?', order: 1 },
              { id: 1102, name: 'Components of Food', order: 2 },
              { id: 1103, name: 'Fibre to Fabric', order: 3 },
              { id: 1104, name: 'Sorting Materials into Groups', order: 4 },
              { id: 1105, name: 'Separation of Substances', order: 5 },
              { id: 1106, name: 'Changes Around Us', order: 6 },
              { id: 1107, name: 'Getting to Know Plants', order: 7 },
              { id: 1108, name: 'Body Movements', order: 8 },
              { id: 1109, name: 'The Living Organisms', order: 9 },
              { id: 1110, name: 'Motion and Measurement', order: 10 },
              { id: 1111, name: 'Light, Shadows and Reflections', order: 11 },
              { id: 1112, name: 'Electricity and Circuits', order: 12 },
              { id: 1113, name: 'Fun with Magnets', order: 13 },
              { id: 1114, name: 'Water', order: 14 },
              { id: 1115, name: 'Air Around Us', order: 15 },
              { id: 1116, name: 'Garbage In, Garbage Out', order: 16 }
            ]
          },
          {
            id: 103,
            name: 'Social Science',
            classId: 1,
            chapters: [
              { id: 1201, name: 'What, Where, How and When?', order: 1 },
              { id: 1202, name: 'From Hunting-Gathering to Growing Food', order: 2 },
              { id: 1203, name: 'In the Earliest Cities', order: 3 },
              { id: 1204, name: 'What Books and Burials Tell Us', order: 4 },
              { id: 1205, name: 'Kingdoms, Kings and an Early Republic', order: 5 },
              { id: 1206, name: 'New Questions and Ideas', order: 6 },
              { id: 1207, name: 'Ashoka, The Emperor Who Gave Up War', order: 7 },
              { id: 1208, name: 'Vital Villages, Thriving Towns', order: 8 },
              { id: 1209, name: 'Traders, Kings and Pilgrims', order: 9 },
              { id: 1210, name: 'New Empires and Kingdoms', order: 10 },
              { id: 1211, name: 'Buildings, Paintings and Books', order: 11 },
              { id: 1212, name: 'Diversity and Discrimination', order: 12 },
              { id: 1213, name: 'Government', order: 13 },
              { id: 1214, name: 'Local Government and Administration', order: 14 },
              { id: 1215, name: 'Livelihoods', order: 15 }
            ]
          },
          {
            id: 104,
            name: 'English',
            classId: 1,
            chapters: [
              { id: 1301, name: 'Reading Comprehension', order: 1 },
              { id: 1302, name: 'Writing Skills', order: 2 },
              { id: 1303, name: 'Grammar - Parts of Speech', order: 3 },
              { id: 1304, name: 'Grammar - Tenses', order: 4 },
              { id: 1305, name: 'Grammar - Articles', order: 5 },
              { id: 1306, name: 'Grammar - Prepositions', order: 6 },
              { id: 1307, name: 'Grammar - Conjunctions', order: 7 },
              { id: 1308, name: 'Vocabulary Building', order: 8 },
              { id: 1309, name: 'Poetry', order: 9 },
              { id: 1310, name: 'Prose', order: 10 },
              { id: 1311, name: 'Story Writing', order: 11 },
              { id: 1312, name: 'Letter Writing', order: 12 },
              { id: 1313, name: 'Essay Writing', order: 13 }
            ]
          },
          {
            id: 105,
            name: 'Hindi',
            classId: 1,
            chapters: [
              { id: 1401, name: 'वर्ण विचार', order: 1 },
              { id: 1402, name: 'शब्द विचार', order: 2 },
              { id: 1403, name: 'वाक्य विचार', order: 3 },
              { id: 1404, name: 'संज्ञा', order: 4 },
              { id: 1405, name: 'सर्वनाम', order: 5 },
              { id: 1406, name: 'विशेषण', order: 6 },
              { id: 1407, name: 'क्रिया', order: 7 },
              { id: 1408, name: 'अपठित गद्यांश', order: 8 },
              { id: 1409, name: 'अपठित पद्यांश', order: 9 },
              { id: 1410, name: 'पत्र लेखन', order: 10 },
              { id: 1411, name: 'निबंध लेखन', order: 11 },
              { id: 1412, name: 'कहानी लेखन', order: 12 }
            ]
          },
          {
            id: 106,
            name: 'Computer Science',
            classId: 1,
            chapters: [
              { id: 1501, name: 'Introduction to Computers', order: 1 },
              { id: 1502, name: 'Computer Components', order: 2 },
              { id: 1503, name: 'Input and Output Devices', order: 3 },
              { id: 1504, name: 'Introduction to Windows', order: 4 },
              { id: 1505, name: 'MS Paint', order: 5 },
              { id: 1506, name: 'Introduction to MS Word', order: 6 },
              { id: 1507, name: 'Introduction to Internet', order: 7 },
              { id: 1508, name: 'Computer Ethics', order: 8 }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Class 7',
        value: 7,
        subjects: [
          {
            id: 201,
            name: 'Mathematics',
            classId: 2,
            chapters: [
              { id: 2001, name: 'Integers', order: 1 },
              { id: 2002, name: 'Fractions and Decimals', order: 2 },
              { id: 2003, name: 'Data Handling', order: 3 },
              { id: 2004, name: 'Simple Equations', order: 4 },
              { id: 2005, name: 'Lines and Angles', order: 5 },
              { id: 2006, name: 'The Triangle and Its Properties', order: 6 },
              { id: 2007, name: 'Congruence of Triangles', order: 7 },
              { id: 2008, name: 'Comparing Quantities', order: 8 },
              { id: 2009, name: 'Rational Numbers', order: 9 },
              { id: 2010, name: 'Practical Geometry', order: 10 },
              { id: 2011, name: 'Perimeter and Area', order: 11 },
              { id: 2012, name: 'Algebraic Expressions', order: 12 },
              { id: 2013, name: 'Exponents and Powers', order: 13 },
              { id: 2014, name: 'Symmetry', order: 14 },
              { id: 2015, name: 'Visualising Solid Shapes', order: 15 }
            ]
          },
          {
            id: 202,
            name: 'Science',
            classId: 2,
            chapters: [
              { id: 2101, name: 'Nutrition in Plants', order: 1 },
              { id: 2102, name: 'Nutrition in Animals', order: 2 },
              { id: 2103, name: 'Fibre to Fabric', order: 3 },
              { id: 2104, name: 'Heat', order: 4 },
              { id: 2105, name: 'Acids, Bases and Salts', order: 5 },
              { id: 2106, name: 'Physical and Chemical Changes', order: 6 },
              { id: 2107, name: 'Weather, Climate and Adaptations', order: 7 },
              { id: 2108, name: 'Winds, Storms and Cyclones', order: 8 },
              { id: 2109, name: 'Soil', order: 9 },
              { id: 2110, name: 'Respiration in Organisms', order: 10 },
              { id: 2111, name: 'Transportation in Animals and Plants', order: 11 },
              { id: 2112, name: 'Reproduction in Plants', order: 12 },
              { id: 2113, name: 'Motion and Time', order: 13 },
              { id: 2114, name: 'Electric Current and Its Effects', order: 14 },
              { id: 2115, name: 'Light', order: 15 },
              { id: 2116, name: 'Water: A Precious Resource', order: 16 },
              { id: 2117, name: 'Forests: Our Lifeline', order: 17 },
              { id: 2118, name: 'Wastewater Story', order: 18 }
            ]
          },
          {
            id: 203,
            name: 'Social Science',
            classId: 2,
            chapters: [
              { id: 2201, name: 'Tracing Changes Through a Thousand Years', order: 1 },
              { id: 2202, name: 'New Kings and Kingdoms', order: 2 },
              { id: 2203, name: 'The Delhi Sultans', order: 3 },
              { id: 2204, name: 'The Mughal Empire', order: 4 },
              { id: 2205, name: 'Rulers and Buildings', order: 5 },
              { id: 2206, name: 'Towns, Traders and Craftspersons', order: 6 },
              { id: 2207, name: 'Tribes, Nomads and Settled Communities', order: 7 },
              { id: 2208, name: 'Devotional Paths to the Divine', order: 8 },
              { id: 2209, name: 'The Making of Regional Cultures', order: 9 },
              { id: 2210, name: 'Eighteenth-Century Political Formations', order: 10 },
              { id: 2211, name: 'Environment', order: 11 },
              { id: 2212, name: 'Inside Our Earth', order: 12 },
              { id: 2213, name: 'Our Changing Earth', order: 13 },
              { id: 2214, name: 'Air', order: 14 },
              { id: 2215, name: 'Water', order: 15 },
              { id: 2216, name: 'Natural Vegetation and Wildlife', order: 16 },
              { id: 2217, name: 'Human Environment', order: 17 },
              { id: 2218, name: 'Equality in Indian Democracy', order: 18 },
              { id: 2219, name: 'State Government', order: 19 },
              { id: 2220, name: 'Gender and Inequality', order: 20 },
              { id: 2221, name: 'Media and Democracy', order: 21 }
            ]
          },
          {
            id: 204,
            name: 'English',
            classId: 2,
            chapters: [
              { id: 2301, name: 'Reading Comprehension', order: 1 },
              { id: 2302, name: 'Writing - Notice', order: 2 },
              { id: 2303, name: 'Writing - Message', order: 3 },
              { id: 2304, name: 'Writing - Diary Entry', order: 4 },
              { id: 2305, name: 'Grammar - Tenses', order: 5 },
              { id: 2306, name: 'Grammar - Modals', order: 6 },
              { id: 2307, name: 'Grammar - Active and Passive Voice', order: 7 },
              { id: 2308, name: 'Grammar - Direct and Indirect Speech', order: 8 },
              { id: 2309, name: 'Grammar - Clauses', order: 9 },
              { id: 2310, name: 'Grammar - Determiners', order: 10 },
              { id: 2311, name: 'Vocabulary - Synonyms and Antonyms', order: 11 },
              { id: 2312, name: 'Vocabulary - Idioms and Phrases', order: 12 },
              { id: 2313, name: 'Literature - Prose', order: 13 },
              { id: 2314, name: 'Literature - Poetry', order: 14 },
              { id: 2315, name: 'Literature - Supplementary Reader', order: 15 }
            ]
          },
          {
            id: 205,
            name: 'Hindi',
            classId: 2,
            chapters: [
              { id: 2401, name: 'वाक्य अशुद्धियाँ और संशोधन', order: 1 },
              { id: 2402, name: 'मुहावरे और लोकोक्तियाँ', order: 2 },
              { id: 2403, name: 'अपठित गद्यांश', order: 3 },
              { id: 2404, name: 'अपठित पद्यांश', order: 4 },
              { id: 2405, name: 'पत्र लेखन', order: 5 },
              { id: 2406, name: 'निबंध लेखन', order: 6 },
              { id: 2407, name: 'कहानी लेखन', order: 7 },
              { id: 2408, name: 'संवाद लेखन', order: 8 },
              { id: 2409, name: 'विज्ञापन लेखन', order: 9 },
              { id: 2410, name: 'व्याकरण - वचन', order: 10 },
              { id: 2411, name: 'व्याकरण - लिंग', order: 11 },
              { id: 2412, name: 'व्याकरण - काल', order: 12 },
              { id: 2413, name: 'व्याकरण - वाच्य', order: 13 }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Class 8',
        value: 8,
        subjects: [
          {
            id: 301,
            name: 'Mathematics',
            classId: 3,
            chapters: [
              { id: 3001, name: 'Rational Numbers', order: 1 },
              { id: 3002, name: 'Linear Equations in One Variable', order: 2 },
              { id: 3003, name: 'Understanding Quadrilaterals', order: 3 },
              { id: 3004, name: 'Practical Geometry', order: 4 },
              { id: 3005, name: 'Data Handling', order: 5 },
              { id: 3006, name: 'Squares and Square Roots', order: 6 },
              { id: 3007, name: 'Cubes and Cube Roots', order: 7 },
              { id: 3008, name: 'Comparing Quantities', order: 8 },
              { id: 3009, name: 'Algebraic Expressions and Identities', order: 9 },
              { id: 3010, name: 'Visualising Solid Shapes', order: 10 },
              { id: 3011, name: 'Mensuration', order: 11 },
              { id: 3012, name: 'Exponents and Powers', order: 12 },
              { id: 3013, name: 'Direct and Inverse Proportions', order: 13 },
              { id: 3014, name: 'Factorisation', order: 14 },
              { id: 3015, name: 'Introduction to Graphs', order: 15 },
              { id: 3016, name: 'Playing with Numbers', order: 16 }
            ]
          },
          {
            id: 302,
            name: 'Science',
            classId: 3,
            chapters: [
              { id: 3101, name: 'Crop Production and Management', order: 1 },
              { id: 3102, name: 'Microorganisms: Friend and Foe', order: 2 },
              { id: 3103, name: 'Synthetic Fibres and Plastics', order: 3 },
              { id: 3104, name: 'Materials: Metals and Non-Metals', order: 4 },
              { id: 3105, name: 'Coal and Petroleum', order: 5 },
              { id: 3106, name: 'Combustion and Flame', order: 6 },
              { id: 3107, name: 'Conservation of Plants and Animals', order: 7 },
              { id: 3108, name: 'Cell - Structure and Functions', order: 8 },
              { id: 3109, name: 'Reproduction in Animals', order: 9 },
              { id: 3110, name: 'Reaching the Age of Adolescence', order: 10 },
              { id: 3111, name: 'Force and Pressure', order: 11 },
              { id: 3112, name: 'Friction', order: 12 },
              { id: 3113, name: 'Sound', order: 13 },
              { id: 3114, name: 'Chemical Effects of Electric Current', order: 14 },
              { id: 3115, name: 'Some Natural Phenomena', order: 15 },
              { id: 3116, name: 'Light', order: 16 },
              { id: 3117, name: 'Stars and the Solar System', order: 17 },
              { id: 3118, name: 'Pollution of Air and Water', order: 18 }
            ]
          },
          {
            id: 303,
            name: 'Social Science',
            classId: 3,
            chapters: [
              { id: 3201, name: 'How, When and Where', order: 1 },
              { id: 3202, name: 'From Trade to Territory', order: 2 },
              { id: 3203, name: 'Ruling the Countryside', order: 3 },
              { id: 3204, name: 'Tribals, Dikus and the Vision of a Golden Age', order: 4 },
              { id: 3205, name: 'When People Rebel 1857 and After', order: 5 },
              { id: 3206, name: 'Colonialism and the City', order: 6 },
              { id: 3207, name: 'Weavers, Iron Smelters and Factory Owners', order: 7 },
              { id: 3208, name: 'Civilising the "Native", Educating the Nation', order: 8 },
              { id: 3209, name: 'Women, Caste and Reform', order: 9 },
              { id: 3210, name: 'The Changing World of Visual Arts', order: 10 },
              { id: 3211, name: 'The Making of the National Movement: 1870s-1947', order: 11 },
              { id: 3212, name: 'India After Independence', order: 12 },
              { id: 3213, name: 'Resources', order: 13 },
              { id: 3214, name: 'Land, Soil, Water, Natural Vegetation and Wildlife Resources', order: 14 },
              { id: 3215, name: 'Mineral and Power Resources', order: 15 },
              { id: 3216, name: 'Agriculture', order: 16 },
              { id: 3217, name: 'Industries', order: 17 },
              { id: 3218, name: 'Human Resources', order: 18 },
              { id: 3219, name: 'The Indian Constitution', order: 19 },
              { id: 3220, name: 'Understanding Secularism', order: 20 },
              { id: 3221, name: 'Why Do We Need a Parliament?', order: 21 },
              { id: 3222, name: 'Understanding Laws', order: 22 },
              { id: 3223, name: 'Judiciary', order: 23 },
              { id: 3224, name: 'Understanding Our Criminal Justice System', order: 24 },
              { id: 3225, name: 'Understanding Marginalisation', order: 25 },
              { id: 3226, name: 'Confronting Marginalisation', order: 26 },
              { id: 3227, name: 'Public Facilities', order: 27 },
              { id: 3228, name: 'Law and Social Justice', order: 28 }
            ]
          }
        ]
      },
      {
        id: 4,
        name: 'Class 9',
        value: 9,
        subjects: [
          {
            id: 401,
            name: 'Mathematics',
            classId: 4,
            chapters: [
              { id: 4001, name: 'Number Systems', order: 1 },
              { id: 4002, name: 'Polynomials', order: 2 },
              { id: 4003, name: 'Coordinate Geometry', order: 3 },
              { id: 4004, name: 'Linear Equations in Two Variables', order: 4 },
              { id: 4005, name: 'Introduction to Euclid\'s Geometry', order: 5 },
              { id: 4006, name: 'Lines and Angles', order: 6 },
              { id: 4007, name: 'Triangles', order: 7 },
              { id: 4008, name: 'Quadrilaterals', order: 8 },
              { id: 4009, name: 'Areas of Parallelograms and Triangles', order: 9 },
              { id: 4010, name: 'Circles', order: 10 },
              { id: 4011, name: 'Constructions', order: 11 },
              { id: 4012, name: 'Heron\'s Formula', order: 12 },
              { id: 4013, name: 'Surface Areas and Volumes', order: 13 },
              { id: 4014, name: 'Statistics', order: 14 },
              { id: 4015, name: 'Probability', order: 15 }
            ]
          },
          {
            id: 402,
            name: 'Science',
            classId: 4,
            chapters: [
              { id: 4101, name: 'Matter in Our Surroundings', order: 1 },
              { id: 4102, name: 'Is Matter Around Us Pure?', order: 2 },
              { id: 4103, name: 'Atoms and Molecules', order: 3 },
              { id: 4104, name: 'Structure of the Atom', order: 4 },
              { id: 4105, name: 'The Fundamental Unit of Life', order: 5 },
              { id: 4106, name: 'Tissues', order: 6 },
              { id: 4107, name: 'Diversity in Living Organisms', order: 7 },
              { id: 4108, name: 'Motion', order: 8 },
              { id: 4109, name: 'Force and Laws of Motion', order: 9 },
              { id: 4110, name: 'Gravitation', order: 10 },
              { id: 4111, name: 'Work and Energy', order: 11 },
              { id: 4112, name: 'Sound', order: 12 },
              { id: 4113, name: 'Why Do We Fall Ill?', order: 13 },
              { id: 4114, name: 'Natural Resources', order: 14 },
              { id: 4115, name: 'Improvement in Food Resources', order: 15 }
            ]
          },
          {
            id: 403,
            name: 'Social Science',
            classId: 4,
            chapters: [
              { id: 4201, name: 'The French Revolution', order: 1 },
              { id: 4202, name: 'Socialism in Europe and the Russian Revolution', order: 2 },
              { id: 4203, name: 'Nazism and the Rise of Hitler', order: 3 },
              { id: 4204, name: 'Forest Society and Colonialism', order: 4 },
              { id: 4205, name: 'Pastoralists in the Modern World', order: 5 },
              { id: 4206, name: 'India - Size and Location', order: 6 },
              { id: 4207, name: 'Physical Features of India', order: 7 },
              { id: 4208, name: 'Drainage', order: 8 },
              { id: 4209, name: 'Climate', order: 9 },
              { id: 4210, name: 'Natural Vegetation and Wildlife', order: 10 },
              { id: 4211, name: 'Population', order: 11 },
              { id: 4212, name: 'What is Democracy? Why Democracy?', order: 12 },
              { id: 4213, name: 'Constitutional Design', order: 13 },
              { id: 4214, name: 'Electoral Politics', order: 14 },
              { id: 4215, name: 'Working of Institutions', order: 15 },
              { id: 4216, name: 'Democratic Rights', order: 16 },
              { id: 4217, name: 'The Story of Village Palampur', order: 17 },
              { id: 4218, name: 'People as Resource', order: 18 },
              { id: 4219, name: 'Poverty as a Challenge', order: 19 },
              { id: 4220, name: 'Food Security in India', order: 20 }
            ]
          },
          {
            id: 404,
            name: 'English',
            classId: 4,
            chapters: [
              { id: 4301, name: 'Reading Comprehension', order: 1 },
              { id: 4302, name: 'Writing - Diary Entry', order: 2 },
              { id: 4303, name: 'Writing - Article Writing', order: 3 },
              { id: 4304, name: 'Writing - Speech Writing', order: 4 },
              { id: 4305, name: 'Writing - Story Writing', order: 5 },
              { id: 4306, name: 'Grammar - Tenses', order: 6 },
              { id: 4307, name: 'Grammar - Modals', order: 7 },
              { id: 4308, name: 'Grammar - Subject-Verb Agreement', order: 8 },
              { id: 4309, name: 'Grammar - Reported Speech', order: 9 },
              { id: 4310, name: 'Grammar - Commands and Requests', order: 10 },
              { id: 4311, name: 'Grammar - Statements', order: 11 },
              { id: 4312, name: 'Grammar - Questions', order: 12 },
              { id: 4313, name: 'Literature - Prose', order: 13 },
              { id: 4314, name: 'Literature - Poetry', order: 14 },
              { id: 4315, name: 'Literature - Drama', order: 15 },
              { id: 4316, name: 'Literature - Supplementary Reader', order: 16 }
            ]
          },
          {
            id: 405,
            name: 'Hindi',
            classId: 4,
            chapters: [
              { id: 4401, name: 'अपठित गद्यांश', order: 1 },
              { id: 4402, name: 'अपठित पद्यांश', order: 2 },
              { id: 4403, name: 'पत्र लेखन', order: 3 },
              { id: 4404, name: 'निबंध लेखन', order: 4 },
              { id: 4405, name: 'वार्तालाप लेखन', order: 5 },
              { id: 4406, name: 'सूचना लेखन', order: 6 },
              { id: 4407, name: 'विज्ञापन लेखन', order: 7 },
              { id: 4408, name: 'संदेश लेखन', order: 8 },
              { id: 4409, name: 'व्याकरण - संज्ञा', order: 9 },
              { id: 4410, name: 'व्याकरण - सर्वनाम', order: 10 },
              { id: 4411, name: 'व्याकरण - विशेषण', order: 11 },
              { id: 4412, name: 'व्याकरण - क्रिया', order: 12 },
              { id: 4413, name: 'व्याकरण - वाच्य', order: 13 },
              { id: 4414, name: 'व्याकरण - पद परिचय', order: 14 },
              { id: 4415, name: 'व्याकरण - रस', order: 15 },
              { id: 4416, name: 'व्याकरण - छंद', order: 16 },
              { id: 4417, name: 'व्याकरण - अलंकार', order: 17 }
            ]
          }
        ]
      },
      {
        id: 5,
        name: 'Class 10',
        value: 10,
        subjects: [
          {
            id: 501,
            name: 'Mathematics',
            classId: 5,
            chapters: [
              { id: 5001, name: 'Real Numbers', order: 1 },
              { id: 5002, name: 'Polynomials', order: 2 },
              { id: 5003, name: 'Pair of Linear Equations in Two Variables', order: 3 },
              { id: 5004, name: 'Quadratic Equations', order: 4 },
              { id: 5005, name: 'Arithmetic Progressions', order: 5 },
              { id: 5006, name: 'Triangles', order: 6 },
              { id: 5007, name: 'Coordinate Geometry', order: 7 },
              { id: 5008, name: 'Introduction to Trigonometry', order: 8 },
              { id: 5009, name: 'Some Applications of Trigonometry', order: 9 },
              { id: 5010, name: 'Circles', order: 10 },
              { id: 5011, name: 'Constructions', order: 11 },
              { id: 5012, name: 'Areas Related to Circles', order: 12 },
              { id: 5013, name: 'Surface Areas and Volumes', order: 13 },
              { id: 5014, name: 'Statistics', order: 14 },
              { id: 5015, name: 'Probability', order: 15 }
            ]
          },
          {
            id: 502,
            name: 'Science',
            classId: 5,
            chapters: [
              { id: 5101, name: 'Chemical Reactions and Equations', order: 1 },
              { id: 5102, name: 'Acids, Bases and Salts', order: 2 },
              { id: 5103, name: 'Metals and Non-metals', order: 3 },
              { id: 5104, name: 'Carbon and its Compounds', order: 4 },
              { id: 5105, name: 'Periodic Classification of Elements', order: 5 },
              { id: 5106, name: 'Life Processes', order: 6 },
              { id: 5107, name: 'Control and Coordination', order: 7 },
              { id: 5108, name: 'How do Organisms Reproduce?', order: 8 },
              { id: 5109, name: 'Heredity and Evolution', order: 9 },
              { id: 5110, name: 'Light – Reflection and Refraction', order: 10 },
              { id: 5111, name: 'Human Eye and Colourful World', order: 11 },
              { id: 5112, name: 'Electricity', order: 12 },
              { id: 5113, name: 'Magnetic Effects of Electric Current', order: 13 },
              { id: 5114, name: 'Sources of Energy', order: 14 },
              { id: 5115, name: 'Our Environment', order: 15 },
              { id: 5116, name: 'Sustainable Management of Natural Resources', order: 16 }
            ]
          },
          {
            id: 503,
            name: 'Social Science',
            classId: 5,
            chapters: [
              { id: 5201, name: 'The Rise of Nationalism in Europe', order: 1 },
              { id: 5202, name: 'Nationalism in India', order: 2 },
              { id: 5203, name: 'The Making of a Global World', order: 3 },
              { id: 5204, name: 'The Age of Industrialisation', order: 4 },
              { id: 5205, name: 'Print Culture and the Modern World', order: 5 },
              { id: 5206, name: 'Resources and Development', order: 6 },
              { id: 5207, name: 'Forest and Wildlife Resources', order: 7 },
              { id: 5208, name: 'Water Resources', order: 8 },
              { id: 5209, name: 'Agriculture', order: 9 },
              { id: 5210, name: 'Minerals and Energy Resources', order: 10 },
              { id: 5211, name: 'Manufacturing Industries', order: 11 },
              { id: 5212, name: 'Lifelines of National Economy', order: 12 },
              { id: 5213, name: 'Power-sharing', order: 13 },
              { id: 5214, name: 'Federalism', order: 14 },
              { id: 5215, name: 'Democracy and Diversity', order: 15 },
              { id: 5216, name: 'Gender, Religion and Caste', order: 16 },
              { id: 5217, name: 'Popular Struggles and Movements', order: 17 },
              { id: 5218, name: 'Political Parties', order: 18 },
              { id: 5219, name: 'Outcomes of Democracy', order: 19 },
              { id: 5220, name: 'Challenges to Democracy', order: 20 },
              { id: 5221, name: 'Development', order: 21 },
              { id: 5222, name: 'Sectors of the Indian Economy', order: 22 },
              { id: 5223, name: 'Money and Credit', order: 23 },
              { id: 5224, name: 'Globalisation and the Indian Economy', order: 24 },
              { id: 5225, name: 'Consumer Rights', order: 25 }
            ]
          },
          {
            id: 504,
            name: 'English',
            classId: 5,
            chapters: [
              { id: 5301, name: 'Reading Comprehension', order: 1 },
              { id: 5302, name: 'Writing - Formal Letter', order: 2 },
              { id: 5303, name: 'Writing - Informal Letter', order: 3 },
              { id: 5304, name: 'Writing - Article Writing', order: 4 },
              { id: 5305, name: 'Writing - Speech Writing', order: 5 },
              { id: 5306, name: 'Writing - Story Writing', order: 6 },
              { id: 5307, name: 'Grammar - Tenses', order: 7 },
              { id: 5308, name: 'Grammar - Modals', order: 8 },
              { id: 5309, name: 'Grammar - Active and Passive Voice', order: 9 },
              { id: 5310, name: 'Grammar - Reported Speech', order: 10 },
              { id: 5311, name: 'Grammar - Clauses', order: 11 },
              { id: 5312, name: 'Grammar - Determiners', order: 12 },
              { id: 5313, name: 'Grammar - Prepositions', order: 13 },
              { id: 5314, name: 'Literature - First Flight (Prose)', order: 14 },
              { id: 5315, name: 'Literature - First Flight (Poetry)', order: 15 },
              { id: 5316, name: 'Literature - Footprints Without Feet', order: 16 }
            ]
          },
          {
            id: 505,
            name: 'Hindi',
            classId: 5,
            chapters: [
              { id: 5401, name: 'अपठित गद्यांश', order: 1 },
              { id: 5402, name: 'अपठित पद्यांश', order: 2 },
              { id: 5403, name: 'पत्र लेखन', order: 3 },
              { id: 5404, name: 'निबंध लेखन', order: 4 },
              { id: 5405, name: 'विज्ञापन लेखन', order: 5 },
              { id: 5406, name: 'संदेश लेखन', order: 6 },
              { id: 5407, name: 'सूचना लेखन', order: 7 },
              { id: 5408, name: 'अनुच्छेद लेखन', order: 8 },
              { id: 5409, name: 'व्याकरण - वाच्य', order: 9 },
              { id: 5410, name: 'व्याकरण - पद परिचय', order: 10 },
              { id: 5411, name: 'व्याकरण - रस', order: 11 },
              { id: 5412, name: 'व्याकरण - छंद', order: 12 },
              { id: 5413, name: 'व्याकरण - अलंकार', order: 13 },
              { id: 5414, name: 'व्याकरण - समास', order: 14 },
              { id: 5415, name: 'व्याकरण - मुहावरे', order: 15 },
              { id: 5416, name: 'व्याकरण - लोकोक्तियाँ', order: 16 }
            ]
          }
        ]
      },
      {
        id: 6,
        name: 'Class 11',
        value: 11,
        subjects: [
          {
            id: 601,
            name: 'Mathematics',
            classId: 6,
            chapters: [
              { id: 6001, name: 'Sets', order: 1 },
              { id: 6002, name: 'Relations and Functions', order: 2 },
              { id: 6003, name: 'Trigonometric Functions', order: 3 },
              { id: 6004, name: 'Principle of Mathematical Induction', order: 4 },
              { id: 6005, name: 'Complex Numbers and Quadratic Equations', order: 5 },
              { id: 6006, name: 'Linear Inequalities', order: 6 },
              { id: 6007, name: 'Permutations and Combinations', order: 7 },
              { id: 6008, name: 'Binomial Theorem', order: 8 },
              { id: 6009, name: 'Sequences and Series', order: 9 },
              { id: 6010, name: 'Straight Lines', order: 10 },
              { id: 6011, name: 'Conic Sections', order: 11 },
              { id: 6012, name: 'Introduction to Three Dimensional Geometry', order: 12 },
              { id: 6013, name: 'Limits and Derivatives', order: 13 },
              { id: 6014, name: 'Mathematical Reasoning', order: 14 },
              { id: 6015, name: 'Statistics', order: 15 },
              { id: 6016, name: 'Probability', order: 16 }
            ]
          },
          {
            id: 602,
            name: 'Physics',
            classId: 6,
            chapters: [
              { id: 6101, name: 'Physical World', order: 1 },
              { id: 6102, name: 'Units and Measurements', order: 2 },
              { id: 6103, name: 'Motion in a Straight Line', order: 3 },
              { id: 6104, name: 'Motion in a Plane', order: 4 },
              { id: 6105, name: 'Laws of Motion', order: 5 },
              { id: 6106, name: 'Work, Energy and Power', order: 6 },
              { id: 6107, name: 'System of Particles and Rotational Motion', order: 7 },
              { id: 6108, name: 'Gravitation', order: 8 },
              { id: 6109, name: 'Mechanical Properties of Solids', order: 9 },
              { id: 6110, name: 'Mechanical Properties of Fluids', order: 10 },
              { id: 6111, name: 'Thermal Properties of Matter', order: 11 },
              { id: 6112, name: 'Thermodynamics', order: 12 },
              { id: 6113, name: 'Kinetic Theory', order: 13 },
              { id: 6114, name: 'Oscillations', order: 14 },
              { id: 6115, name: 'Waves', order: 15 }
            ]
          },
          {
            id: 603,
            name: 'Chemistry',
            classId: 6,
            chapters: [
              { id: 6201, name: 'Some Basic Concepts of Chemistry', order: 1 },
              { id: 6202, name: 'Structure of Atom', order: 2 },
              { id: 6203, name: 'Classification of Elements and Periodicity in Properties', order: 3 },
              { id: 6204, name: 'Chemical Bonding and Molecular Structure', order: 4 },
              { id: 6205, name: 'States of Matter', order: 5 },
              { id: 6206, name: 'Thermodynamics', order: 6 },
              { id: 6207, name: 'Equilibrium', order: 7 },
              { id: 6208, name: 'Redox Reactions', order: 8 },
              { id: 6209, name: 'Hydrogen', order: 9 },
              { id: 6210, name: 'The s-Block Elements', order: 10 },
              { id: 6211, name: 'The p-Block Elements', order: 11 },
              { id: 6212, name: 'Organic Chemistry - Some Basic Principles and Techniques', order: 12 },
              { id: 6213, name: 'Hydrocarbons', order: 13 },
              { id: 6214, name: 'Environmental Chemistry', order: 14 }
            ]
          },
          {
            id: 604,
            name: 'Biology',
            classId: 6,
            chapters: [
              { id: 6301, name: 'The Living World', order: 1 },
              { id: 6302, name: 'Biological Classification', order: 2 },
              { id: 6303, name: 'Plant Kingdom', order: 3 },
              { id: 6304, name: 'Animal Kingdom', order: 4 },
              { id: 6305, name: 'Morphology of Flowering Plants', order: 5 },
              { id: 6306, name: 'Anatomy of Flowering Plants', order: 6 },
              { id: 6307, name: 'Structural Organisation in Animals', order: 7 },
              { id: 6308, name: 'Cell: The Unit of Life', order: 8 },
              { id: 6309, name: 'Biomolecules', order: 9 },
              { id: 6310, name: 'Cell Cycle and Cell Division', order: 10 },
              { id: 6311, name: 'Transport in Plants', order: 11 },
              { id: 6312, name: 'Mineral Nutrition', order: 12 },
              { id: 6313, name: 'Photosynthesis in Higher Plants', order: 13 },
              { id: 6314, name: 'Respiration in Plants', order: 14 },
              { id: 6315, name: 'Plant Growth and Development', order: 15 },
              { id: 6316, name: 'Digestion and Absorption', order: 16 },
              { id: 6317, name: 'Breathing and Exchange of Gases', order: 17 },
              { id: 6318, name: 'Body Fluids and Circulation', order: 18 },
              { id: 6319, name: 'Excretory Products and their Elimination', order: 19 },
              { id: 6320, name: 'Locomotion and Movement', order: 20 },
              { id: 6321, name: 'Neural Control and Coordination', order: 21 },
              { id: 6322, name: 'Chemical Coordination and Integration', order: 22 }
            ]
          },
          {
            id: 605,
            name: 'Accountancy',
            classId: 6,
            chapters: [
              { id: 6401, name: 'Introduction to Accounting', order: 1 },
              { id: 6402, name: 'Theory Base of Accounting', order: 2 },
              { id: 6403, name: 'Recording of Transactions - I', order: 3 },
              { id: 6404, name: 'Recording of Transactions - II', order: 4 },
              { id: 6405, name: 'Bank Reconciliation Statement', order: 5 },
              { id: 6406, name: 'Trial Balance and Rectification of Errors', order: 6 },
              { id: 6407, name: 'Depreciation, Provisions and Reserves', order: 7 },
              { id: 6408, name: 'Bills of Exchange', order: 8 },
              { id: 6409, name: 'Financial Statements - I', order: 9 },
              { id: 6410, name: 'Financial Statements - II', order: 10 },
              { id: 6411, name: 'Accounts from Incomplete Records', order: 11 },
              { id: 6412, name: 'Applications of Computers in Accounting', order: 12 },
              { id: 6413, name: 'Computerised Accounting System', order: 13 }
            ]
          },
          {
            id: 606,
            name: 'Business Studies',
            classId: 6,
            chapters: [
              { id: 6501, name: 'Nature and Purpose of Business', order: 1 },
              { id: 6502, name: 'Forms of Business Organisations', order: 2 },
              { id: 6503, name: 'Private, Public and Global Enterprises', order: 3 },
              { id: 6504, name: 'Business Services', order: 4 },
              { id: 6505, name: 'Emerging Modes of Business', order: 5 },
              { id: 6506, name: 'Social Responsibilities of Business and Business Ethics', order: 6 },
              { id: 6507, name: 'Formation of a Company', order: 7 },
              { id: 6508, name: 'Sources of Business Finance', order: 8 },
              { id: 6509, name: 'Small Business', order: 9 },
              { id: 6510, name: 'Internal Trade', order: 10 },
              { id: 6511, name: 'International Business', order: 11 },
              { id: 6512, name: 'Project Work', order: 12 }
            ]
          },
          {
            id: 607,
            name: 'Economics',
            classId: 6,
            chapters: [
              { id: 6601, name: 'Introduction to Economics', order: 1 },
              { id: 6602, name: 'Collection of Data', order: 2 },
              { id: 6603, name: 'Organisation of Data', order: 3 },
              { id: 6604, name: 'Presentation of Data', order: 4 },
              { id: 6605, name: 'Measures of Central Tendency', order: 5 },
              { id: 6606, name: 'Measures of Dispersion', order: 6 },
              { id: 6607, name: 'Correlation', order: 7 },
              { id: 6608, name: 'Index Numbers', order: 8 },
              { id: 6609, name: 'Indian Economy on the Eve of Independence', order: 9 },
              { id: 6610, name: 'Indian Economy 1950-1990', order: 10 },
              { id: 6611, name: 'Liberalisation, Privatisation and Globalisation', order: 11 },
              { id: 6612, name: 'Poverty', order: 12 },
              { id: 6613, name: 'Human Capital Formation in India', order: 13 },
              { id: 6614, name: 'Rural Development', order: 14 },
              { id: 6615, name: 'Employment: Growth, Informalisation and Other Issues', order: 15 },
              { id: 6616, name: 'Infrastructure', order: 16 },
              { id: 6617, name: 'Environment and Sustainable Development', order: 17 },
              { id: 6618, name: 'Comparative Development Experiences of India and its Neighbours', order: 18 }
            ]
          },
          {
            id: 608,
            name: 'Computer Science',
            classId: 6,
            chapters: [
              { id: 6701, name: 'Computer Fundamentals', order: 1 },
              { id: 6702, name: 'Programming Methodology', order: 2 },
              { id: 6703, name: 'Introduction to Python', order: 3 },
              { id: 6704, name: 'Data Handling in Python', order: 4 },
              { id: 6705, name: 'Conditional and Iterative Statements', order: 5 },
              { id: 6706, name: 'String Manipulation', order: 6 },
              { id: 6707, name: 'List Manipulation', order: 7 },
              { id: 6708, name: 'Tuple and Dictionary', order: 8 },
              { id: 6709, name: 'Functions in Python', order: 9 },
              { id: 6710, name: 'File Handling in Python', order: 10 },
              { id: 6711, name: 'Exception Handling in Python', order: 11 },
              { id: 6712, name: 'Database Concepts', order: 12 },
              { id: 6713, name: 'Structured Query Language', order: 13 },
              { id: 6714, name: 'Boolean Algebra', order: 14 },
              { id: 6715, name: 'Networking Concepts', order: 15 },
              { id: 6716, name: 'Internet and Web', order: 16 },
              { id: 6717, name: 'Societal Impacts', order: 17 }
            ]
          }
        ]
      },
      {
        id: 7,
        name: 'Class 12',
        value: 12,
        subjects: [
          {
            id: 701,
            name: 'Mathematics',
            classId: 7,
            chapters: [
              { id: 7001, name: 'Relations and Functions', order: 1 },
              { id: 7002, name: 'Inverse Trigonometric Functions', order: 2 },
              { id: 7003, name: 'Matrices', order: 3 },
              { id: 7004, name: 'Determinants', order: 4 },
              { id: 7005, name: 'Continuity and Differentiability', order: 5 },
              { id: 7006, name: 'Application of Derivatives', order: 6 },
              { id: 7007, name: 'Integrals', order: 7 },
              { id: 7008, name: 'Application of Integrals', order: 8 },
              { id: 7009, name: 'Differential Equations', order: 9 },
              { id: 7010, name: 'Vector Algebra', order: 10 },
              { id: 7011, name: 'Three Dimensional Geometry', order: 11 },
              { id: 7012, name: 'Linear Programming', order: 12 },
              { id: 7013, name: 'Probability', order: 13 }
            ]
          },
          {
            id: 702,
            name: 'Physics',
            classId: 7,
            chapters: [
              { id: 7101, name: 'Electric Charges and Fields', order: 1 },
              { id: 7102, name: 'Electrostatic Potential and Capacitance', order: 2 },
              { id: 7103, name: 'Current Electricity', order: 3 },
              { id: 7104, name: 'Moving Charges and Magnetism', order: 4 },
              { id: 7105, name: 'Magnetism and Matter', order: 5 },
              { id: 7106, name: 'Electromagnetic Induction', order: 6 },
              { id: 7107, name: 'Alternating Current', order: 7 },
              { id: 7108, name: 'Electromagnetic Waves', order: 8 },
              { id: 7109, name: 'Ray Optics and Optical Instruments', order: 9 },
              { id: 7110, name: 'Wave Optics', order: 10 },
              { id: 7111, name: 'Dual Nature of Radiation and Matter', order: 11 },
              { id: 7112, name: 'Atoms', order: 12 },
              { id: 7113, name: 'Nuclei', order: 13 },
              { id: 7114, name: 'Semiconductor Electronics', order: 14 },
              { id: 7115, name: 'Communication Systems', order: 15 }
            ]
          },
          {
            id: 703,
            name: 'Chemistry',
            classId: 7,
            chapters: [
              { id: 7201, name: 'The Solid State', order: 1 },
              { id: 7202, name: 'Solutions', order: 2 },
              { id: 7203, name: 'Electrochemistry', order: 3 },
              { id: 7204, name: 'Chemical Kinetics', order: 4 },
              { id: 7205, name: 'Surface Chemistry', order: 5 },
              { id: 7206, name: 'General Principles and Processes of Isolation of Elements', order: 6 },
              { id: 7207, name: 'The p-Block Elements', order: 7 },
              { id: 7208, name: 'The d- and f-Block Elements', order: 8 },
              { id: 7209, name: 'Coordination Compounds', order: 9 },
              { id: 7210, name: 'Haloalkanes and Haloarenes', order: 10 },
              { id: 7211, name: 'Alcohols, Phenols and Ethers', order: 11 },
              { id: 7212, name: 'Aldehydes, Ketones and Carboxylic Acids', order: 12 },
              { id: 7213, name: 'Amines', order: 13 },
              { id: 7214, name: 'Biomolecules', order: 14 },
              { id: 7215, name: 'Polymers', order: 15 },
              { id: 7216, name: 'Chemistry in Everyday Life', order: 16 }
            ]
          },
          {
            id: 704,
            name: 'Biology',
            classId: 7,
            chapters: [
              { id: 7301, name: 'Reproduction in Organisms', order: 1 },
              { id: 7302, name: 'Sexual Reproduction in Flowering Plants', order: 2 },
              { id: 7303, name: 'Human Reproduction', order: 3 },
              { id: 7304, name: 'Reproductive Health', order: 4 },
              { id: 7305, name: 'Principles of Inheritance and Variation', order: 5 },
              { id: 7306, name: 'Molecular Basis of Inheritance', order: 6 },
              { id: 7307, name: 'Evolution', order: 7 },
              { id: 7308, name: 'Human Health and Disease', order: 8 },
              { id: 7309, name: 'Strategies for Enhancement in Food Production', order: 9 },
              { id: 7310, name: 'Microbes in Human Welfare', order: 10 },
              { id: 7311, name: 'Biotechnology: Principles and Processes', order: 11 },
              { id: 7312, name: 'Biotechnology and its Applications', order: 12 },
              { id: 7313, name: 'Organisms and Populations', order: 13 },
              { id: 7314, name: 'Ecosystem', order: 14 },
              { id: 7315, name: 'Biodiversity and Conservation', order: 15 },
              { id: 7316, name: 'Environmental Issues', order: 16 }
            ]
          },
          {
            id: 705,
            name: 'Accountancy',
            classId: 7,
            chapters: [
              { id: 7401, name: 'Accounting for Partnership Firms - Fundamentals', order: 1 },
              { id: 7402, name: 'Accounting for Partnership Firms - Reconstitution', order: 2 },
              { id: 7403, name: 'Accounting for Partnership Firms - Admission of a Partner', order: 3 },
              { id: 7404, name: 'Accounting for Partnership Firms - Retirement/Death of a Partner', order: 4 },
              { id: 7405, name: 'Dissolution of Partnership Firm', order: 5 },
              { id: 7406, name: 'Accounting for Share Capital', order: 6 },
              { id: 7407, name: 'Issue and Redemption of Debentures', order: 7 },
              { id: 7408, name: 'Financial Statements of a Company', order: 8 },
              { id: 7409, name: 'Analysis of Financial Statements', order: 9 },
              { id: 7410, name: 'Accounting Ratios', order: 10 },
              { id: 7411, name: 'Cash Flow Statement', order: 11 },
              { id: 7412, name: 'Project Work in Accountancy', order: 12 }
            ]
          },
          {
            id: 706,
            name: 'Business Studies',
            classId: 7,
            chapters: [
              { id: 7501, name: 'Nature and Significance of Management', order: 1 },
              { id: 7502, name: 'Principles of Management', order: 2 },
              { id: 7503, name: 'Business Environment', order: 3 },
              { id: 7504, name: 'Planning', order: 4 },
              { id: 7505, name: 'Organising', order: 5 },
              { id: 7506, name: 'Staffing', order: 6 },
              { id: 7507, name: 'Directing', order: 7 },
              { id: 7508, name: 'Controlling', order: 8 },
              { id: 7509, name: 'Financial Management', order: 9 },
              { id: 7510, name: 'Financial Markets', order: 10 },
              { id: 7511, name: 'Marketing Management', order: 11 },
              { id: 7512, name: 'Consumer Protection', order: 12 },
              { id: 7513, name: 'Entrepreneurship Development', order: 13 }
            ]
          },
          {
            id: 707,
            name: 'Economics',
            classId: 7,
            chapters: [
              { id: 7601, name: 'Introduction to Microeconomics', order: 1 },
              { id: 7602, name: 'Theory of Consumer Behaviour', order: 2 },
              { id: 7603, name: 'Production and Costs', order: 3 },
              { id: 7604, name: 'The Theory of the Firm Under Perfect Competition', order: 4 },
              { id: 7605, name: 'Market Equilibrium', order: 5 },
              { id: 7606, name: 'Non-competitive Markets', order: 6 },
              { id: 7607, name: 'Introduction to Macroeconomics', order: 7 },
              { id: 7608, name: 'National Income Accounting', order: 8 },
              { id: 7609, name: 'Money and Banking', order: 9 },
              { id: 7610, name: 'Income Determination', order: 10 },
              { id: 7611, name: 'Government Budget and the Economy', order: 11 },
              { id: 7612, name: 'Open Economy Macroeconomics', order: 12 },
              { id: 7613, name: 'Indian Economic Development', order: 13 }
            ]
          },
          {
            id: 708,
            name: 'Computer Science',
            classId: 7,
            chapters: [
              { id: 7701, name: 'Python Revision Tour', order: 1 },
              { id: 7702, name: 'Functions', order: 2 },
              { id: 7703, name: 'File Handling', order: 3 },
              { id: 7704, name: 'Data Structures: Stack and Queue', order: 4 },
              { id: 7705, name: 'Computer Networks', order: 5 },
              { id: 7706, name: 'Network Protocols', order: 6 },
              { id: 7707, name: 'Mobile Telecommunication', order: 7 },
              { id: 7708, name: 'Network Security', order: 8 },
              { id: 7709, name: 'Database Concepts', order: 9 },
              { id: 7710, name: 'Structured Query Language', order: 10 },
              { id: 7711, name: 'Interface Python with SQL', order: 11 },
              { id: 7712, name: 'Society, Law and Ethics', order: 12 },
              { id: 7713, name: 'Advanced Programming', order: 13 },
              { id: 7714, name: 'Data Visualization using Pyplot', order: 14 }
            ]
          },
          {
            id: 709,
            name: 'English',
            classId: 7,
            chapters: [
              { id: 7801, name: 'Reading Comprehension', order: 1 },
              { id: 7802, name: 'Writing Skills - Notice', order: 2 },
              { id: 7803, name: 'Writing Skills - Advertisement', order: 3 },
              { id: 7804, name: 'Writing Skills - Poster', order: 4 },
              { id: 7805, name: 'Writing Skills - Invitation', order: 5 },
              { id: 7806, name: 'Writing Skills - Letters', order: 6 },
              { id: 7807, name: 'Writing Skills - Articles', order: 7 },
              { id: 7808, name: 'Writing Skills - Speech', order: 8 },
              { id: 7809, name: 'Writing Skills - Debate', order: 9 },
              { id: 7810, name: 'Writing Skills - Report', order: 10 },
              { id: 7811, name: 'Grammar - Gap Filling', order: 11 },
              { id: 7812, name: 'Grammar - Editing', order: 12 },
              { id: 7813, name: 'Grammar - Sentence Reordering', order: 13 },
              { id: 7814, name: 'Grammar - Sentence Transformation', order: 14 },
              { id: 7815, name: 'Literature - Prose', order: 15 },
              { id: 7816, name: 'Literature - Poetry', order: 16 },
              { id: 7817, name: 'Literature - Drama', order: 17 },
              { id: 7818, name: 'Literature - Novel', order: 18 }
            ]
          }
        ]
      }
    ];
  }
  ngOnInit() {
    this.loadNotesFromDB();
  }
  
  loadNotesFromDB() {
    this.appService.getNotes().subscribe((res: any) => {
      console.log("DB Notes Response:", res);
  
      if (res.success) {
        this.uploadedNotes = (res.notes || []).map((n: any) => ({
          id: n.id,
          className: n.class_name,
          subjectName: n.subject_name,
          chapterName: n.chapter_name,
          fileName: n.file_name,
          pdfLink: n.pdf_link,
          downloadLink: n.download_link,
          uploadedAt: new Date(n.uploaded_at),
        }));
      }
    });
  }
  
  
 

  private setupFormListeners(): void {
    this.uploadForm.get('classId')?.valueChanges.subscribe(classId => {
      this.onClassChange(classId);
    });

    this.uploadForm.get('subjectId')?.valueChanges.subscribe(subjectId => {
      this.onSubjectChange(subjectId);
    });
  }

  private onClassChange(classId: number): void {
    const subjectControl = this.uploadForm.get('subjectId');
    const chapterControl = this.uploadForm.get('chapterId');
    
    if (classId) {
      const selectedClass = this.classes.find(c => c.id === classId);
      this.filteredSubjects = selectedClass ? selectedClass.subjects : [];
      subjectControl?.enable();
    } else {
      this.filteredSubjects = [];
      this.filteredChapters = [];
      subjectControl?.disable();
      chapterControl?.disable();
      subjectControl?.setValue('');
      chapterControl?.setValue('');
    }
    
    this.uploadForm.patchValue({ subjectId: '', chapterId: '' });
  }

  private onSubjectChange(subjectId: number): void {
    const chapterControl = this.uploadForm.get('chapterId');
    const classId = this.uploadForm.get('classId')?.value;
    
    if (classId && subjectId) {
      const selectedClass = this.classes.find(c => c.id === classId);
      if (selectedClass) {
        const selectedSubject = selectedClass.subjects.find(s => s.id === subjectId);
        this.filteredChapters = selectedSubject ? selectedSubject.chapters : [];
      }
      chapterControl?.enable();
    } else {
      this.filteredChapters = [];
      chapterControl?.disable();
      chapterControl?.setValue('');
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
  
    if (file && file.type === "application/pdf") {
      this.selectedFile = file;
      this.clearAlert();
    } else {
      this.showAlertMessage("Only PDF files are allowed!", "error");
      this.selectedFile = null;
    }
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
  
      reader.onerror = (error) => reject(error);
    });
  }

  async uploadPdf() {
    if (!this.selectedFile) {
      this.showAlertMessage("Please select a PDF file first", "error");
      return;
    }

    if (this.uploadForm.invalid) {
      this.showAlertMessage("Please select Class, Subject, and Chapter", "error");
      return;
    }

    const formValues = this.uploadForm.value;
    const selectedClass = this.classes.find(c => c.id === formValues.classId);
    const selectedSubject = this.filteredSubjects.find(s => s.id === formValues.subjectId);
    const selectedChapter = this.filteredChapters.find(c => c.id === formValues.chapterId);

    if (!selectedClass || !selectedSubject || !selectedChapter) {
      this.showAlertMessage("Invalid selection. Please try again.", "error");
      return;
    }

    this.isUploading = true;
    this.clearAlert();

    try {
      const pdfBase64 = await this.convertToBase64(this.selectedFile);
  
      const payload = {
        classId: selectedClass.id,
        className: selectedClass.name,
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        chapterId: selectedChapter.id,
        chapterName: selectedChapter.name,
        pdfFileName: this.selectedFile.name,
        pdfBase64: pdfBase64
      };
  
      fetch(this.API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then((data: UploadResponse) => {
          this.isUploading = false;
          
          if (data.status) {
            this.uploadSuccess = true;
            
            const uploadedNote: UploadedNote = {
              className: selectedClass.name,
              subjectName: selectedSubject.name,
              chapterName: selectedChapter.name,
              fileName: this.selectedFile!.name,
              pdfLink: data.pdfLink,
              downloadLink: data.downloadLink,
              uploadedAt: new Date()
            };
            
            this.uploadedNotes.unshift(uploadedNote);
            
            this.showAlertMessage("PDF uploaded successfully!", "success");
            this.resetForm();
          } else {
            this.showAlertMessage(data.message || "Upload failed", "error");
          }
        })
        .catch(error => {
          this.isUploading = false;
          this.showAlertMessage("Upload failed. Please try again.", "error");
          console.error('Upload error:', error);
        });
      
    } catch (error) {
      this.isUploading = false;
      this.showAlertMessage("Error processing file", "error");
      console.error('File conversion error:', error);
    }
  }

  saveNotes(): void {
    if (this.uploadedNotes.length === 0) {
      this.showAlertMessage("No notes to save", "info");
      return;
    }
  
    const payload = {
      notes: this.uploadedNotes
    };
  
    this.appService.saveNotesToDB(payload, (res: any) => {
      if (res?.status) {
        this.showAlertMessage("Notes saved to DB successfully!", "success");
      } else {
        this.showAlertMessage(res?.message || "Failed to save notes", "error");
      }
    });
  }
  



  resetForm(): void {
    this.uploadForm.reset({
      classId: '',
      subjectId: { value: '', disabled: true },
      chapterId: { value: '', disabled: true }
    });
    this.selectedFile = null;
    this.filteredSubjects = [];
    this.filteredChapters = [];
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  clearAlert(): void {
    this.showAlert = false;
    this.alertMessage = '';
  }

  showAlertMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    if (type !== 'info') {
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }

  getSelectedClassName(): string {
    const classId = this.uploadForm.get('classId')?.value;
    const selectedClass = this.classes.find(c => c.id === classId);
    return selectedClass?.name || 'Not selected';
  }

  getSelectedSubjectName(): string {
    const subjectId = this.uploadForm.get('subjectId')?.value;
    const selectedSubject = this.filteredSubjects.find(s => s.id === subjectId);
    return selectedSubject?.name || 'Not selected';
  }

  getSelectedChapterName(): string {
    const chapterId = this.uploadForm.get('chapterId')?.value;
    const selectedChapter = this.filteredChapters.find(c => c.id === chapterId);
    return selectedChapter?.name || 'Not selected';
  }

  removeNote(index: number): void {
    this.uploadedNotes.splice(index, 1);
    this.showAlertMessage("Note removed", "success");
  }
}