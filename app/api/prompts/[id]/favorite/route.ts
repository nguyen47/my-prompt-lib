import { NextRequest, NextResponse } from 'next/server';
import { PromptDatabase } from '../../../../../lib/database';

const db = new PromptDatabase();

// POST /api/prompts/[id]/favorite - Toggle favorite status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedPrompt = db.toggleFavorite(params.id);
    
    if (!updatedPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
