import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Plus, X } from 'lucide-react';

interface VariableTemplate {
  id: string;
  name: string;
  template: string;
  description: string;
}

interface QuickInsertProps {
  onInsert: (text: string) => void;
  inline?: boolean;
}

const variableTemplates: Record<string, VariableTemplate[]> = {
  'Text Input': [
    { id: 'text-basic', name: 'Basic Text', template: '{{variable_name:text::Placeholder text}}', description: 'Simple text input field' },
    { id: 'text-required', name: 'Required Text', template: '{{variable_name:text::Enter value}}', description: 'Text input with placeholder' },
  ],
  'Textarea': [
    { id: 'textarea-basic', name: 'Basic Textarea', template: '{{variable_name:textarea::Enter details}}', description: 'Multi-line text input' },
    { id: 'textarea-long', name: 'Long Description', template: '{{description:textarea::Provide detailed description}}', description: 'For longer text content' },
  ],
  'Select Dropdown': [
    { id: 'select-basic', name: 'Basic Select', template: '{{variable_name:select:option1|option2|option3:option1}}', description: 'Dropdown with multiple options' },
    { id: 'select-size', name: 'Size Options', template: '{{size:select:small|medium|large:medium}}', description: 'Common size options' },
    { id: 'select-priority', name: 'Priority Level', template: '{{priority:select:low|medium|high|urgent:medium}}', description: 'Priority selection' },
  ],
  'Radio Buttons': [
    { id: 'radio-basic', name: 'Basic Radio', template: '{{variable_name:radio:option1|option2|option3:option1}}', description: 'Radio button selection' },
    { id: 'radio-tone', name: 'Tone Selection', template: '{{tone:radio:professional|casual|friendly:professional}}', description: 'Writing tone options' },
    { id: 'radio-style', name: 'Style Options', template: '{{style:radio:formal|informal|conversational:formal}}', description: 'Style variations' },
  ],
  'Number Input': [
    { id: 'number-basic', name: 'Basic Number', template: '{{variable_name:number::1}}', description: 'Numeric input field' },
    { id: 'number-count', name: 'Count/Quantity', template: '{{count:number::3}}', description: 'For counting items' },
    { id: 'number-duration', name: 'Duration', template: '{{duration:number::30}}', description: 'Time or duration values' },
  ],
  'Checkbox': [
    { id: 'checkbox-basic', name: 'Basic Checkbox', template: '{{variable_name:checkbox:option1|option2|option3:option1}}', description: 'Multiple selection checkboxes' },
    { id: 'checkbox-features', name: 'Features', template: '{{features:checkbox:feature1|feature2|feature3:feature1|feature2}}', description: 'Feature selection' },
    { id: 'checkbox-categories', name: 'Categories', template: '{{categories:checkbox:category1|category2|category3:category1}}', description: 'Category selection' },
  ],
};

export function QuickInsert({ onInsert, inline = false }: QuickInsertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('Text Input');
  const [customTemplates, setCustomTemplates] = useState<VariableTemplate[]>([]);

  const allTypes = Object.keys(variableTemplates);
  const currentTemplates = variableTemplates[selectedType] || [];
  const combinedTemplates = [...currentTemplates, ...customTemplates.filter(t => 
    selectedType === 'Custom' || selectedType === 'Text Input'
  )];

  const handleAddCustom = (template: string) => {
    if (template.trim()) {
      const newTemplate: VariableTemplate = {
        id: Date.now().toString(),
        name: 'Custom Template',
        template: template.trim(),
        description: 'Custom variable template'
      };
      setCustomTemplates([...customTemplates, newTemplate]);
    }
  };

  const handleRemoveCustom = (id: string) => {
    setCustomTemplates(customTemplates.filter(t => t.id !== id));
  };

  if (inline) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">Quick Insert Variables</h4>
        </div>

        <div className="mb-2">
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-8 text-xs"
          >
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>

        <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
          {combinedTemplates.map((template) => (
            <div
              key={template.id}
              className="group p-1.5 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => onInsert(template.template)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {template.name}
                  </div>
                  <div className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                    {template.template}
                  </div>
                </div>
                {customTemplates.some(ct => ct.id === template.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCustom(template.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg"
      >
        <Plus className="h-4 w-4 mr-1" />
        Quick Insert
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 max-h-96 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Quick Insert Variables</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-3">
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full h-8 text-xs"
        >
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {combinedTemplates.map((template) => (
          <div
            key={template.id}
            className="group p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            onClick={() => onInsert(template.template)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {template.name}
                </div>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate mb-1">
                  {template.template}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {template.description}
                </div>
              </div>
              {customTemplates.some(ct => ct.id === template.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustom(template.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
