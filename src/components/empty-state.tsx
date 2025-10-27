'use client';

import { Card } from './ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center py-16">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-primary hover:underline"
        >
          {action.label}
        </button>
      )}
    </Card>
  );
}
