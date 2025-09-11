import { NextRequest, NextResponse } from 'next/server';
import { PromptDatabase } from '../../../lib/database';
import { Prompt } from '../../../types/prompt';

const db = new PromptDatabase();

// GET /api/prompts - Get all prompts or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const favorites = searchParams.get('favorites');

    let prompts: Prompt[];

    if (query) {
      prompts = db.searchPrompts(query);
    } else if (category && category !== 'all') {
      prompts = db.getPromptsByCategory(category);
    } else if (favorites === 'true') {
      prompts = db.getFavoritePrompts();
    } else {
      prompts = db.getAllPrompts();
    }

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error getting prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

// POST /api/prompts - Create new prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, category, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const prompt = db.createPrompt({
      title,
      description,
      content,
      category,
      tags: tags || [],
      variables: [], // Will be parsed in createPrompt
      isFavorite: false
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
  }
}
