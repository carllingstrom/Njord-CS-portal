import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const article = await prisma.kBArticle.update({
      where: { id: params.id },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.kBArticle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
