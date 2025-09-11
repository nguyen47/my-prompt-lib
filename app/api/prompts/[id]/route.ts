import { NextRequest, NextResponse } from 'next/server';
import { PromptDatabase } from '../../../../lib/database';

const db = new PromptDatabase();

// GET /api/prompts/[id] - Get prompt by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = db.getPromptById(params.id);
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error getting prompt:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 });
  }
}

// PUT /api/prompts/[id] - Update prompt
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, content, category, tags, isFavorite } = body;

    const updatedPrompt = db.updatePrompt(params.id, {
      title,
      description,
      content,
      category,
      tags,
      isFavorite
    });

    if (!updatedPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
  }
}

// DELETE /api/prompts/[id] - Delete prompt
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = db.deletePrompt(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
  }
}
