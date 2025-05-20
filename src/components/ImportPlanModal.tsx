
import React, { useState } from 'react';
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
import { usePlanner } from '@/contexts/PlannerContext';
import { toast } from '@/hooks/use-toast';
import { addYears, formatISO } from 'date-fns';
import { LessonPlan } from '@/types';
import * as XLSX from 'xlsx';
import { FileSpreadsheet } from 'lucide-react';

interface ImportPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportPlanModal: React.FC<ImportPlanModalProps> = ({ isOpen, onClose }) => {
  const { addLessonPlan } = usePlanner();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const adaptDateTo2025 = (oldDate: string | Date): Date => {
    const date = new Date(oldDate);
    // Se a data for de 2023, adiciona 2 anos para chegar em 2025
    if (date.getFullYear() === 2023) {
      return addYears(date, 2);
    } 
    // Se for de outro ano, simplesmente ajusta para 2025 mantendo mês e dia
    const newDate = new Date(date);
    newDate.setFullYear(2025);
    return newDate;
  };
  
  const processExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };
  
  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo CSV, JSON ou Excel para importar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsImporting(true);
    
    try {
      let importedPlans: any[] = [];
      
      // Verifica o tipo de arquivo e processa adequadamente
      if (file.name.endsWith('.json')) {
        const content = await file.text();
        importedPlans = JSON.parse(content);
      } 
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importedPlans = await processExcelFile(file);
      }
      else if (file.name.endsWith('.csv')) {
        // Processamento simples de CSV
        const content = await file.text();
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length === headers.length) {
            const plan: any = {};
            headers.forEach((header, index) => {
              plan[header.trim()] = values[index].trim();
            });
            importedPlans.push(plan);
          }
        }
      } else {
        throw new Error("Formato de arquivo não suportado");
      }
      
      // Adapta as datas para 2025 e importa os planos
      let importCount = 0;
      for (const plan of importedPlans) {
        // Verifica se tem os campos mínimos necessários
        if (plan.title && plan.subject && plan.date) {
          const adaptedPlan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'> = {
            title: plan.title,
            description: plan.description || '',
            subject: plan.subject as any,
            gradeLevel: plan.gradeLevel || 'middle_6',
            date: adaptDateTo2025(plan.date),
            notes: plan.notes || '',
            alerts: [],
            attachments: []
          };
          
          // Adiciona alertas se existirem
          if (plan.alerts && Array.isArray(plan.alerts)) {
            adaptedPlan.alerts = plan.alerts.map((alert: any) => ({
              ...alert,
              date: adaptDateTo2025(alert.date)
            }));
          }
          
          addLessonPlan(adaptedPlan);
          importCount++;
        }
      }
      
      toast({
        title: "Importação concluída",
        description: `${importCount} planos de aula foram importados e adaptados para 2025.`,
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar Planejamento de 2023</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file-upload">Selecione o arquivo (CSV, JSON ou Excel)</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileSpreadsheet size={16} />
              <p>
                O sistema adaptará automaticamente as datas de 2023 para 2025, mantendo os mesmos dias da semana.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isImporting}
          >
            {isImporting ? "Importando..." : "Importar para 2025"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportPlanModal;
