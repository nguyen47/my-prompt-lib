import { Prompt } from '../types/prompt';
import { parseVariables } from './prompt-parser';

export const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Blog Post Writer',
    description: 'Generate comprehensive blog posts with customizable length, tone, and audience targeting',
    content: 'Write a {{post_length:select:short|medium|long:medium}} blog post about {{topic:text::Enter the topic}} targeting {{audience:select:beginners|intermediate|experts|general:general}}. The tone should be {{tone:radio:professional|casual|friendly|authoritative:professional}} and include {{num_sections:number::3}} main sections. {{additional_requirements:textarea::Any specific requirements}}',
    category: 'Content Creation',
    tags: ['blog', 'writing', 'content', 'marketing'],
    variables: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isFavorite: true
  },
  {
    id: '2',
    title: 'Code Review',
    description: 'Get detailed code reviews with specific focus areas and improvement suggestions',
    content: 'Please review this {{language:select:JavaScript|TypeScript|Python|Java|Go|Rust:JavaScript}} code for {{focus_areas:checkbox:performance|security|readability|best practices|bugs:performance|readability}}. Review level should be {{depth:radio:quick|thorough|comprehensive:thorough}}. {{code:textarea::Paste your code here}}',
    category: 'Development',
    tags: ['code', 'review', 'programming', 'quality'],
    variables: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    title: 'Email Template',
    description: 'Create professional email templates for various business scenarios',
    content: 'Write a {{email_type:select:follow-up|introduction|proposal|thank you|complaint:follow-up}} email to {{recipient:text::Recipient name}} regarding {{subject:text::Email subject}}. The tone should be {{tone:radio:formal|semi-formal|casual|friendly:formal}}. {{context:textarea::Additional context or details}}',
    category: 'Communication',
    tags: ['email', 'business', 'communication', 'template'],
    variables: [],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '4',
    title: 'Learning Plan',
    description: 'Generate structured learning plans for any topic with customizable difficulty and timeline',
    content: 'Create a {{duration:select:1 week|2 weeks|1 month|3 months|6 months:1 month}} learning plan for {{topic:text::What do you want to learn?}}. My current level is {{current_level:radio:beginner|intermediate|advanced:beginner}} and I can dedicate {{hours_per_day:number::2}} hours per day. Focus areas: {{focus_areas:checkbox:theory|practical projects|certifications|community engagement:theory|practical projects}}. {{specific_goals:textarea::Any specific goals or outcomes you want to achieve}}',
    category: 'Education',
    tags: ['learning', 'education', 'planning', 'development'],
    variables: [],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: '5',
    title: 'Product Description',
    description: 'Generate compelling product descriptions for e-commerce',
    content: 'Write a {{length:select:short|medium|detailed:medium}} product description for {{product_name:text::Product name}}. Target audience: {{target_audience:text::Describe your target customers}}. Key features: {{features:textarea::List the main features}}. Tone: {{tone:radio:persuasive|informative|casual|premium:persuasive}}. Include {{include_specs:checkbox:technical specifications|dimensions|warranty info|shipping details:technical specifications}}.',
    category: 'E-commerce',
    tags: ['product', 'description', 'marketing', 'sales'],
    variables: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
].map(prompt => ({
  ...prompt,
  variables: parseVariables(prompt.content)
}));
