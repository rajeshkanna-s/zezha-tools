export interface PersonalDetails {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    website1?: string;
    website2?: string;
    location?: string;
  }
  
  export interface WorkExperience {
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description: string;
  }
  
  export interface Education {
    school: string;
    startDate: string;
    endDate: string;
    degree: string;
    gpa?: string;
    description?: string;
  }
  
  export interface Project {
    name: string;
    startDate: string;
    endDate: string;
    link?: string;
    description: string;
  }
  
  export interface Skill {
    name: string;
    description?: string;
  }
  
  export interface ExtraSections {
    certificates?: any[];
    awards?: any[];
    languages?: any[];
    hobbies?: string[];
    internships?: any[];
    references?: any[];
    courses?: any[];
  }
  
  export interface ResumeData {
    personalDetails: PersonalDetails;
    workExperience: WorkExperience[];
    education: Education[];
    projects: Project[];
    skills: Skill[];
    extras: ExtraSections;
  }
  