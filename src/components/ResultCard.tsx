import { ReactNode } from 'react';

type ResultCardProps = {
  title: string;
  value: string | number;
  interpretation?: string;
  status?: 'good' | 'warning' | 'danger' | 'neutral';
  children?: ReactNode;
};

export default function ResultCard({
  title,
  value,
  interpretation,
  status = 'neutral',
  children,
}: ResultCardProps) {
  const statusClasses = {
    good: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    neutral: 'bg-white border-secondary-200',
  };

  const valueClasses = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    neutral: 'text-primary-600',
  };

  return (
    <div className={`rounded-lg border p-4 ${statusClasses[status]}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className={`text-3xl font-bold ${valueClasses[status]}`}>{value}</div>
      {interpretation && (
        <p className="mt-2 text-sm text-secondary-600">{interpretation}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
