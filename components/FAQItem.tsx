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
    tags?: string[] | string | null
  }
}

export default function FAQItem({ article }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tags: string[] = Array.isArray(article.tags)
    ? article.tags
    : article.tags
      ? JSON.parse(article.tags)
      : []

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
    <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover hover:border-gray-200 transition-all duration-200">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-njord-pale/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-njord-dark mb-1">
            {article.title}
          </h3>
          {article.symptoms && !isOpen && (
            <p className="text-sm text-njord-muted line-clamp-1">
              <span className="font-medium text-njord-dark">Symptoms:</span> {article.symptoms}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-xs bg-accent-pale text-accent-hover px-2.5 py-1 rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-njord-pale flex items-center justify-center">
          <svg
            className={`w-4 h-4 text-njord-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="px-6 py-5 border-t border-gray-100 space-y-5 bg-njord-subtle/30">
          {/* Symptoms */}
          {article.symptoms && (
            <div className="p-4 bg-njord-dark text-white rounded-lg">
              <h4 className="font-semibold text-white mb-2">Symptoms</h4>
              <p className="text-white/90 whitespace-pre-line text-sm leading-relaxed">{article.symptoms}</p>
            </div>
          )}

          {/* Causes */}
          {article.causes && (
            <div className="p-4 bg-njord-dark text-white rounded-lg">
              <h4 className="font-semibold text-white mb-2">Likely Causes</h4>
              <p className="text-white/90 whitespace-pre-line text-sm leading-relaxed">{article.causes}</p>
            </div>
          )}

          {/* Video */}
          {(embedUrl || article.videoEmbed) && (
            <div className="rounded-lg overflow-hidden">
              <h4 className="font-semibold text-njord-dark mb-2">Video Guide</h4>
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
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <h4 className="font-semibold text-njord-dark mb-3">Step-by-Step Fix</h4>
            <div
              className="prose prose-sm max-w-none text-njord-dark prose-headings:text-njord-dark prose-p:text-njord-muted prose-li:text-njord-muted"
              dangerouslySetInnerHTML={{ __html: article.steps.replace(/\n/g, '<br />') }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
