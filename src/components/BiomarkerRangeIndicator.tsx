type BiomarkerRangeIndicatorProps = {
  value: number;
  minNormal: number;
  maxNormal: number;
  min: number;
  max: number;
  unit: string;
  label: string;
};

export default function BiomarkerRangeIndicator({
  value,
  minNormal,
  maxNormal,
  min,
  max,
  unit,
  label,
}: BiomarkerRangeIndicatorProps) {
  // Calculate position for the indicator (as a percentage)
  const position = ((value - min) / (max - min)) * 100;
  
  // Calculate positions for the normal range (as percentages)
  const normalMinPos = ((minNormal - min) / (max - min)) * 100;
  const normalMaxPos = ((maxNormal - min) / (max - min)) * 100;
  
  // Determine status based on where value falls
  let status: 'low' | 'normal' | 'high' = 'normal';
  if (value < minNormal) status = 'low';
  if (value > maxNormal) status = 'high';
  
  // Status colors
  const statusColors = {
    low: 'bg-blue-500',
    normal: 'bg-green-500',
    high: 'bg-red-500',
  };
  
  // Status labels
  const statusLabels = {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-700">{label}</span>
        <span className="text-sm font-medium text-secondary-900">
          {value} {unit} <span className={`ml-1 px-2 py-0.5 text-xs rounded-full text-white ${statusColors[status]}`}>{statusLabels[status]}</span>
        </span>
      </div>
      
      <div className="relative h-2 bg-secondary-200 rounded-full">
        {/* Normal range indicator */}
        <div 
          className="absolute h-2 bg-green-100 rounded-full" 
          style={{
            left: `${normalMinPos}%`,
            width: `${normalMaxPos - normalMinPos}%`,
          }}
        />
        
        {/* Value indicator */}
        <div 
          className={`absolute w-4 h-4 rounded-full -mt-1 -ml-2 ${statusColors[status]}`}
          style={{ left: `${position}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-secondary-500">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}
