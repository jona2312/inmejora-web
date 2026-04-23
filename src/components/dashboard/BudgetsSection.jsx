import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const BudgetsSection = ({ budgets = [] }) => {
  const { toast } = useToast();

  const handleNewBudget = () => {
    toast({
      description: "🚧 Solicitar presupuestos estará disponible muy pronto. 🚀",
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'aprobado': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pendiente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rechazado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-[#141414] border-gray-800 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-800">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="text-[#D4AF37]" size={20} /> Mis Presupuestos
        </CardTitle>
        <Button 
          onClick={handleNewBudget}
          size="sm" 
          variant="outline"
          className="border-gray-700 text-gray-300 hover:text-white hover:bg-white/5"
        >
          <Plus className="w-4 h-4 mr-1" /> Solicitar
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        {budgets && budgets.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {budgets.map((budget) => (
              <div 
                key={budget.id} 
                className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 p-2 rounded-lg mt-1">
                    <FileText className="text-gray-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{budget.description || `Presupuesto #${budget.id.substring(0,8)}`}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{new Date(budget.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{budget.amount ? `$${budget.amount}` : 'Consultar'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`${getStatusColor(budget.status)} border`}>
                    {budget.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
            <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-3">
              <FileText className="text-gray-500 w-6 h-6" />
            </div>
            <p className="text-gray-400 text-sm mb-4">No tienes presupuestos aún.</p>
            <Button onClick={handleNewBudget} variant="link" className="text-[#D4AF37] h-auto p-0">
              Solicitar Presupuesto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetsSection;