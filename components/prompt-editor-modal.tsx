import { useState, useEffect, useRef } from 'react';
import { Prompt } from '../types/prompt';
import { parseVariables } from '../lib/prompt-parser';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { QuickInsert } from './quick-insert';
import { Save, X, Plus } from 'lucide-react';

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
  onSave: (prompt: Prompt) => void;
}

export function PromptEditorModal({ isOpen, onClose, prompt, onSave }: PromptEditorModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [parsedVariables, setParsedVariables] = useState<any[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description || '');
      setContent(prompt.content);
      setCategory(prompt.category);
      setTags(prompt.tags);
    } else {
      // Reset form for new prompt
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('');
      setTags([]);
    }
  }, [prompt]);

  useEffect(() => {
    const variables = parseVariables(content);
    setParsedVariables(variables);
  }, [content]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const variables = parseVariables(content);
    
    const savedPrompt: Prompt = {
      id: prompt?.id || Date.now().toString(),
      title,
      description,
      content,
      category,
      tags,
      variables,
      createdAt: prompt?.createdAt || new Date(),
      updatedAt: new Date(),
      isFavorite: prompt?.isFavorite || false
    };

    onSave(savedPrompt);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const handleQuickInsert = (text: string) => {
    if (contentRef.current) {
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={prompt ? 'Edit Prompt' : 'Create New Prompt'} size="xl">
      <div className="flex h-[700px]">
        {/* Editor Panel */}
        <div className="w-2/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
          {/* Metadata Section - Compact */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter prompt title"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Content Creation, Development"
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this prompt does"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {/* Quick Insert Component */}
              <div className="mt-3">
                <QuickInsert onInsert={handleQuickInsert} inline />
              </div>
            </div>
          </div>

          {/* Prompt Content - Main Section */}
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt with variables in {{name:type:options:default}} format"
              className="font-mono flex-1 min-h-[300px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use variables like: {`{{topic:text::Enter topic}}, {{length:select:short|medium|long:medium}}`}
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/3 p-4 flex flex-col">
          <h3 className="text-base font-semibold mb-3">Variables</h3>
          
          {parsedVariables.length === 0 ? (
            <p className="text-gray-500 text-xs">No variables detected</p>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {parsedVariables.map((variable, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded border">
                  <div className="font-medium text-xs text-gray-800 dark:text-gray-200">{variable.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{variable.type}</span>
                    {variable.options && (
                      <div className="mt-1 text-xs">
                        <span className="font-mono text-gray-500">{variable.options.join(' | ')}</span>
                      </div>
                    )}
                    {variable.defaultValue && (
                      <div className="text-xs text-gray-500">Default: {variable.defaultValue}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!title.trim() || !content.trim() || !category.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Prompt
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
