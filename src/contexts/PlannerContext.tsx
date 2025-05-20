
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LessonPlan, CalendarViewState, Subject, GradeLevel, Alert } from '@/types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface PlannerContextProps {
  lessonPlans: LessonPlan[];
  calendarState: CalendarViewState;
  alerts: Alert[];
  addLessonPlan: (plan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLessonPlan: (plan: LessonPlan) => void;
  deleteLessonPlan: (id: string) => void;
  setCalendarView: (view: 'day' | 'week' | 'month') => void;
  setCurrentDate: (date: Date) => void;
  setSubjectFilter: (subjects: Subject[]) => void;
  setGradeLevelFilter: (gradeLevels: GradeLevel[]) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'completed'>) => void;
  toggleAlertComplete: (id: string) => void;
  deleteAlert: (id: string) => void;
}

const PlannerContext = createContext<PlannerContextProps | undefined>(undefined);

const STORAGE_KEY = 'lesson-planner-data';

export const PlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [calendarState, setCalendarState] = useState<CalendarViewState>({
    currentDate: new Date(),
    viewMode: 'month',
    filter: {
      subjects: [],
      gradeLevels: [],
    }
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.lessonPlans) {
          // Convert string dates back to Date objects
          const plans = parsedData.lessonPlans.map((plan: any) => ({
            ...plan,
            date: new Date(plan.date),
            createdAt: new Date(plan.createdAt),
            updatedAt: new Date(plan.updatedAt),
          }));
          setLessonPlans(plans);
        }
        
        if (parsedData.alerts) {
          // Convert string dates back to Date objects for alerts
          const alertsData = parsedData.alerts.map((alert: any) => ({
            ...alert,
            date: new Date(alert.date),
          }));
          setAlerts(alertsData);
        }
        
        if (parsedData.calendarState) {
          setCalendarState({
            ...parsedData.calendarState,
            currentDate: new Date(parsedData.calendarState.currentDate)
          });
        }
      } catch (e) {
        console.error('Failed to parse saved planner data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      lessonPlans,
      alerts,
      calendarState
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [lessonPlans, alerts, calendarState]);

  const addLessonPlan = (plan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setLessonPlans(prev => [...prev, newPlan]);
    toast({
      title: "Plano de aula criado",
      description: `${plan.title} para ${format(plan.date, 'dd/MM/yyyy')}`,
    });
  };
  
  const updateLessonPlan = (plan: LessonPlan) => {
    setLessonPlans(prev => 
      prev.map(p => p.id === plan.id ? { ...plan, updatedAt: new Date() } : p)
    );
    toast({
      title: "Plano de aula atualizado",
      description: plan.title,
    });
  };
  
  const deleteLessonPlan = (id: string) => {
    setLessonPlans(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Plano de aula excluído",
      variant: "destructive",
    });
  };
  
  const setCalendarView = (view: 'day' | 'week' | 'month') => {
    setCalendarState(prev => ({ ...prev, viewMode: view }));
  };
  
  const setCurrentDate = (date: Date) => {
    setCalendarState(prev => ({ ...prev, currentDate: date }));
  };
  
  const setSubjectFilter = (subjects: Subject[]) => {
    setCalendarState(prev => ({ 
      ...prev, 
      filter: { ...prev.filter, subjects }
    }));
  };
  
  const setGradeLevelFilter = (gradeLevels: GradeLevel[]) => {
    setCalendarState(prev => ({ 
      ...prev, 
      filter: { ...prev.filter, gradeLevels } 
    }));
  };
  
  const addAlert = (alert: Omit<Alert, 'id' | 'completed'>) => {
    const newAlert: Alert = {
      ...alert,
      id: uuidv4(),
      completed: false
    };
    setAlerts(prev => [...prev, newAlert]);
    toast({
      title: "Alerta criado",
      description: alert.title,
    });
  };
  
  const toggleAlertComplete = (id: string) => {
    setAlerts(prev => 
      prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    );
  };
  
  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Alerta excluído",
      variant: "destructive",
    });
  };
  
  const value = {
    lessonPlans,
    calendarState,
    alerts,
    addLessonPlan,
    updateLessonPlan,
    deleteLessonPlan,
    setCalendarView,
    setCurrentDate,
    setSubjectFilter,
    setGradeLevelFilter,
    addAlert,
    toggleAlertComplete,
    deleteAlert
  };
  
  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
