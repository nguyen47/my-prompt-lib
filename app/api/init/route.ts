import { NextResponse } from 'next/server';
import { seedDatabase } from '../../../scripts/seed-database';

// POST /api/init - Initialize database with sample data
export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
