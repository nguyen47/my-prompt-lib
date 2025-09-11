# My Prompt Library

A powerful, modern prompt library web application built with Next.js, TypeScript, and Tailwind CSS. Manage and organize your AI prompts with dynamic variables and beautiful UI.

## Features

### 🎯 Dynamic Variable System
- Support for multiple variable types: `text`, `textarea`, `select`, `radio`, `number`, `checkbox`
- Variable format: `{{variable_name:type:options:default}}`
- Real-time variable parsing and validation
- Live preview as you configure variables

### 📝 Prompt Management
- Create, edit, and organize prompts
- Search and filter by category, tags, or content
- Favorite prompts for quick access
- Copy prompts to clipboard
- Beautiful card-based layout

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Dark mode support
- Smooth animations and transitions
- Modal-based editors and configuration
- Mobile-friendly interface

### ⚡ Quick Insert
- Pre-built variable templates for common use cases
- Custom variable insertion
- Context-aware cursor positioning
- Floating quick insert panel

### 🏷️ Organization
- Categorize prompts by type (Content Creation, Development, Communication, etc.)
- Tag system for flexible organization
- Smart filtering and search
- Statistics and usage insights

## Variable Types & Examples

```typescript
// Text input
{{topic:text::Enter the topic}}

// Select dropdown
{{post_length:select:short|medium|long:medium}}

// Radio buttons
{{tone:radio:professional|casual|friendly:professional}}

// Number input
{{num_sections:number::3}}

// Textarea
{{additional_requirements:textarea::Any specific requirements}}

// Checkbox (multiple selection)
{{features:checkbox:feature1|feature2|feature3:feature1|feature2}}
```

## Sample Prompt

```
Write a {{post_length:select:short|medium|long:medium}} blog post about {{topic:text::Enter the topic}} targeting {{audience:select:beginners|intermediate|experts|general:general}}. The tone should be {{tone:radio:professional|casual|friendly|authoritative:professional}} and include {{num_sections:number::3}} main sections. {{additional_requirements:textarea::Any specific requirements}}
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Browse Prompts**: View all available prompts in the main grid
2. **Use a Prompt**: Click "Use" to configure variables and generate final text
3. **Edit Prompts**: Click the edit button to modify existing prompts
4. **Create New**: Use the "New Prompt" button to create custom prompts
5. **Quick Insert**: Use the floating panel when editing to insert common variables
6. **Search & Filter**: Find prompts by keywords, categories, or favorites

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **State Management**: React Hooks

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── prompt-card.tsx   # Prompt display card
│   ├── variable-input.tsx # Dynamic variable inputs
│   └── ...
├── lib/                  # Utility functions
│   ├── prompt-parser.ts  # Variable parsing logic
│   └── sample-prompts.ts # Default prompts
├── types/               # TypeScript definitions
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own prompt library!