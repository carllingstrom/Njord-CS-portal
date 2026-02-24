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
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search articles... (e.g., 'line change', 'wire replacement', 'battery charging')"
        className="w-full px-6 py-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-gray-400 shadow-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover font-medium transition-colors"
      >
        Search
      </button>
    </form>
  )
}
