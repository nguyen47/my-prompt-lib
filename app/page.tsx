'use client';

import { useState, useMemo, useEffect } from 'react';
import { Prompt } from '../types/prompt';
import { promptAPI } from '../lib/api';
import { PromptCard } from '../components/prompt-card';
import { VariableConfigModal } from '../components/variable-config-modal';
import { PromptEditorModal } from '../components/prompt-editor-modal';
import { ProtectedRoute } from '../components/protected-route';
import { AppHeader } from '../components/app-header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Search, Plus, Filter, Heart } from 'lucide-react';
import { clsx } from 'clsx';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Load prompts from database
  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promptAPI.getPrompts();
      setPrompts(data);
    } catch (err) {
      setError('Failed to load prompts. Please try again.');
      console.error('Error loading prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(prompts.map(p => p.category)));
    return ['all', ...cats.sort()];
  }, [prompts]);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || prompt.isFavorite;
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [prompts, searchQuery, selectedCategory, showFavoritesOnly]);

  const handleUsePrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsVariableModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsEditorModalOpen(true);
  };

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // Simple feedback - you could replace this with a toast library
      alert('Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      alert('Failed to copy prompt. Please try again.');
    }
  };

  const handleDeletePrompt = async (prompt: Prompt) => {
    if (!confirm(`Are you sure you want to delete "${prompt.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await promptAPI.deletePrompt(prompt.id);
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== prompt.id));
      alert('Prompt deleted successfully!');
    } catch (err) {
      console.error('Error deleting prompt:', err);
      alert('Failed to delete prompt. Please try again.');
    }
  };

  const handleToggleFavorite = async (promptId: string) => {
    try {
      const updatedPrompt = await promptAPI.toggleFavorite(promptId);
      setPrompts(prevPrompts =>
        prevPrompts.map(prompt =>
          prompt.id === promptId ? updatedPrompt : prompt
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  const handleSavePrompt = async (savedPrompt: Prompt) => {
    try {
      const existingPrompt = prompts.find(p => p.id === savedPrompt.id);
      let result: Prompt;

      if (existingPrompt) {
        // Update existing prompt
        const { id, createdAt, variables, ...updates } = savedPrompt;
        result = await promptAPI.updatePrompt(id, updates);
      } else {
        // Create new prompt
        const { id, createdAt, updatedAt, variables, ...promptData } = savedPrompt;
        result = await promptAPI.createPrompt(promptData);
      }

      // Update local state
      setPrompts(prevPrompts => {
        const existingIndex = prevPrompts.findIndex(p => p.id === result.id);
        if (existingIndex >= 0) {
          const newPrompts = [...prevPrompts];
          newPrompts[existingIndex] = result;
          return newPrompts;
        } else {
          return [result, ...prevPrompts];
        }
      });
    } catch (err) {
      console.error('Error saving prompt:', err);
      alert('Failed to save prompt. Please try again.');
    }
  };

  const handleCreateNew = () => {
    setEditingPrompt(null);
    setIsEditorModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <AppHeader onCreateNew={handleCreateNew} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={showFavoritesOnly ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Heart className={clsx('h-4 w-4 mr-1', showFavoritesOnly && 'fill-current')} />
                Favorites
              </Button>
              
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>{filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}</span>
          <span>{prompts.filter(p => p.isFavorite).length} favorite{prompts.filter(p => p.isFavorite).length !== 1 ? 's' : ''}</span>
          <span>{categories.length - 1} categor{categories.length !== 2 ? 'ies' : 'y'}</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading prompts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Prompts
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button onClick={loadPrompts}>
              Try Again
            </Button>
          </div>
        )}

        {/* Prompts Grid */}
        {!loading && !error && (
          <>
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No prompts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters, or create a new prompt.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Prompt
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onUse={handleUsePrompt}
                    onEdit={handleEditPrompt}
                    onCopy={handleCopyPrompt}
                    onDelete={handleDeletePrompt}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <VariableConfigModal
        isOpen={isVariableModalOpen}
        onClose={() => setIsVariableModalOpen(false)}
        prompt={selectedPrompt}
      />

      <PromptEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        prompt={editingPrompt}
        onSave={handleSavePrompt}
      />
      </div>
    </ProtectedRoute>
  );
}
