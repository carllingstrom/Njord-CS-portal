'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ initialValue = '' }: { initialValue?: string }) {
  const router = useRouter()
  const [search, setSearch] = useState(initialValue)

  useEffect(() => {
    setSearch(initialValue)
  }, [initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-njord-muted pointer-events-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="e.g. line change, wire replacement, battery charging"
        className="w-full pl-12 pr-28 py-4 text-base text-njord-dark border border-gray-200 rounded-xl bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder-gray-400 transition-shadow hover:shadow-card-hover"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 bottom-2 px-5 bg-accent text-white rounded-lg hover:bg-accent-hover font-medium transition-colors shadow-sm"
      >
        Search
      </button>
    </form>
  )
}
