import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search')
    const category = request.nextUrl.searchParams.get('category')

    const where: any = {
      published: true,
    }

    if (category) {
      where.category = category
    }

    if (search) {
      const searchLower = search.toLowerCase()
      where.OR = [
        { title: { contains: searchLower } },
        { symptoms: { contains: searchLower } },
        { causes: { contains: searchLower } },
        { steps: { contains: searchLower } },
      ]
    }

    const articles = await prisma.kBArticle.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        tags: true,
        symptoms: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

