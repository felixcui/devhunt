# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevHunt (AICoding基地) is a Next.js 15 application that curates AI tools and programming resources for developers. The platform integrates with Feishu (Lark) for data management and includes Python crawlers for automated tool discovery.

## Core Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Language**: TypeScript with React 19
- **State Management**: Client-side React state
- **Fonts**: Geist Sans and Geist Mono (local fonts)

### Backend & Data Integration
- **API Layer**: Next.js API routes in `/src/app/api/`
- **Data Source**: Feishu (Lark) Bitable integration via REST APIs
- **Caching**: NodeCache for API response caching (1 hour TTL)
- **Python Tools**: Web crawlers for tool discovery and data extraction

### Key Components Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for tools, news, etc.
│   ├── category/[id]/     # Category-specific tool listings
│   ├── tool/[id]/         # Individual tool detail pages
│   └── news/              # News and updates section
├── components/            # Reusable React components
├── config/                # Configuration (Feishu integration)
├── lib/                   # Utility libraries (design system)
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions and mappings
```

## Essential Commands

### Development
```bash
# Start development server
pnpm dev

# Build for production
npm run build

# Start production server
npm run start

# Lint and fix code issues
npm run lint
```

### Python Tools (Data Management)
```bash
# Run tool crawler
cd python && python tool-crawler.py

# Process Feishu data
python feishu_table_transfer.py

# Execute all Python scripts
./run.sh
```

## Data Integration & APIs

### Feishu (Lark) Integration
The application connects to Feishu Bitable for content management:

- **Tools Table**: Primary database for AI tools with fields: name, description, url, category, updatetime, extra, tags
- **News Table**: Stores news articles with fields: title, link, tool, description, updatetime
- **Authentication**: Uses app credentials (APP_ID, APP_SECRET) for API access
- **Rate Limiting**: 1-hour cache to avoid API limits

### API Routes
- `GET /api/tools` - Fetch all tools with caching
- `GET /api/news` - Fetch news articles
- `GET /api/tools/[id]/news` - Tool-specific news
- `POST /api/tools/add` - Add new tools

## Design System

### Color Palette
- **Primary**: Professional blue (`#0052cc`) for brand elements
- **Secondary**: Slate colors for UI elements  
- **Accent**: Emerald green (`#10b981`) for positive actions
- **Categories**: Each tool category has unique gradient combinations

### Component Patterns
- **ToolCard**: Main component for displaying tools with gradients and hover effects
- **ToolGrid**: Responsive grid layout (1/2/3 columns based on screen size)
- **CategoryList**: Navigation for tool categories with icons
- **ThemeProvider**: Dark/light mode support

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Grid columns: 1 (mobile) → 2 (tablet) → 3 (desktop)
- Custom animations with reduced motion support

## Key Features

### Tool Management
- **Categories**: UI, SaaS, Plugin, Agent, Review, Test, Chat, Code Agent, IDE, etc.
- **Tags**: Dynamic tagging system for tool classification
- **Search**: Client-side search functionality
- **Featured Tools**: Priority display for selected tools

### Content Types
- **AI Tools**: Programming tools, IDEs, SaaS platforms, plugins
- **News**: Tool updates, releases, and announcements  
- **Categories**: Organized tool discovery with visual icons

### Python Integration
- **Web Crawling**: Automated tool discovery from AI tool directories
- **Data Processing**: Batch processing of Feishu table data
- **Logging**: Comprehensive logging for data operations

## Development Guidelines

### File Organization
- Use existing component patterns when adding new features
- Follow the established API route structure in `/api/`
- Maintain TypeScript interfaces in `/types/`
- Add utility functions to appropriate `/utils/` files

### Styling Conventions
- Use Tailwind classes with the established color system
- Implement responsive design with mobile-first approach
- Follow the design system documented in `DESIGN_SYSTEM.md`
- Use CSS custom properties for theme consistency

### API Development  
- Implement caching for external API calls (NodeCache)
- Handle Feishu API authentication and error states
- Use proper TypeScript typing for API responses
- Follow the established error handling patterns

### Python Scripts
- Follow existing patterns for Feishu API integration
- Implement proper error handling and logging
- Use the established configuration in `config/feishu.ts`
- Test crawlers with rate limiting considerations

## Environment Setup

### Required Environment Variables
```bash
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
NODE_ENV=development|production
```

### Dependencies
- Next.js 15 with React 19 RC
- TypeScript 5+ for type safety
- Tailwind CSS for styling
- Node-cache for API caching
- React Icons and Heroicons for UI

## Testing & Quality

- Use `npm run lint` to check code quality
- Test responsive design across breakpoints
- Verify Feishu integration with proper error handling
- Test Python crawlers with rate limiting

## Performance Considerations

- API responses are cached for 1 hour to reduce Feishu API calls
- Images use placeholder URLs (unsplash, placehold.co)
- Lazy loading implemented for tool cards
- Optimized bundle with Next.js automatic optimizations