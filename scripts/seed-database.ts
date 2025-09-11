import { PromptDatabase } from '../lib/database';
import { samplePrompts } from '../lib/sample-prompts';

async function seedDatabase() {
  console.log('Seeding database with sample prompts...');
  
  const db = new PromptDatabase();
  
  // Check if database already has prompts
  const existingPrompts = db.getAllPrompts();
  if (existingPrompts.length > 0) {
    console.log('Database already has prompts. Skipping seed.');
    return;
  }

  // Add sample prompts to database
  for (const prompt of samplePrompts) {
    const { id, createdAt, updatedAt, ...promptData } = prompt;
    db.createPrompt(promptData);
    console.log(`Added prompt: ${prompt.title}`);
  }

  console.log(`Successfully seeded database with ${samplePrompts.length} prompts!`);
}

// Run if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
