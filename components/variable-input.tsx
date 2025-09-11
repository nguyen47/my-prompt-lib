import { ParsedVariable } from '../types/prompt';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { clsx } from 'clsx';

interface VariableInputProps {
  variable: ParsedVariable;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

export function VariableInput({ variable, value, onChange }: VariableInputProps) {
  const { name, type, options, defaultValue, placeholder } = variable;

  const handleChange = (newValue: string | number | boolean) => {
    onChange(newValue);
  };

  switch (type) {
    case 'text':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <Input
            type="text"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder || defaultValue || `Enter ${name}`}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <Textarea
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder || defaultValue || `Enter ${name}`}
            rows={3}
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <Input
            type="number"
            value={value as number}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={placeholder || defaultValue || '0'}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <Select
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
          >
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <div className="space-y-2">
            {options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <div className="space-y-2">
            {options?.map((option) => {
              const currentValues = typeof value === 'string' ? value.split('|').map(v => v.trim()) : [];
              const isChecked = currentValues.includes(option);
              
              return (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newValues = [...currentValues, option];
                        handleChange(newValues.join(' | '));
                      } else {
                        const newValues = currentValues.filter(v => v !== option);
                        handleChange(newValues.join(' | '));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          <Input
            type="text"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder || defaultValue || `Enter ${name}`}
          />
        </div>
      );
  }
}
