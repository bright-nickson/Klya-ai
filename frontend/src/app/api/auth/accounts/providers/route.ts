import { NextResponse } from 'next/server'
import { getEnabledSocialProviders } from '../providers'

export async function GET() {
  // In a real app, you might load from DB or env config
  return NextResponse.json(getEnabledSocialProviders())
}
