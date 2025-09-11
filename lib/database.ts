import Database from 'better-sqlite3';
import path from 'path';
import { Prompt } from '../types/prompt';
import { parseVariables } from './prompt-parser';

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'prompts.db');
    db = new Database(dbPath);
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  if (!db) return;

  // Create prompts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL, -- JSON string array
      variables TEXT NOT NULL, -- JSON string of parsed variables
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      is_favorite INTEGER DEFAULT 0
    )
  `);

  console.log('Database initialized');
}

export interface DatabasePrompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  tags: string; // JSON string
  variables: string; // JSON string
  created_at: number;
  updated_at: number;
  is_favorite: number;
}

// Convert database row to Prompt object
export function dbRowToPrompt(row: DatabasePrompt): Prompt {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    content: row.content,
    category: row.category,
    tags: JSON.parse(row.tags),
    variables: JSON.parse(row.variables),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    isFavorite: row.is_favorite === 1
  };
}

// Convert Prompt object to database row
export function promptToDbRow(prompt: Prompt): Omit<DatabasePrompt, 'id'> {
  return {
    title: prompt.title,
    description: prompt.description || null,
    content: prompt.content,
    category: prompt.category,
    tags: JSON.stringify(prompt.tags),
    variables: JSON.stringify(prompt.variables),
    created_at: prompt.createdAt.getTime(),
    updated_at: prompt.updatedAt.getTime(),
    is_favorite: prompt.isFavorite ? 1 : 0
  };
}

// Database operations
export class PromptDatabase {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  // Get all prompts
  getAllPrompts(): Prompt[] {
    const stmt = this.db.prepare('SELECT * FROM prompts ORDER BY updated_at DESC');
    const rows = stmt.all() as DatabasePrompt[];
    return rows.map(dbRowToPrompt);
  }

  // Get prompt by ID
  getPromptById(id: string): Prompt | null {
    const stmt = this.db.prepare('SELECT * FROM prompts WHERE id = ?');
    const row = stmt.get(id) as DatabasePrompt | undefined;
    return row ? dbRowToPrompt(row) : null;
  }

  // Create new prompt
  createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
    const id = Date.now().toString();
    const now = new Date();
    const fullPrompt: Prompt = {
      ...prompt,
      id,
      createdAt: now,
      updatedAt: now,
      variables: parseVariables(prompt.content)
    };

    const dbRow = promptToDbRow(fullPrompt);
    const stmt = this.db.prepare(`
      INSERT INTO prompts (id, title, description, content, category, tags, variables, created_at, updated_at, is_favorite)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      dbRow.title,
      dbRow.description,
      dbRow.content,
      dbRow.category,
      dbRow.tags,
      dbRow.variables,
      dbRow.created_at,
      dbRow.updated_at,
      dbRow.is_favorite
    );

    return fullPrompt;
  }

  // Update prompt
  updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Prompt | null {
    const existingPrompt = this.getPromptById(id);
    if (!existingPrompt) return null;

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      ...updates,
      updatedAt: new Date(),
      variables: updates.content ? parseVariables(updates.content) : existingPrompt.variables
    };

    const dbRow = promptToDbRow(updatedPrompt);
    const stmt = this.db.prepare(`
      UPDATE prompts 
      SET title = ?, description = ?, content = ?, category = ?, tags = ?, 
          variables = ?, updated_at = ?, is_favorite = ?
      WHERE id = ?
    `);

    stmt.run(
      dbRow.title,
      dbRow.description,
      dbRow.content,
      dbRow.category,
      dbRow.tags,
      dbRow.variables,
      dbRow.updated_at,
      dbRow.is_favorite,
      id
    );

    return updatedPrompt;
  }

  // Delete prompt
  deletePrompt(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM prompts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Toggle favorite
  toggleFavorite(id: string): Prompt | null {
    const prompt = this.getPromptById(id);
    if (!prompt) return null;

    return this.updatePrompt(id, { isFavorite: !prompt.isFavorite });
  }

  // Search prompts
  searchPrompts(query: string): Prompt[] {
    const stmt = this.db.prepare(`
      SELECT * FROM prompts 
      WHERE title LIKE ? OR description LIKE ? OR content LIKE ? OR category LIKE ?
      ORDER BY updated_at DESC
    `);
    const searchTerm = `%${query}%`;
    const rows = stmt.all(searchTerm, searchTerm, searchTerm, searchTerm) as DatabasePrompt[];
    return rows.map(dbRowToPrompt);
  }

  // Get prompts by category
  getPromptsByCategory(category: string): Prompt[] {
    const stmt = this.db.prepare('SELECT * FROM prompts WHERE category = ? ORDER BY updated_at DESC');
    const rows = stmt.all(category) as DatabasePrompt[];
    return rows.map(dbRowToPrompt);
  }

  // Get favorite prompts
  getFavoritePrompts(): Prompt[] {
    const stmt = this.db.prepare('SELECT * FROM prompts WHERE is_favorite = 1 ORDER BY updated_at DESC');
    const rows = stmt.all() as DatabasePrompt[];
    return rows.map(dbRowToPrompt);
  }
}
