import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, Clock, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="bg-[#141414] border-gray-800 hover:border-gray-700 transition-colors">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-full bg-opacity-10 ${color.bg}`}>
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
    </CardContent>
  </Card>
);

const StatsCards = ({ stats }) => {
  const { 
    totalRenders = 0, 
    completedRenders = 0, 
    pendingRenders = 0, 
    totalBudgets = 0 
  } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Renders" 
        value={totalRenders} 
        icon={Zap}
        color={{ bg: 'bg-blue-500/10', text: 'text-blue-500' }}
      />
      <StatCard 
        title="Renders Listos" 
        value={completedRenders} 
        icon={CheckCircle}
        color={{ bg: 'bg-green-500/10', text: 'text-green-500' }}
      />
      <StatCard 
        title="En Proceso" 
        value={pendingRenders} 
        icon={Clock}
        color={{ bg: 'bg-yellow-500/10', text: 'text-yellow-500' }}
      />
      <StatCard 
        title="Presupuestos" 
        value={totalBudgets} 
        icon={FileText}
        color={{ bg: 'bg-purple-500/10', text: 'text-purple-500' }}
      />
    </div>
  );
};

export default StatsCards;