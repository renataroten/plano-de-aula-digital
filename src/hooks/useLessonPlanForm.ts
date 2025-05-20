
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LessonPlan, Alert, AlertType } from '@/types';
import { usePlanner } from '@/contexts/PlannerContext';

const emptyPlan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  subject: 'math',
  gradeLevel: 'middle_6',
  date: new Date(),
  notes: '',
  alerts: [],
  attachments: []
};

export function useLessonPlanForm(plan: LessonPlan | null) {
  const { addLessonPlan, updateLessonPlan } = usePlanner();
  const [formData, setFormData] = useState<Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>>(emptyPlan);
  const [newAlert, setNewAlert] = useState<{
    title: string;
    date: Date;
    type: AlertType;
  }>({
    title: '',
    date: new Date(),
    type: 'reminder'
  });
  
  const isEditing = !!plan;
  
  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title,
        description: plan.description,
        subject: plan.subject,
        gradeLevel: plan.gradeLevel,
        date: plan.date,
        notes: plan.notes || '',
        alerts: plan.alerts || [],
        attachments: plan.attachments || []
      });
    } else {
      setFormData(emptyPlan);
    }
  }, [plan]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };
  
  const handleAlertChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAlertDateChange = (date: Date | undefined) => {
    if (date) {
      setNewAlert(prev => ({ ...prev, date }));
    }
  };
  
  const handleAlertTypeChange = (type: string) => {
    setNewAlert(prev => ({ ...prev, type: type as AlertType }));
  };
  
  const addAlert = () => {
    if (!newAlert.title) return;
    
    const alert: Alert = {
      id: uuidv4(),
      title: newAlert.title,
      date: newAlert.date,
      type: newAlert.type,
      completed: false
    };
    
    setFormData(prev => ({
      ...prev,
      alerts: [...(prev.alerts || []), alert]
    }));
    
    setNewAlert({
      title: '',
      date: new Date(),
      type: 'reminder'
    });
  };
  
  const removeAlert = (id: string) => {
    setFormData(prev => ({
      ...prev,
      alerts: prev.alerts?.filter(alert => alert.id !== id) || []
    }));
  };
  
  const handleSubmit = (onClose: () => void) => {
    if (!formData.title.trim()) {
      alert('Por favor, adicione um título para o plano de aula.');
      return;
    }
    
    if (isEditing && plan) {
      updateLessonPlan({
        ...plan,
        ...formData,
        updatedAt: new Date()
      });
    } else {
      addLessonPlan(formData);
    }
    
    onClose();
  };

  return {
    formData,
    newAlert,
    isEditing,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleAlertChange,
    handleAlertDateChange,
    handleAlertTypeChange,
    addAlert,
    removeAlert,
    handleSubmit
  };
}
