'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { articles as allArticles, Article } from '@/lib/articles'

export default function AdminPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Article editing will be available when a database is connected. Currently articles are managed in code.')
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin - Manage Articles</h1>
          <p className="text-gray-500 mb-8 text-sm">
            View and preview article editing. Full CRUD will be enabled when a database is connected.
          </p>

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
            <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">
              All Articles ({allArticles.length})
            </h2>
            <div className="divide-y">
              {allArticles
                .sort((a, b) => a.order - b.order)
                .map((article) => (
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
