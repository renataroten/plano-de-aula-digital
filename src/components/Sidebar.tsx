
import React from 'react';
import { usePlanner } from '@/contexts/PlannerContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { 
    calendarState, 
    setCurrentDate, 
    setCalendarView,
    setSubjectFilter,
    setGradeLevelFilter
  } = usePlanner();
  
  const subjects = [
    { id: 'math', label: 'Matemática', color: 'bg-planner-blue' },
    { id: 'science', label: 'Ciências', color: 'bg-planner-green' },
    { id: 'history', label: 'História', color: 'bg-planner-purple' },
    { id: 'language', label: 'Línguas', color: 'bg-planner-yellow' },
    { id: 'art', label: 'Artes', color: 'bg-planner-orange' },
    { id: 'other', label: 'Outros', color: 'bg-planner-red' },
  ];
  
  const grades = [
    { id: 'elementary', label: 'Ensino Fundamental Anos Iniciais' },
    { id: 'middle_6', label: '6º Ano - Ensino Fundamental Anos Finais' },
    { id: 'middle_7', label: '7º Ano - Ensino Fundamental Anos Finais' },
    { id: 'middle_8', label: '8º Ano - Ensino Fundamental Anos Finais' },
    { id: 'middle_9', label: '9º Ano - Ensino Fundamental Anos Finais' },
    { id: 'high', label: 'Ensino Médio' },
    { id: 'college', label: 'Ensino Superior' },
  ];
  
  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSubjectFilter([...calendarState.filter.subjects, subjectId as any]);
    } else {
      setSubjectFilter(calendarState.filter.subjects.filter(s => s !== subjectId));
    }
  };
  
  const handleGradeChange = (gradeId: string, checked: boolean) => {
    if (checked) {
      setGradeLevelFilter([...calendarState.filter.gradeLevels, gradeId as any]);
    } else {
      setGradeLevelFilter(calendarState.filter.gradeLevels.filter(g => g !== gradeId));
    }
  };
  
  return (
    <div className="w-64 bg-sidebar border-r p-4 h-screen overflow-y-auto">
      <div className="text-lg font-bold text-primary mb-6">Planner Digital</div>
      
      <div className="mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(calendarState.currentDate, 'PPP', { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={calendarState.currentDate}
              onSelect={(date) => date && setCurrentDate(date)}
              initialFocus
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex space-x-1 mb-6">
        <Button 
          size="sm" 
          variant={calendarState.viewMode === 'day' ? 'default' : 'outline'}
          onClick={() => setCalendarView('day')}
          className="flex-1"
        >
          Dia
        </Button>
        <Button 
          size="sm" 
          variant={calendarState.viewMode === 'week' ? 'default' : 'outline'}
          onClick={() => setCalendarView('week')}
          className="flex-1"
        >
          Semana
        </Button>
        <Button 
          size="sm" 
          variant={calendarState.viewMode === 'month' ? 'default' : 'outline'}
          onClick={() => setCalendarView('month')}
          className="flex-1"
        >
          Mês
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium">Disciplinas</h3>
        <div className="space-y-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`subject-${subject.id}`}
                checked={calendarState.filter.subjects.includes(subject.id as any)}
                onCheckedChange={(checked) => 
                  handleSubjectChange(subject.id, checked === true)
                }
              />
              <Label 
                htmlFor={`subject-${subject.id}`}
                className="flex items-center text-sm cursor-pointer"
              >
                <div className={`w-3 h-3 ${subject.color} rounded-full mr-2`}></div>
                {subject.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium">Séries</h3>
        <div className="space-y-2">
          {grades.map((grade) => (
            <div key={grade.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`grade-${grade.id}`}
                checked={calendarState.filter.gradeLevels.includes(grade.id as any)}
                onCheckedChange={(checked) => 
                  handleGradeChange(grade.id, checked === true)
                }
              />
              <Label 
                htmlFor={`grade-${grade.id}`}
                className="text-sm cursor-pointer"
              >
                {grade.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
