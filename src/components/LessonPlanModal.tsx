
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LessonPlan } from '@/types';
import BasicInfoForm from './lessonPlan/BasicInfoForm';
import AlertsForm from './lessonPlan/AlertsForm';
import { useLessonPlanForm } from '@/hooks/useLessonPlanForm';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: LessonPlan | null;
}

const LessonPlanModal: React.FC<LessonPlanModalProps> = ({ 
  isOpen, 
  onClose, 
  plan 
}) => {
  const {
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
  } = useLessonPlanForm(plan || null);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <BasicInfoForm 
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleDateChange={handleDateChange}
          />
          
          <AlertsForm 
            alerts={formData.alerts || []}
            newAlert={newAlert}
            handleAlertChange={handleAlertChange}
            handleAlertDateChange={handleAlertDateChange}
            handleAlertTypeChange={handleAlertTypeChange}
            addAlert={addAlert}
            removeAlert={removeAlert}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => handleSubmit(onClose)}>
            {isEditing ? 'Salvar Alterações' : 'Criar Plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonPlanModal;
