import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.kBArticle.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      category,
      tags,
      symptoms,
      causes,
      steps,
      videoUrl,
      videoEmbed,
      published,
      order,
    } = await request.json()

    if (!title || !category || !steps) {
      return NextResponse.json(
        { error: 'Title, category, and steps are required' },
        { status: 400 }
      )
    }

    const article = await prisma.kBArticle.create({
      data: {
        title,
        category,
        tags,
        symptoms: symptoms || '',
        causes: causes || '',
        steps,
        videoUrl: videoUrl || null,
        videoEmbed: videoEmbed || null,
        published: published !== false,
        order: order || 0,
      },
    })

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
