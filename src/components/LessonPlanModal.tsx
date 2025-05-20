
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { LessonPlan, Alert, Subject, GradeLevel, AlertType } from '@/types';
import { usePlanner } from '@/contexts/PlannerContext';
import { v4 as uuidv4 } from 'uuid';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: LessonPlan | null;
}

const alertTypeOptions = [
  { value: 'exam', label: 'Prova' },
  { value: 'assignment', label: 'Tarefa' },
  { value: 'reminder', label: 'Lembrete' },
  { value: 'event', label: 'Evento' },
];

const subjectOptions = [
  { value: 'math', label: 'Matemática' },
  { value: 'science', label: 'Ciências' },
  { value: 'history', label: 'História' },
  { value: 'language', label: 'Línguas' },
  { value: 'art', label: 'Artes' },
  { value: 'other', label: 'Outros' },
];

const gradeLevelOptions = [
  { value: 'elementary', label: 'Ensino Fundamental Anos Iniciais' },
  { value: 'middle_6', label: '6º Ano - Ensino Fundamental Anos Finais' },
  { value: 'middle_7', label: '7º Ano - Ensino Fundamental Anos Finais' },
  { value: 'middle_8', label: '8º Ano - Ensino Fundamental Anos Finais' },
  { value: 'middle_9', label: '9º Ano - Ensino Fundamental Anos Finais' },
  { value: 'high', label: 'Ensino Médio' },
  { value: 'college', label: 'Ensino Superior' },
];

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

const LessonPlanModal: React.FC<LessonPlanModalProps> = ({ 
  isOpen, 
  onClose, 
  plan 
}) => {
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
  
  const handleSubmit = () => {
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título do plano de aula"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Disciplina</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleSelectChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gradeLevel">Série</Label>
              <Select
                value={formData.gradeLevel}
                onValueChange={(value) => handleSelectChange('gradeLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma série" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevelOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, 'PPP', { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o plano de aula"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas adicionais</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notas adicionais (opcional)"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Alertas e Lembretes</Label>
            
            <div className="bg-secondary bg-opacity-30 p-3 rounded-md space-y-2">
              {formData.alerts && formData.alerts.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {formData.alerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between bg-white p-2 rounded-md">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          alert.type === 'exam' ? 'bg-planner-red' : 
                          alert.type === 'assignment' ? 'bg-planner-blue' : 
                          alert.type === 'event' ? 'bg-planner-green' : 'bg-planner-yellow'
                        }`}></span>
                        <span>
                          {alert.title} - {format(new Date(alert.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAlert(alert.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhum alerta adicionado.</p>
              )}
              
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  name="title"
                  value={newAlert.title}
                  onChange={handleAlertChange}
                  placeholder="Adicionar novo alerta"
                />
                <Button type="button" onClick={addAlert} size="icon">
                  <Plus size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      size="sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newAlert.date, 'P', { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newAlert.date}
                      onSelect={handleAlertDateChange}
                      initialFocus
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <Select
                  value={newAlert.type}
                  onValueChange={handleAlertTypeChange}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tipo de alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    {alertTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Salvar Alterações' : 'Criar Plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonPlanModal;
