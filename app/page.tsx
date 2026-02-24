import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import FAQItem from '@/components/FAQItem'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const search = searchParams.search?.trim().toLowerCase() || ''

  let articles: any[] = []

  if (search) {
    // Split search into words for AND logic
    const searchWords = search.split(/\s+/).filter((w) => w.length > 0)
    const isMultiWord = searchWords.length > 1

    // Build search conditions using AND logic for multi-word searches
    const wordConditions: any[] = []
    
    searchWords.forEach((word) => {
      wordConditions.push({
        OR: [
          { title: { contains: word } },
          { symptoms: { contains: word } },
          { causes: { contains: word } },
          { steps: { contains: word } },
        ],
      })
    })

    // Fetch articles that match ALL words (AND logic)
    const matchingArticles = await prisma.kBArticle.findMany({
      where: {
        published: true,
        AND: wordConditions,
      },
      orderBy: { order: 'asc' },
    })

    // Score all matching articles by relevance
    const scored = matchingArticles.map((article: any) => {
      return {
        ...article,
        score: calculateRelevanceScore(article, search, searchWords),
      }
    })

    const goodMatches = scored.filter((a: any) => a.score > 0)
    
    if (goodMatches.length > 0) {
      articles = goodMatches.sort((a: any, b: any) => b.score - a.score)
    } else if (isMultiWord) {
      // Fallback to OR logic
      const orConditions: any[] = []
      searchWords.forEach((word) => {
        orConditions.push(
          { title: { contains: word } },
          { symptoms: { contains: word } },
          { causes: { contains: word } },
          { steps: { contains: word } }
        )
      })

      const orMatches = await prisma.kBArticle.findMany({
        where: {
          published: true,
          OR: orConditions,
        },
        orderBy: { order: 'asc' },
      })

      const scoredOr = orMatches.map((article: any) => ({
        ...article,
        score: calculateRelevanceScore(article, search, searchWords),
      }))

      articles = scoredOr
        .filter((a: any) => a.score > 0)
        .sort((a: any, b: any) => b.score - a.score)
        .filter((article: any, index: number, self: any[]) => 
          index === self.findIndex((a: any) => a.id === article.id)
        )
    } else {
      // Single word search - try synonyms
      const expandedTerms = expandSearchWithSynonyms(search)
      const allSearchTerms = [search, ...expandedTerms.slice(0, 3)]
      
      const synonymWhere: any = {
        published: true,
        OR: [],
      }
      
      allSearchTerms.forEach((term: string) => {
        synonymWhere.OR.push(
          { title: { contains: term } },
          { symptoms: { contains: term } },
          { causes: { contains: term } },
          { steps: { contains: term } }
        )
      })

      const synonymMatches = await prisma.kBArticle.findMany({
        where: synonymWhere,
        orderBy: { order: 'asc' },
      })

      const scoredSyn = synonymMatches.map((article: any) => {
        const score = calculateRelevanceScore(article, search, [search])
        const hasExactMatch = article.title.toLowerCase().includes(search) ||
                             (article.symptoms || '').toLowerCase().includes(search) ||
                             (article.causes || '').toLowerCase().includes(search) ||
                             (article.steps || '').toLowerCase().includes(search)
        return { ...article, score: hasExactMatch ? score : score * 0.5 }
      })

      articles = scoredSyn
        .filter((a: any) => a.score > 0)
        .sort((a: any, b: any) => b.score - a.score)
        .filter((article: any, index: number, self: any[]) => 
          index === self.findIndex((a: any) => a.id === article.id)
        )
    }
  } else {
    // No search - show all articles in order
    articles = await prisma.kBArticle.findMany({
      where: {
        published: true,
      },
      orderBy: { order: 'asc' },
    })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section with Search */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-njord-dark mb-4">
              How can we help you?
            </h1>
            <p className="text-gray-900 mb-6 text-lg font-medium">
              Search our knowledge base for solutions to common issues
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar initialValue={search} />
            </div>
          </div>

          {/* Results Count */}
          {search && (
            <div className="mb-4 text-sm text-gray-600">
              {articles.length === 0 ? (
                <span>No articles found</span>
              ) : (
                <span>Found {articles.length} article{articles.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          )}

          {/* FAQ Items - Collapsible */}
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                {search ? (
                  <>
                    <p className="mb-4">No articles found for &quot;{search}&quot;</p>
                    <p className="text-sm">Try different keywords</p>
                  </>
                ) : (
                  <p>No articles available</p>
                )}
              </div>
            ) : (
              articles.map((article: any) => (
                <FAQItem key={article.id} article={article} />
              ))
            )}
          </div>

          {/* Show "all articles" link if searching */}
          {search && articles.length > 0 && (
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-accent hover:text-accent-hover font-medium transition-colors"
              >
                Clear search and show all articles
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Calculate relevance score for an article based on search term
function calculateRelevanceScore(
  article: any,
  searchTerm: string,
  searchWords?: string[]
): number {
  let score = 0
  const searchLower = searchTerm.toLowerCase()
  const title = (article.title || '').toLowerCase()
  const symptoms = (article.symptoms || '').toLowerCase()
  const causes = (article.causes || '').toLowerCase()
  const steps = (article.steps || '').toLowerCase()
  const allText = `${title} ${symptoms} ${causes} ${steps}`

  const words = searchWords || searchLower.split(/\s+/).filter((w) => w.length > 0)
  const isMultiWord = words.length > 1

  // 1. Exact phrase match - highest priority
  if (title.includes(searchLower)) score += 100
  if (symptoms.includes(searchLower)) score += 50
  if (causes.includes(searchLower)) score += 40
  if (steps.includes(searchLower)) score += 30

  // 2. All words present (AND logic)
  if (isMultiWord) {
    const wordsInTitle = words.filter((word) => title.includes(word.toLowerCase())).length
    const wordsInSymptoms = words.filter((word) => symptoms.includes(word.toLowerCase())).length
    const wordsInCauses = words.filter((word) => causes.includes(word.toLowerCase())).length
    const wordsInSteps = words.filter((word) => steps.includes(word.toLowerCase())).length
    const wordsInAll = words.filter((word) => allText.includes(word.toLowerCase())).length

    if (wordsInTitle === words.length) {
      score += 90
    } else if (wordsInTitle > 0) {
      score += 45 * (wordsInTitle / words.length)
    }

    if (wordsInSymptoms === words.length) {
      score += 60
    } else if (wordsInSymptoms > 0) {
      score += 30 * (wordsInSymptoms / words.length)
    }

    if (wordsInAll === words.length) {
      score += 70
    } else {
      const matchRatio = wordsInAll / words.length
      score += 35 * matchRatio
    }
  }

  // 3. Individual word matches
  words.forEach((word) => {
    const wordLower = word.toLowerCase()
    if (title.includes(wordLower)) score += 15
    if (symptoms.includes(wordLower)) score += 8
    if (causes.includes(wordLower)) score += 6
    if (steps.includes(wordLower)) score += 4
  })

  // 4. Word proximity bonus
  if (isMultiWord && words.length === 2) {
    const [word1, word2] = words.map((w: string) => w.toLowerCase())
    const titleWords = title.split(/\s+/)
    const word1Index = titleWords.findIndex((w: string) => w.includes(word1))
    const word2Index = titleWords.findIndex((w: string) => w.includes(word2))
    if (word1Index >= 0 && word2Index >= 0 && Math.abs(word1Index - word2Index) < 10) {
      score += 20
    }
  }

  return score
}

// Synonym mapping function
function expandSearchWithSynonyms(term: string): string[] {
  const synonyms: { [key: string]: string[] } = {
    'line': ['wire', 'cable', 'rope'],
    'wire': ['line', 'cable', 'rope'],
    'cable': ['wire', 'line', 'rope'],
    'rope': ['wire', 'line', 'cable'],
    'change': ['replace', 'replacement', 'swap', 'substitute'],
    'replace': ['change', 'replacement', 'swap', 'substitute'],
    'replacement': ['change', 'replace', 'swap', 'substitute'],
    'bobbin': ['spool', 'reel'],
    'spool': ['bobbin', 'reel'],
    'battery': ['power', 'charge', 'power pack'],
    'charging': ['charge', 'power'],
    'charge': ['charging', 'power', 'battery'],
    'hand control': ['remote', 'controller', 'handset'],
    'remote': ['hand control', 'controller', 'handset'],
    'controller': ['hand control', 'remote', 'handset'],
    'not working': ['broken', 'malfunction', 'issue', 'problem'],
    'broken': ['not working', 'malfunction', 'issue', 'problem'],
    'stops': ['stops working', 'ceases', 'halts'],
    'stuck': ['jammed', 'blocked', 'caught'],
    'error': ['fault', 'problem', 'issue'],
    'sensor': ['detector', 'switch'],
  }

  const terms = new Set<string>([term])
  const lowerTerm = term.toLowerCase()
  const words = lowerTerm.split(/\s+/)

  Object.keys(synonyms).forEach((key) => {
    if (lowerTerm.includes(key.toLowerCase())) {
      synonyms[key].forEach((syn) => {
        terms.add(syn)
        const replaced = lowerTerm.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), syn)
        if (replaced !== lowerTerm) {
          terms.add(replaced)
        }
      })
    }
  })

  words.forEach((word) => {
    if (synonyms[word]) {
      synonyms[word].forEach((syn) => {
        terms.add(syn)
        const replaced = lowerTerm.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), syn)
        if (replaced !== lowerTerm) {
          terms.add(replaced)
        }
      })
    }
  })

  return Array.from(terms).filter((t) => t !== lowerTerm)
}
