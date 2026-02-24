# Njord Support Portal - Simplified

A streamlined knowledge base for Njord Medtech products with smart article suggestions.

## Features

- **Knowledge Base**: Searchable FAQ articles organized by category
- **Smart Search**: Ask questions and get relevant article suggestions based on keywords
- **Simple Navigation**: Clean, focused interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/articles/    # API for fetching articles
│   ├── faq/             # Knowledge base pages
│   ├── chat/            # Question & article suggestion page
│   └── page.tsx         # Home (redirects to FAQ)
├── components/          # React components
├── lib/                 # Utilities
├── prisma/              # Database schema and seed
└── public/              # Static assets
```

## Database

The app uses a simple SQLite database with one main table:

- **KBArticles**: Knowledge base articles with title, category, symptoms, causes, and step-by-step solutions

## Starter Content

The seed script creates **12 articles** based on Atle 180 common issues:

1. Wire Cannot Be Pulled Out
2. Pulling Member Cannot Be Attached
3. Torque/Engine Stops During Operation
4. Error Indication on Hand Control
5. Hand Control Does Not Respond
6. Sound from Control Box - Error Indication
7. Battery Not Charging
8. Pre-Use Inspection Checklist
9. Replacement of the Wire
10. Annual Service and Maintenance
11. Atle Cannot Pull - Overload Protection
12. Home Position Sensor Not Working

## Categories

Articles are organized into 6 categories:
- Account & Access
- Setup / Installation
- Feature Not Working
- Performance / Reliability
- Billing / Subscription
- Other / Contact Support

## Usage

### Browse Knowledge Base

Navigate to the Knowledge Base to see all articles. Filter by category using the sidebar or use the search bar.

### Ask a Question

Go to "Ask a Question" and describe your issue. The app will suggest relevant articles based on keywords in your description.

### View Article

Click any article to see:
- Symptoms
- Likely Causes
- Step-by-Step Fix

## Adding New Articles

Currently, articles are added via the database seed script. To add new articles:

1. Edit `prisma/seed.ts`
2. Add your article to the `articles` array
3. Run `npm run db:seed` (this will reset the database)

## Future Enhancements

- Admin panel for managing articles via UI
- AI-powered article suggestions (OpenAI API integration)
- User authentication
- Support ticket system
- Chat history

## License

Proprietary - Njord Medtech
