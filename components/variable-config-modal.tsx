import { useState, useEffect } from 'react';
import { Prompt, VariableValue } from '../types/prompt';
import { renderPrompt, validateVariables } from '../lib/prompt-parser';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { VariableInput } from './variable-input';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface VariableConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
}

export function VariableConfigModal({ isOpen, onClose, prompt }: VariableConfigModalProps) {
  const [values, setValues] = useState<VariableValue>({});
  const [renderedContent, setRenderedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (prompt) {
      // Initialize with default values
      const initialValues: VariableValue = {};
      prompt.variables.forEach((variable) => {
        if (variable.defaultValue) {
          if (variable.type === 'number') {
            initialValues[variable.name] = Number(variable.defaultValue);
          } else if (variable.type === 'checkbox') {
            initialValues[variable.name] = variable.defaultValue;
          } else {
            initialValues[variable.name] = variable.defaultValue;
          }
        } else {
          initialValues[variable.name] = variable.type === 'number' ? 0 : '';
        }
      });
      setValues(initialValues);
    }
  }, [prompt]);

  useEffect(() => {
    if (prompt) {
      const rendered = renderPrompt(prompt.content, values);
      setRenderedContent(rendered);
      
      const validationErrors = validateVariables(prompt.content, values);
      setErrors(validationErrors);
    }
  }, [prompt, values]);

  const handleValueChange = (variableName: string, value: string | number | boolean) => {
    setValues(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleReset = () => {
    if (prompt) {
      const resetValues: VariableValue = {};
      prompt.variables.forEach((variable) => {
        if (variable.defaultValue) {
          if (variable.type === 'number') {
            resetValues[variable.name] = Number(variable.defaultValue);
          } else {
            resetValues[variable.name] = variable.defaultValue;
          }
        } else {
          resetValues[variable.name] = variable.type === 'number' ? 0 : '';
        }
      });
      setValues(resetValues);
    }
  };

  if (!prompt) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={prompt.title} size="xl">
      <div className="flex h-[600px]">
        {/* Variables Panel */}
        <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Configure Variables</h3>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </div>
            
            {prompt.variables.length === 0 ? (
              <p className="text-gray-500 text-sm">No variables to configure in this prompt.</p>
            ) : (
              prompt.variables.map((variable) => (
                <VariableInput
                  key={variable.name}
                  variable={variable}
                  value={values[variable.name] || ''}
                  onChange={(value) => handleValueChange(variable.name, value)}
                />
              ))
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Missing required variables:</span>
                </div>
                <ul className="mt-1 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                  {errors.map((error) => (
                    <li key={error}>{error.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              disabled={errors.length > 0}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm leading-relaxed overflow-y-auto">
            <pre className="whitespace-pre-wrap">{renderedContent}</pre>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleCopy}
              className="flex-1"
              disabled={errors.length > 0}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
