import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default async function ArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const article = await prisma.kBArticle.findFirst({
    where: {
      id: params.id,
      published: true,
    },
  })

  if (!article) {
    notFound()
  }

  const tags = article.tags ? JSON.parse(article.tags) : []

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="text-accent hover:text-accent-hover mb-4 inline-block font-medium transition-colors"
          >
            ← Back to Knowledge Base
          </Link>

          <article className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded">{article.category}</span>
              {tags.map((tag: string) => (
                <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            {article.symptoms && (
              <div className="mb-6 p-4 bg-njord-dark text-white rounded">
                <h2 className="font-semibold text-white mb-2">Symptoms</h2>
                <p className="text-white whitespace-pre-line opacity-90">{article.symptoms}</p>
              </div>
            )}

            {article.causes && (
              <div className="mb-6 p-4 bg-njord-dark text-white rounded">
                <h2 className="font-semibold text-white mb-2">Likely Causes</h2>
                <p className="text-white whitespace-pre-line opacity-90">{article.causes}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Fix</h2>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.steps.replace(/\n/g, '<br />') }}
              />
            </div>

            <div className="border-t pt-6">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover font-medium transition-colors"
              >
                Back to Search
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}

