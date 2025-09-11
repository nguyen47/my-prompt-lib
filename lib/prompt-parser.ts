import { ParsedVariable, VariableType, VariableValue } from '../types/prompt';

/**
 * Parses variables from prompt content in the format:
 * {{variable_name:type:options:default}}
 * 
 * Examples:
 * {{topic:text::Enter the topic}}
 * {{post_length:select:short,medium,long:medium}}
 * {{tone:radio:professional,casual,friendly:professional}}
 * {{num_sections:number::3}}
 * {{additional_requirements:textarea::Any specific requirements}}
 */
export function parseVariables(content: string): ParsedVariable[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: ParsedVariable[] = [];
  const seenNames = new Set<string>();

  let match;
  while ((match = variableRegex.exec(content)) !== null) {
    const variableString = match[1];
    const parts = variableString.split(':');
    
    if (parts.length < 2) continue;

    const name = parts[0].trim();
    const type = parts[1].trim() as VariableType;
    
    // Skip if we've already seen this variable
    if (seenNames.has(name)) continue;
    seenNames.add(name);

    let options: string[] | undefined;
    let defaultValue: string | undefined;
    let placeholder: string | undefined;

    if (parts.length >= 3) {
      const optionsOrPlaceholder = parts[2].trim();
      if (optionsOrPlaceholder && (type === 'select' || type === 'radio')) {
        options = optionsOrPlaceholder.split('|').map(opt => opt.trim());
      } else if (optionsOrPlaceholder) {
        placeholder = optionsOrPlaceholder;
      }
    }

    if (parts.length >= 4) {
      defaultValue = parts[3].trim();
    }

    variables.push({
      name,
      type,
      options,
      defaultValue,
      placeholder
    });
  }

  return variables;
}

/**
 * Renders a prompt with the given variable values
 */
export function renderPrompt(content: string, values: VariableValue): string {
  let rendered = content;
  
  // Replace all variable placeholders with actual values
  const variableRegex = /\{\{([^}:]+):[^}]*\}\}/g;
  
  rendered = rendered.replace(variableRegex, (match, variableName) => {
    const value = values[variableName.trim()];
    return value !== undefined ? String(value) : match;
  });

  return rendered;
}

/**
 * Extracts just the variable names from the content for quick replacement
 */
export function getVariableNames(content: string): string[] {
  const variableRegex = /\{\{([^}:]+):[^}]*\}\}/g;
  const names: string[] = [];
  let match;

  while ((match = variableRegex.exec(content)) !== null) {
    const name = match[1].trim();
    if (!names.includes(name)) {
      names.push(name);
    }
  }

  return names;
}

/**
 * Validates that all variables in the content have values
 */
export function validateVariables(content: string, values: VariableValue): string[] {
  const variableNames = getVariableNames(content);
  const missingVariables: string[] = [];

  for (const name of variableNames) {
    if (values[name] === undefined || values[name] === '') {
      missingVariables.push(name);
    }
  }

  return missingVariables;
}
