'use client'

import { useState } from 'react'

interface FAQItemProps {
  article: {
    id: string
    title: string
    symptoms?: string | null
    causes?: string | null
    steps: string
    videoUrl?: string | null
    videoEmbed?: string | null
    tags?: string | null
  }
}

export default function FAQItem({ article }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tags = article.tags ? JSON.parse(article.tags) : []

  // Extract YouTube video ID from URL if it's a YouTube link
  const getYouTubeEmbedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    
    // Handle YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    
    // Handle Vimeo URLs
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    return null
  }

  const embedUrl = getYouTubeEmbedUrl(article.videoUrl)

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-njord-dark mb-1">
            {article.title}
          </h3>
          {article.symptoms && !isOpen && (
            <p className="text-sm text-gray-600 line-clamp-1">
              <span className="font-medium">Symptoms:</span> {article.symptoms}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 space-y-4">
          {/* Symptoms */}
          {/* Symptoms */}
          {article.symptoms && (
            <div className="p-4 bg-njord-dark text-white rounded">
              <h4 className="font-semibold text-white mb-2">Symptoms</h4>
              <p className="text-white whitespace-pre-line text-sm opacity-90">{article.symptoms}</p>
            </div>
          )}

          {/* Causes */}
          {article.causes && (
            <div className="p-4 bg-njord-dark text-white rounded">
              <h4 className="font-semibold text-white mb-2">Likely Causes</h4>
              <p className="text-white whitespace-pre-line text-sm opacity-90">{article.causes}</p>
            </div>
          )}

          {/* Video */}
          {(embedUrl || article.videoEmbed) && (
            <div className="rounded-lg overflow-hidden">
              <h4 className="font-semibold text-gray-900 mb-2">Video Guide</h4>
              {embedUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={embedUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={article.title}
                  />
                </div>
              ) : (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: article.videoEmbed || '' }}
                />
              )}
            </div>
          )}

          {/* Steps */}
          <div>
            <h4 className="font-semibold text-njord-dark mb-2">Step-by-Step Fix</h4>
            <div
              className="prose max-w-none text-gray-900 text-sm"
              dangerouslySetInnerHTML={{ __html: article.steps.replace(/\n/g, '<br />') }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
