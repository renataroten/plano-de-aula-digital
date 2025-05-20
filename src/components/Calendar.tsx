
import React, { useState, useEffect } from 'react';
import {
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isToday,
  startOfDay,
  parse,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { usePlanner } from '@/contexts/PlannerContext';
import LessonPlan from './LessonPlan';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { LessonPlan as LessonPlanType } from '@/types';

interface CalendarProps {
  onCreatePlan: () => void;
  onSelectPlan: (plan: LessonPlanType) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onCreatePlan, onSelectPlan }) => {
  const { lessonPlans, calendarState, setCurrentDate } = usePlanner();
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    let daysToShow: Date[] = [];
    const currentDate = calendarState.currentDate;
    
    if (calendarState.viewMode === 'day') {
      daysToShow = [startOfDay(currentDate)];
    } else if (calendarState.viewMode === 'week') {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      daysToShow = eachDayOfInterval({ start, end });
    } else { // month
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      const monthStart = startOfWeek(startDate, { locale: ptBR });
      const monthEnd = endOfWeek(endDate, { locale: ptBR });
      daysToShow = eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
    
    setDays(daysToShow);
  }, [calendarState.currentDate, calendarState.viewMode]);
  
  const filteredPlans = lessonPlans.filter(plan => {
    const subjectMatch = calendarState.filter.subjects.length === 0 || 
      calendarState.filter.subjects.includes(plan.subject);
    const gradeMatch = calendarState.filter.gradeLevels.length === 0 || 
      calendarState.filter.gradeLevels.includes(plan.gradeLevel);
    return subjectMatch && gradeMatch;
  });
  
  const getPlansForDay = (day: Date) => {
    return filteredPlans.filter(plan => isSameDay(new Date(plan.date), day));
  };
  
  const navigatePrevious = () => {
    if (calendarState.viewMode === 'day') {
      setCurrentDate(subDays(calendarState.currentDate, 1));
    } else if (calendarState.viewMode === 'week') {
      setCurrentDate(subDays(calendarState.currentDate, 7));
    } else {
      const newDate = new Date(calendarState.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };
  
  const navigateNext = () => {
    if (calendarState.viewMode === 'day') {
      setCurrentDate(addDays(calendarState.currentDate, 1));
    } else if (calendarState.viewMode === 'week') {
      setCurrentDate(addDays(calendarState.currentDate, 7));
    } else {
      const newDate = new Date(calendarState.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const renderDayView = () => {
    const day = days[0]; // In day view, there's only one day
    const dayPlans = getPlansForDay(day);
    
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">
            {format(day, 'EEEE, d MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {dayPlans.length > 0 ? (
            dayPlans.map(plan => (
              <LessonPlan 
                key={plan.id} 
                plan={plan}
                onClick={() => onSelectPlan(plan)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Nenhum plano de aula para esta data</p>
              <Button 
                onClick={onCreatePlan}
                className="mt-4"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar plano de aula
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return (
      <div className="grid grid-cols-7 h-full">
        {weekDays.map((day, index) => (
          <div 
            key={day} 
            className="border-r last:border-r-0 border-b text-center py-2 font-medium"
          >
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayPlans = getPlansForDay(day);
          const isCurrentMonth = isSameMonth(day, calendarState.currentDate);
          
          return (
            <div 
              key={day.toString()}
              className={`border-r last:border-r-0 h-full p-1 overflow-y-auto ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              } ${isToday(day) ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-center py-1 mb-1 ${
                isToday(day) ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''
              }`}>
                {format(day, 'd')}
              </div>
              
              {dayPlans.map(plan => (
                <LessonPlan 
                  key={plan.id} 
                  plan={plan} 
                  onClick={() => onSelectPlan(plan)}
                  compact
                />
              ))}
              
              {dayPlans.length === 0 && (
                <div 
                  className="text-center mt-4 cursor-pointer text-primary"
                  onClick={onCreatePlan}
                >
                  <Plus className="mx-auto h-6 w-6" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderMonthView = () => {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Calculate weeks for the grid
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach((day, index) => {
      currentWeek.push(day);
      if (index % 7 === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return (
      <div className="grid grid-cols-7 h-full border-t border-l">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="border-r border-b text-center py-2 font-medium"
          >
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayPlans = getPlansForDay(day);
          const isCurrentMonth = isSameMonth(day, calendarState.currentDate);
          
          return (
            <div 
              key={day.toString()}
              className={`border-r border-b calendar-day p-1 overflow-y-auto ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              } ${isToday(day) ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-right p-1 ${
                isToday(day) ? 'font-bold text-primary' : ''
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="h-[calc(100%-30px)] overflow-y-auto">
                {dayPlans.slice(0, 3).map(plan => (
                  <LessonPlan 
                    key={plan.id} 
                    plan={plan} 
                    onClick={() => onSelectPlan(plan)}
                    compact
                  />
                ))}
                
                {dayPlans.length > 3 && (
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    + {dayPlans.length - 3} mais
                  </div>
                )}
                
                {isCurrentMonth && dayPlans.length === 0 && (
                  <div 
                    className="text-center mt-2 cursor-pointer text-primary opacity-0 hover:opacity-100"
                    onClick={() => {
                      setCurrentDate(day);
                      onCreatePlan();
                    }}
                  >
                    <Plus className="mx-auto h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-medium">
            {calendarState.viewMode === 'day' && 
              format(calendarState.currentDate, 'd MMMM yyyy', { locale: ptBR })}
              
            {calendarState.viewMode === 'week' && (
              `${format(days[0], 'd', { locale: ptBR })} - ${format(days[days.length - 1], 'd MMMM yyyy', { locale: ptBR })}`
            )}
            
            {calendarState.viewMode === 'month' && 
              format(calendarState.currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" onClick={navigateToday}>
            Hoje
          </Button>
        </div>
        
        <Button onClick={onCreatePlan}>
          <Plus className="mr-2 h-4 w-4" /> Plano de Aula
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {calendarState.viewMode === 'day' && renderDayView()}
        {calendarState.viewMode === 'week' && renderWeekView()}
        {calendarState.viewMode === 'month' && renderMonthView()}
      </div>
    </div>
  );
};

export default Calendar;
