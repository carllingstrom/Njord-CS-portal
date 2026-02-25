import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
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

    if (!id || !title || !category || !steps) {
      return NextResponse.json(
        { error: 'ID, title, category, and steps are required' },
        { status: 400 }
      )
    }

    const article = await prisma.kBArticle.update({
      where: { id },
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
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.kBArticle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
