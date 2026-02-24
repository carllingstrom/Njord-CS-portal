# Njord Support Portal - Simplified Version

## What Changed

The app has been drastically simplified from a full-featured support portal to a focused knowledge base with smart search.

### ✅ What's Included

1. **Knowledge Base** (`/faq`)
   - Browse 12 articles about Atle 180 issues
   - Filter by 6 categories
   - Search functionality
   - Clean article pages with symptoms, causes, and step-by-step fixes

2. **Ask a Question** (`/chat`)
   - Simple keyword-based article suggestions
   - Type your issue and get relevant articles
   - Quick suggestion buttons for common issues
   - No AI required (ready for AI integration later)

3. **Simple Navigation**
   - Clean navbar with just 2 pages
   - Responsive design
   - Fast and focused

### ❌ What Was Removed

- Authentication/Login system
- Admin console
- Ticket submission
- Complex troubleshooting flows
- Multi-tenancy/Organizations
- User roles
- Chat transcripts storage
- Analytics

### 🎯 Current Features

**Knowledge Base:**
- 12 pre-seeded articles based on Atle 180 manual
- Categories: Account & Access, Setup/Installation, Feature Not Working, Performance/Reliability, Billing/Subscription, Other
- Search by keywords in title, symptoms, causes, or steps
- Tags for better organization

**Smart Search:**
- Type any issue description
- Get up to 5 relevant article suggestions
- Keyword matching across all article fields
- Quick buttons for common issues

## How to Use

1. **Browse Articles**: Go to http://localhost:3000 (redirects to `/faq`)
2. **Search**: Use the search bar to find specific issues
3. **Ask Questions**: Click "Ask a Question" to describe your issue and get suggestions
4. **Read Solutions**: Click any article to see detailed fix instructions

## File Structure (Simplified)

```
app/
├── api/articles/        # Fetch articles
├── faq/                 # Knowledge base pages
│   ├── [id]/           # Individual article
│   └── page.tsx        # Article list
├── chat/               # Question & suggestions
└── page.tsx            # Home (redirects to FAQ)

components/
├── Navbar.tsx          # Simple 2-page navigation
└── SearchBar.tsx       # Search component

lib/
├── prisma.ts           # Database client
└── middleware.ts       # Auth disabled (mock user)

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # 12 starter articles
```

## Adding AI Later

The chat page is ready for AI integration. To add OpenAI:

1. Install OpenAI SDK: `npm install openai`
2. Add API key to `.env`: `OPENAI_API_KEY=your-key`
3. Update `/app/chat/page.tsx` to call OpenAI API
4. Use embeddings or semantic search for better suggestions

Example integration point in `chat/page.tsx`:

```typescript
// Instead of keyword matching:
const filtered = allArticles.filter(article => ...)

// Use AI:
const response = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: userInput,
})
// Then find similar articles using cosine similarity
```

## Database

Single table: `KBArticle`
- id, title, category, tags
- symptoms, causes, steps
- published, timestamps

## Next Steps

Choose your path:

**Option A: Keep it Simple**
- Add more articles via seed script
- Improve keyword matching
- Add article ratings/feedback

**Option B: Add AI**
- Integrate OpenAI for semantic search
- Generate article summaries
- Chatbot for follow-up questions

**Option C: Re-add Features**
- Bring back ticket system
- Add admin panel for article management
- User authentication

## Quick Commands

```bash
# Start dev server
npm run dev

# Reset database and reseed
rm prisma/dev.db
npm run db:push
npm run db:seed

# Add new articles
# Edit prisma/seed.ts, then:
npm run db:seed
```

## Current URL Structure

- `/` → redirects to `/faq`
- `/faq` → Knowledge base (all articles)
- `/faq?category=X` → Filtered by category
- `/faq?search=X` → Search results
- `/faq/[id]` → Individual article
- `/chat` → Ask a question page

All pages work without authentication!

