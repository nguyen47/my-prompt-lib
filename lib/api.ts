import { Prompt } from '../types/prompt';

export class PromptAPI {
  private baseUrl = '/api/prompts';

  // Get all prompts or search
  async getPrompts(params?: {
    query?: string;
    category?: string;
    favorites?: boolean;
  }): Promise<Prompt[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.query) searchParams.set('q', params.query);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.favorites) searchParams.set('favorites', 'true');

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prompts');
    }
    
    const prompts = await response.json();
    return prompts.map(this.parsePrompt);
  }

  // Get prompt by ID
  async getPrompt(id: string): Promise<Prompt> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prompt');
    }
    
    const prompt = await response.json();
    return this.parsePrompt(prompt);
  }

  // Create new prompt
  async createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'variables'>): Promise<Prompt> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create prompt');
    }
    
    const newPrompt = await response.json();
    return this.parsePrompt(newPrompt);
  }

  // Update prompt
  async updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt' | 'variables'>>): Promise<Prompt> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update prompt');
    }
    
    const updatedPrompt = await response.json();
    return this.parsePrompt(updatedPrompt);
  }

  // Delete prompt
  async deletePrompt(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete prompt');
    }
  }

  // Toggle favorite
  async toggleFavorite(id: string): Promise<Prompt> {
    const response = await fetch(`${this.baseUrl}/${id}/favorite`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle favorite');
    }
    
    const updatedPrompt = await response.json();
    return this.parsePrompt(updatedPrompt);
  }

  // Parse prompt from API response (convert date strings to Date objects)
  private parsePrompt(prompt: any): Prompt {
    return {
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    };
  }
}

// Export singleton instance
export const promptAPI = new PromptAPI();
