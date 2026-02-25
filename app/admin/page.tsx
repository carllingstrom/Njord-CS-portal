'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { articles as defaultArticles, Article } from '@/lib/articles'

const STORAGE_KEY = 'njord-admin-articles'

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) + '-' + Date.now().toString(36)
}

function loadArticles(): Article[] {
  if (typeof window === 'undefined') return defaultArticles
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultArticles
    }
  }
  return defaultArticles
}

function saveArticles(articles: Article[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
}

const emptyForm = {
  title: '',
  category: 'feature-not-working',
  tags: '',
  symptoms: '',
  causes: '',
  steps: '',
  videoUrl: '',
  videoEmbed: '',
  published: true,
  order: 0,
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>(defaultArticles)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saveMessage, setSaveMessage] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setArticles(loadArticles())
    setLoaded(true)
  }, [])

  const persist = useCallback((updated: Article[]) => {
    setArticles(updated)
    saveArticles(updated)
    setSaveMessage('Saved')
    setTimeout(() => setSaveMessage(''), 2000)
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData(emptyForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (editingId) {
      const updated = articles.map((a) =>
        a.id === editingId
          ? {
              ...a,
              title: formData.title,
              category: formData.category,
              tags,
              symptoms: formData.symptoms,
              causes: formData.causes,
              steps: formData.steps,
              videoUrl: formData.videoUrl || null,
              videoEmbed: formData.videoEmbed || null,
              published: formData.published,
              order: formData.order,
            }
          : a
      )
      persist(updated)
    } else {
      const newArticle: Article = {
        id: generateId(formData.title),
        title: formData.title,
        category: formData.category,
        tags,
        symptoms: formData.symptoms,
        causes: formData.causes,
        steps: formData.steps,
        videoUrl: formData.videoUrl || null,
        videoEmbed: formData.videoEmbed || null,
        published: formData.published,
        order: formData.order,
      }
      persist([...articles, newArticle])
    }

    resetForm()
  }

  const handleEdit = (article: Article) => {
    setEditingId(article.id)
    setFormData({
      title: article.title,
      category: article.category,
      tags: article.tags.join(', '),
      symptoms: article.symptoms,
      causes: article.causes,
      steps: article.steps,
      videoUrl: article.videoUrl || '',
      videoEmbed: article.videoEmbed || '',
      published: article.published,
      order: article.order,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    persist(articles.filter((a) => a.id !== id))
  }

  const handleExport = () => {
    const json = JSON.stringify(articles, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'articles.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (!confirm('Reset all articles to the built-in defaults? Any edits will be lost.')) return
    localStorage.removeItem(STORAGE_KEY)
    setArticles(defaultArticles)
    resetForm()
    setSaveMessage('Reset to defaults')
    setTimeout(() => setSaveMessage(''), 2000)
  }

  const sorted = [...articles].sort((a, b) => a.order - b.order)

  if (!loaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/" className="text-accent hover:text-accent-hover font-medium transition-colors">
              &larr; Back to Knowledge Base
            </Link>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Admin - Manage Articles</h1>
            {saveMessage && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {saveMessage}
              </span>
            )}
          </div>
          <p className="text-gray-500 mb-8 text-sm">
            Changes are saved in your browser. Use Export to download the data for the codebase.
          </p>

          {/* Toolbar */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-njord-dark text-white rounded-lg hover:bg-njord-dark/90 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export JSON
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Article' : 'Create New Article'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  >
                    <option value="feature-not-working">Feature Not Working</option>
                    <option value="setup-installation">Setup / Installation</option>
                    <option value="performance-reliability">Performance / Reliability</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="account-access">Account &amp; Access</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="wire, bobbin, replacement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <textarea
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Likely Causes</label>
                <textarea
                  rows={2}
                  value={formData.causes}
                  onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Step-by-Step Fix *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm text-gray-900"
                  placeholder={"1. First step...\n2. Second step..."}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order (for sorting)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Video Embed Code</label>
                <textarea
                  rows={3}
                  value={formData.videoEmbed}
                  onChange={(e) => setFormData({ ...formData, videoEmbed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs text-gray-900"
                  placeholder="<iframe src='...'></iframe>"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="mr-2"
                  />
                  Published (visible to users)
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
                >
                  {editingId ? 'Update Article' : 'Create Article'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Articles List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">
              All Articles ({articles.length})
            </h2>
            <div className="divide-y">
              {sorted.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                      <div className="flex gap-2 text-xs flex-wrap">
                        <span className={`px-2 py-1 rounded ${article.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">
                          Order: {article.order}
                        </span>
                        {article.videoUrl && (
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                            Has Video
                          </span>
                        )}
                        {article.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(article)}
                        className="px-4 py-2 text-sm bg-accent text-white rounded hover:bg-accent-hover transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
