import { Prompt } from '../types/prompt';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Edit, Copy, Play, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface PromptCardProps {
  prompt: Prompt;
  onUse: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onCopy: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onToggleFavorite: (promptId: string) => void;
}

export function PromptCard({ prompt, onUse, onEdit, onCopy, onDelete, onToggleFavorite }: PromptCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {prompt.title}
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              {prompt.description}
            </CardDescription>
          </div>
          <button
            onClick={() => onToggleFavorite(prompt.id)}
            className={clsx(
              'p-1 rounded-full transition-colors',
              prompt.isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            )}
          >
            <Heart className={clsx('h-4 w-4', prompt.isFavorite && 'fill-current')} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg font-mono leading-relaxed break-words overflow-hidden">
            <div className="line-clamp-3">
              {prompt.content.length > 150 
                ? `${prompt.content.substring(0, 150)}...` 
                : prompt.content
              }
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {prompt.category}
            </Badge>
            {prompt.variables.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {prompt.variables.length} variable{prompt.variables.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex gap-2">
        <Button
          onClick={() => onUse(prompt)}
          size="sm"
          className="flex-1"
        >
          <Play className="h-3 w-3 mr-1" />
          Use
        </Button>
        <Button
          onClick={() => onEdit(prompt)}
          variant="outline"
          size="sm"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => onCopy(prompt)}
          variant="outline"
          size="sm"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => onDelete(prompt)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
