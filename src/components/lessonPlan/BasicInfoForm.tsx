
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { LessonPlan, Subject, GradeLevel } from '@/types';

interface BasicInfoFormProps {
  formData: Partial<LessonPlan>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (date: Date | undefined) => void;
}

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

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  handleDateChange,
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Digite o título do plano de aula"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="subject">Disciplina</Label>
          <Select
            value={formData.subject || 'math'}
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
            value={formData.gradeLevel || 'middle_6'}
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
              {format(formData.date || new Date(), 'PPP', { locale: ptBR })}
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
          value={formData.description || ''}
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
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Notas adicionais (opcional)"
        />
      </div>
    </>
  );
};

export default BasicInfoForm;
