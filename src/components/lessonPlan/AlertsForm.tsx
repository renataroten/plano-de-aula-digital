
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertType } from '@/types';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertsFormProps {
  alerts: Alert[];
  newAlert: {
    title: string;
    date: Date;
    type: AlertType;
  };
  handleAlertChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAlertDateChange: (date: Date | undefined) => void;
  handleAlertTypeChange: (type: string) => void;
  addAlert: () => void;
  removeAlert: (id: string) => void;
}

const alertTypeOptions = [
  { value: 'exam', label: 'Prova' },
  { value: 'assignment', label: 'Tarefa' },
  { value: 'reminder', label: 'Lembrete' },
  { value: 'event', label: 'Evento' },
];

const AlertsForm: React.FC<AlertsFormProps> = ({
  alerts,
  newAlert,
  handleAlertChange,
  handleAlertDateChange,
  handleAlertTypeChange,
  addAlert,
  removeAlert,
}) => {
  return (
    <div className="grid gap-2">
      <Label>Alertas e Lembretes</Label>
      
      <div className="bg-secondary bg-opacity-30 p-3 rounded-md space-y-2">
        {alerts && alerts.length > 0 ? (
          <div className="space-y-2 mb-3">
            {alerts.map(alert => (
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
  );
};

export default AlertsForm;
