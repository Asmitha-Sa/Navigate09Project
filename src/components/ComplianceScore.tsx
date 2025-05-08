
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Percent, CircleCheck, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceScoreProps {
  score: number;
  status: 'compliant' | 'non-compliant' | 'partial';
}

const ComplianceScore = ({ score, status }: ComplianceScoreProps) => {
  const getColorClass = () => {
    switch (status) {
      case 'compliant': return 'text-retail-green';
      case 'non-compliant': return 'text-retail-red';
      case 'partial': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };
  
  const getProgressColor = () => {
    switch (status) {
      case 'compliant': return 'bg-retail-green';
      case 'non-compliant': return 'bg-retail-red';
      case 'partial': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getIcon = () => {
    switch (status) {
      case 'compliant': return <CircleCheck className="h-5 w-5" />;
      case 'non-compliant': return <CircleDot className="h-5 w-5" />;
      case 'partial': return <CircleDot className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <motion.div 
            className={getColorClass()}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          >
            {getIcon()}
          </motion.div>
          <span className="ml-2 font-medium">Compliance Score</span>
        </div>
        <motion.div 
          className={`flex items-center font-bold text-xl ${getColorClass()}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {score}%
          <Percent className="ml-1 h-4 w-4" />
        </motion.div>
      </div>
      
      <div className="relative h-5 rounded-full overflow-hidden bg-gray-200">
        <motion.div 
          className={`h-full ${getProgressColor()}`}
          initial={{ width: '0%' }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default ComplianceScore;
