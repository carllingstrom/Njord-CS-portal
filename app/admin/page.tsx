'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Article {
  id?: string
  title: string
  category: string
  tags: string
  symptoms: string
  causes: string
  steps: string
  videoUrl: string
  videoEmbed: string
  published: boolean
  order: number
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Article>({
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
  })

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles')
      const data = await res.json()
      if (data.articles) {
        setArticles(data.articles)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId ? `/api/admin/articles/${editingId}` : '/api/admin/articles'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? JSON.stringify(formData.tags.split(',').map((t) => t.trim())) : null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to save article')
        return
      }

      await loadArticles()
      setEditingId(null)
      setFormData({
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
      })
    } catch (error) {
      console.error('Error saving article:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (article: any) => {
    setEditingId(article.id)
    setFormData({
      title: article.title,
      category: article.category,
      tags: article.tags ? JSON.parse(article.tags).join(', ') : '',
      symptoms: article.symptoms || '',
      causes: article.causes || '',
      steps: article.steps,
      videoUrl: article.videoUrl || '',
      videoEmbed: article.videoEmbed || '',
      published: article.published,
      order: article.order || 0,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        alert('Failed to delete article')
        return
      }

      await loadArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('An error occurred')
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-njord-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/" className="text-accent hover:text-accent-hover font-medium transition-colors">
              ← Back to Knowledge Base
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin - Manage Articles</h1>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Article' : 'Create New Article'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="feature-not-working">Feature Not Working</option>
                    <option value="setup-installation">Setup / Installation</option>
                    <option value="performance-reliability">Performance / Reliability</option>
                    <option value="account-access">Account & Access</option>
                    <option value="billing-subscription">Billing / Subscription</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="wire, bobbin, replacement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <textarea
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Likely Causes
                </label>
                <textarea
                  rows={2}
                  value={formData.causes}
                  onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step-by-Step Fix *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="1. First step...&#10;2. Second step..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (YouTube/Vimeo)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order (for sorting)
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Video Embed Code (if not using URL)
                </label>
                <textarea
                  rows={3}
                  value={formData.videoEmbed}
                  onChange={(e) => setFormData({ ...formData, videoEmbed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
                  placeholder="<iframe src='...'></iframe>"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
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
                  disabled={loading}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 transition-colors font-medium"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
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
                      })
                    }}
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
            <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">All Articles</h2>
            <div className="divide-y">
              {articles.map((article: any) => (
                <div key={article.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                      <div className="flex gap-2 text-xs">
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
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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
