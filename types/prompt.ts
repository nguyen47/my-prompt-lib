export type VariableType = 'text' | 'textarea' | 'select' | 'radio' | 'number' | 'checkbox';

export interface ParsedVariable {
  name: string;
  type: VariableType;
  options?: string[]; // For select/radio
  defaultValue?: string;
  placeholder?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  tags: string[];
  variables: ParsedVariable[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
}

export interface VariableValue {
  [key: string]: string | number | boolean;
}

export interface RenderedPrompt {
  content: string;
  variables: VariableValue;
}
