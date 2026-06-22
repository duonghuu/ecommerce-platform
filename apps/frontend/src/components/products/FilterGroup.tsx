import React from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValue: string | null;
  onChange: (value: string) => void;
}

export function FilterGroup({ title, options, selectedValue, onChange }: FilterGroupProps) {
  return (
    <div className="mb-md">
      <h3 className="font-headline-sm text-headline-sm text-slate-900 mb-sm">{title}</h3>
      <ul className="space-y-xs">
        {options.map((option) => (
          <li key={option.value}>
            <label className="flex items-center gap-xs cursor-pointer group">
              <input
                type="radio"
                name={title}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => onChange(option.value)}
                className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-600"
              />
              <span 
                className={`font-body-md flex-grow transition-colors ${
                  selectedValue === option.value 
                    ? 'text-slate-900 font-medium' 
                    : 'text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {option.label}
              </span>
              {option.count !== undefined && (
                <span className="text-slate-400 font-body-sm text-sm">({option.count})</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
