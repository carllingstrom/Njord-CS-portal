'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <nav className="bg-njord-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-white text-2xl font-bold">
              NJORD
            </div>
            <div className="text-white text-sm font-light">
              MEDTECH
            </div>
            <div className="ml-4 text-white text-sm font-light opacity-80">
              Support Portal
            </div>
          </Link>
          {!isAdmin && (
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-sm text-white hover:text-accent-light transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
