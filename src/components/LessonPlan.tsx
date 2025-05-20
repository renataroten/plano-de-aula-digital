
import React from 'react';
import { LessonPlan as LessonPlanType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { usePlanner } from '@/contexts/PlannerContext';

interface LessonPlanProps {
  plan: LessonPlanType;
  onClick: () => void;
  compact?: boolean;
}

const getSubjectLabel = (subject: string): string => {
  const subjectMap: Record<string, string> = {
    math: 'Matemática',
    science: 'Ciências',
    history: 'História',
    language: 'Línguas',
    art: 'Artes',
    other: 'Outros',
  };
  return subjectMap[subject] || subject;
};

const getGradeLabel = (grade: string): string => {
  const gradeMap: Record<string, string> = {
    elementary: 'Ensino Fundamental Anos Iniciais',
    middle_6: '6º Ano - Ensino Fundamental Anos Finais',
    middle_7: '7º Ano - Ensino Fundamental Anos Finais',
    middle_8: '8º Ano - Ensino Fundamental Anos Finais',
    middle_9: '9º Ano - Ensino Fundamental Anos Finais',
    high: 'Ensino Médio',
    college: 'Ensino Superior',
  };
  return gradeMap[grade] || grade;
};

const LessonPlan: React.FC<LessonPlanProps> = ({ plan, onClick, compact = false }) => {
  const { deleteLessonPlan } = usePlanner();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este plano de aula?')) {
      deleteLessonPlan(plan.id);
    }
  };
  
  if (compact) {
    return (
      <div 
        className={`calendar-event event-subject-${plan.subject}`}
        onClick={onClick}
      >
        <div className="text-sm font-medium truncate">{plan.title}</div>
        <div className="text-xs text-gray-500">{getSubjectLabel(plan.subject)}</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{plan.title}</h3>
          <div className="flex gap-2 my-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-planner-${plan.subject === 'other' ? 'red' : plan.subject} bg-opacity-20`}>
              {getSubjectLabel(plan.subject)}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
              {getGradeLabel(plan.gradeLevel)}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
              {format(plan.date, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onClick}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <p className="mt-2 text-gray-600">{plan.description}</p>
      
      {plan.notes && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Notas:</h4>
          <p className="text-sm text-gray-600">{plan.notes}</p>
        </div>
      )}
      
      {plan.alerts && plan.alerts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Alertas:</h4>
          <div className="space-y-1 mt-1">
            {plan.alerts.map((alert) => (
              <div key={alert.id} className="text-sm flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  alert.type === 'exam' ? 'bg-planner-red' : 
                  alert.type === 'assignment' ? 'bg-planner-blue' : 
                  alert.type === 'event' ? 'bg-planner-green' : 'bg-planner-yellow'
                }`}></span>
                <span className={`${alert.completed ? 'line-through text-gray-400' : ''}`}>
                  {alert.title} ({format(alert.date, 'dd/MM/yyyy', { locale: ptBR })})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlan;
