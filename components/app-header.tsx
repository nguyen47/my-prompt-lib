'use client';

import { useAuth } from '../contexts/auth-context';
import { Button } from './ui/button';
import { LogOut, Plus, User } from 'lucide-react';

interface AppHeaderProps {
  onCreateNew: () => void;
}

export function AppHeader({ onCreateNew }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              My Prompt Library
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Prompt
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
