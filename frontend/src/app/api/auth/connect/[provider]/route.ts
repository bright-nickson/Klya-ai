import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { provider } = params
    const { searchParams } = new URL(request.url)
    const returnTo = searchParams.get('returnTo') || '/dashboard'

    // In a real app, you would initiate the OAuth flow here
    // and handle the callback to connect the account to the user
    // This is a simplified example
    
    // For now, we'll just redirect back with a success message
    return NextResponse.redirect(
      new URL(`${returnTo}?social=${provider}&status=connected`, request.url)
    )
  } catch (error) {
    console.error('Error connecting social account:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
