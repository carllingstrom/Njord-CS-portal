import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getArticleById, getPublishedArticles } from '@/lib/articles'

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ id: article.id }))
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const article = getArticleById(params.id)

  if (!article) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-njord-subtle">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover mb-6 font-medium transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Knowledge Base
          </Link>

          <article className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-njord-dark mb-5 tracking-tight">{article.title}</h1>

              <div className="flex items-center gap-2 mb-8 flex-wrap">
                <span className="bg-njord-pale text-njord-dark px-3 py-1.5 rounded-lg text-sm font-medium">{article.category}</span>
                {article.tags.map((tag) => (
                  <span key={tag} className="bg-accent-pale text-accent-hover px-3 py-1.5 rounded-lg text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {article.symptoms && (
                <div className="mb-6 p-5 bg-njord-dark text-white rounded-lg">
                  <h2 className="font-semibold text-white mb-2">Symptoms</h2>
                  <p className="text-white/90 whitespace-pre-line text-sm leading-relaxed">{article.symptoms}</p>
                </div>
              )}

              {article.causes && (
                <div className="mb-6 p-5 bg-njord-dark text-white rounded-lg">
                  <h2 className="font-semibold text-white mb-2">Likely Causes</h2>
                  <p className="text-white/90 whitespace-pre-line text-sm leading-relaxed">{article.causes}</p>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-njord-dark mb-4">Step-by-Step Fix</h2>
                <div
                  className="prose prose-sm max-w-none prose-headings:text-njord-dark prose-p:text-njord-muted prose-li:text-njord-muted"
                  dangerouslySetInnerHTML={{ __html: article.steps.replace(/\n/g, '<br />') }}
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover font-medium transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Back to Search
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
