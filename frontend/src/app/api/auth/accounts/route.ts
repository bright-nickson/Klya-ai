import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

interface SocialAccount {
  provider: string
  id: string
  email: string
  name?: string
  image?: string
}

type RouteParams = {
  provider: string
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // In a real app, you would fetch the connected accounts from your database
    // This is a simplified example
    const connectedAccounts: SocialAccount[] = []
    
    return NextResponse.json(connectedAccounts)
  } catch (error) {
    console.error('Error fetching connected accounts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { provider } = params
    
    // In a real app, you would remove the connected account from your database
    // This is a simplified example
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error disconnecting account:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
