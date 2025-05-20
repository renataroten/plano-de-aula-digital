
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Calendar from '@/components/Calendar';
import LessonPlanModal from '@/components/LessonPlanModal';
import { PlannerProvider, usePlanner } from '@/contexts/PlannerContext';
import { LessonPlan } from '@/types';
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ptBR } from 'date-fns/locale';

const PlannerApp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const { alerts } = usePlanner();
  
  // Check for upcoming alerts
  React.useEffect(() => {
    const today = new Date();
    const upcomingAlerts = alerts.filter(alert => {
      const alertDate = new Date(alert.date);
      const diffTime = Math.abs(alertDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && !alert.completed;
    });
    
    if (upcomingAlerts.length > 0) {
      upcomingAlerts.forEach(alert => {
        toast({
          title: 'Alerta próximo!',
          description: alert.title,
          // Removendo a propriedade icon que não existe no tipo Toast
        });
      });
    }
  }, [alerts]);
  
  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };
  
  const handleSelectPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Calendar 
          onCreatePlan={handleCreatePlan} 
          onSelectPlan={handleSelectPlan}
        />
      </main>
      
      <LessonPlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={selectedPlan}
      />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <PlannerProvider>
      <PlannerApp />
    </PlannerProvider>
  );
};

export default Index;
