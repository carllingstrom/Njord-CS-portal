import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import FAQItem from '@/components/FAQItem'
import { getPublishedArticles, Article } from '@/lib/articles'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const search = searchParams.search?.trim().toLowerCase() || ''
  const allArticles = getPublishedArticles()

  let articles: Article[] = []

  if (search) {
    const searchWords = search.split(/\s+/).filter((w) => w.length > 0)
    const isMultiWord = searchWords.length > 1

    const matchesAllWords = (article: Article) =>
      searchWords.every((word) => {
        const w = word.toLowerCase()
        return (
          article.title.toLowerCase().includes(w) ||
          article.symptoms.toLowerCase().includes(w) ||
          article.causes.toLowerCase().includes(w) ||
          article.steps.toLowerCase().includes(w) ||
          article.tags.some((t) => t.toLowerCase().includes(w))
        )
      })

    const matchesAnyWord = (article: Article) =>
      searchWords.some((word) => {
        const w = word.toLowerCase()
        return (
          article.title.toLowerCase().includes(w) ||
          article.symptoms.toLowerCase().includes(w) ||
          article.causes.toLowerCase().includes(w) ||
          article.steps.toLowerCase().includes(w) ||
          article.tags.some((t) => t.toLowerCase().includes(w))
        )
      })

    const andMatches = allArticles.filter(matchesAllWords)

    if (andMatches.length > 0) {
      const scored = andMatches.map((a) => ({
        ...a,
        score: calculateRelevanceScore(a, search, searchWords),
      }))
      articles = scored.sort((a, b) => b.score - a.score)
    } else if (isMultiWord) {
      const orMatches = allArticles.filter(matchesAnyWord)
      const scored = orMatches.map((a) => ({
        ...a,
        score: calculateRelevanceScore(a, search, searchWords),
      }))
      articles = scored.filter((a) => a.score > 0).sort((a, b) => b.score - a.score)
    } else {
      const expandedTerms = expandSearchWithSynonyms(search)
      const allTerms = [search, ...expandedTerms.slice(0, 3)]

      const synonymMatches = allArticles.filter((article) =>
        allTerms.some((term) => {
          const t = term.toLowerCase()
          return (
            article.title.toLowerCase().includes(t) ||
            article.symptoms.toLowerCase().includes(t) ||
            article.causes.toLowerCase().includes(t) ||
            article.steps.toLowerCase().includes(t) ||
            article.tags.some((tag) => tag.toLowerCase().includes(t))
          )
        })
      )

      const scored = synonymMatches.map((article) => {
        const score = calculateRelevanceScore(article, search, [search])
        const hasExactMatch =
          article.title.toLowerCase().includes(search) ||
          article.symptoms.toLowerCase().includes(search) ||
          article.causes.toLowerCase().includes(search) ||
          article.steps.toLowerCase().includes(search)
        return { ...article, score: hasExactMatch ? score : score * 0.5 }
      })

      articles = scored.filter((a) => a.score > 0).sort((a, b) => b.score - a.score)
    }
  } else {
    articles = allArticles
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-njord-subtle">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-njord-dark mb-4 tracking-tight">
              How can we help you?
            </h1>
            <p className="text-njord-muted text-lg mb-8 max-w-xl mx-auto">
              Search our knowledge base for solutions to common issues
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar initialValue={search} />
            </div>
          </div>

          {search && (
            <div className="mb-5 text-sm text-njord-muted font-medium">
              {articles.length === 0 ? (
                <span>No articles found</span>
              ) : (
                <span>Found {articles.length} article{articles.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          )}

          <div className="space-y-3">
            {articles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-card border border-gray-100 p-12 text-center">
                {search ? (
                  <>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-pale flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-njord-dark font-medium mb-1">No articles found for &quot;{search}&quot;</p>
                    <p className="text-njord-muted text-sm">Try different keywords or browse all articles</p>
                    <a href="/" className="mt-4 inline-block text-accent hover:text-accent-hover font-medium text-sm transition-colors">
                      View all articles &rarr;
                    </a>
                  </>
                ) : (
                  <p className="text-njord-muted">No articles available</p>
                )}
              </div>
            ) : (
              articles.map((article) => (
                <FAQItem key={article.id} article={article} />
              ))
            )}
          </div>

          {search && articles.length > 0 && (
            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Clear search and show all articles
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function calculateRelevanceScore(
  article: Article,
  searchTerm: string,
  searchWords: string[]
): number {
  let score = 0
  const searchLower = searchTerm.toLowerCase()
  const title = article.title.toLowerCase()
  const symptoms = article.symptoms.toLowerCase()
  const causes = article.causes.toLowerCase()
  const steps = article.steps.toLowerCase()
  const tagText = article.tags.join(' ').toLowerCase()
  const allText = `${title} ${symptoms} ${causes} ${steps} ${tagText}`

  const words = searchWords
  const isMultiWord = words.length > 1

  if (title.includes(searchLower)) score += 100
  if (symptoms.includes(searchLower)) score += 50
  if (causes.includes(searchLower)) score += 40
  if (steps.includes(searchLower)) score += 30
  if (tagText.includes(searchLower)) score += 60

  if (isMultiWord) {
    const wordsInTitle = words.filter((word) => title.includes(word.toLowerCase())).length
    const wordsInAll = words.filter((word) => allText.includes(word.toLowerCase())).length

    if (wordsInTitle === words.length) score += 90
    else if (wordsInTitle > 0) score += 45 * (wordsInTitle / words.length)

    if (wordsInAll === words.length) score += 70
    else score += 35 * (wordsInAll / words.length)
  }

  words.forEach((word) => {
    const w = word.toLowerCase()
    if (title.includes(w)) score += 15
    if (symptoms.includes(w)) score += 8
    if (causes.includes(w)) score += 6
    if (steps.includes(w)) score += 4
    if (tagText.includes(w)) score += 12
  })

  if (isMultiWord && words.length === 2) {
    const [word1, word2] = words.map((w) => w.toLowerCase())
    const titleWords = title.split(/\s+/)
    const i1 = titleWords.findIndex((w) => w.includes(word1))
    const i2 = titleWords.findIndex((w) => w.includes(word2))
    if (i1 >= 0 && i2 >= 0 && Math.abs(i1 - i2) < 10) score += 20
  }

  return score
}

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
        if (replaced !== lowerTerm) terms.add(replaced)
      })
    }
  })

  words.forEach((word) => {
    if (synonyms[word]) {
      synonyms[word].forEach((syn) => {
        terms.add(syn)
        const replaced = lowerTerm.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), syn)
        if (replaced !== lowerTerm) terms.add(replaced)
      })
    }
  })

  return Array.from(terms).filter((t) => t !== lowerTerm)
}
