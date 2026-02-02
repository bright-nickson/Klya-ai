// This file provides a list of enabled social providers for backend-driven configuration
export const enabledSocialProviders = [
  'google',
  'github',
  'twitter',
  'linkedin',
  'facebook',
  'instagram',
  'snapchat',
  'threads'
] as const;

export type SocialProvider = typeof enabledSocialProviders[number];

export function getEnabledSocialProviders() {
  return enabledSocialProviders;
}
