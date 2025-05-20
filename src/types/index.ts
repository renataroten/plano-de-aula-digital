
export type Subject = 'math' | 'science' | 'history' | 'language' | 'art' | 'other';

export type GradeLevel = 'elementary' | 'middle' | 'high' | 'college';

export type AlertType = 'exam' | 'assignment' | 'reminder' | 'event';

export interface Alert {
  id: string;
  title: string;
  date: Date;
  type: AlertType;
  completed: boolean;
}

export interface LessonPlan {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  date: Date;
  alerts?: Alert[];
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarViewState {
  currentDate: Date;
  viewMode: 'day' | 'week' | 'month';
  filter: {
    subjects: Subject[];
    gradeLevels: GradeLevel[];
  };
}
