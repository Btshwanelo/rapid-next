import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Plus, 
  Sparkles,
  MousePointer2
} from 'lucide-react';

type EmptyStateProps = {
  title?: string;
  description?: string;
  type?: 'user' | 'ai' | 'combined';
  onAction?: () => void;
};

const EmptyState = ({ 
  title, 
  description, 
  type = 'user',
  onAction 
}: EmptyStateProps) => {
  const getContent = () => {
    switch (type) {
      case 'user':
        return {
          icon: <Plus className="h-12 w-12 text-muted-foreground" />,
          title: title || 'No Insights Added Yet',
          description: description || 'Start by adding your observations and insights about the user persona.',
          actionLabel: 'Add First Insight',
        };
      case 'ai':
        return {
          icon: <Sparkles className="h-12 w-12 text-muted-foreground" />,
          title: title || 'Generate AI Insights',
          description: description || 'Click generate to get AI-powered insights for this persona.',
          actionLabel: 'Generate Insights',
        };
      case 'combined':
        return {
          icon: <ClipboardList className="h-12 w-12 text-muted-foreground" />,
          title: title || 'No Combined Insights',
          description: description || 'Add user insights or generate AI insights to see them combined.',
          actionLabel: 'Switch to User View',
        };
      default:
        return {
          icon: <MousePointer2 className="h-12 w-12 text-muted-foreground" />,
          title: 'Start Adding Content',
          description: 'Begin by adding your first insight to the empathy map.',
          actionLabel: 'Get Started',
        };
    }
  };

  const content = getContent();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-500">
      <div className="p-4  rounded-full mb-3">
        {content.icon}
      </div>
      
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-semibold text-white">{content.title}</h3>
        <p className="text-muted-foreground text-sm">{content.description}</p>
      </div>

    </div>
  );
};

export default EmptyState;