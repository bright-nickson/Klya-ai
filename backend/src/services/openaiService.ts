import OpenAI from 'openai'
import { logger } from '../utils/logger'

class OpenAIService {
  private client: OpenAI | null = null

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
  }

  // Generate content using GPT
  async generateContent(prompt: string, options: {
    language?: 'en' | 'tw' | 'ga' | 'ew' | 'ha'
    tone?: 'professional' | 'casual' | 'friendly' | 'formal'
    maxTokens?: number
    temperature?: number
  } = {}): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured')
    }
    try {
      const {
        language = 'en',
        tone = 'professional',
        maxTokens = 1000,
        temperature = 0.7
      } = options

      // Add language-specific context
      const languageContext = this.getLanguageContext(language)
      const toneContext = this.getToneContext(tone)
      
      const systemPrompt = `You are an AI assistant specialized in creating content for Ghanaian businesses and digital creators. 
      ${languageContext}
      ${toneContext}
      
      Always consider Ghanaian cultural context, local business practices, and regional preferences.
      Provide practical, actionable content that resonates with Ghanaian audiences.`

      const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
      const response = await this.client!.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      })

      return response.choices[0]?.message?.content || ''
    } catch (error: any) {
      logger.error('OpenAI content generation error:', error)
      // If error has a message, include it in the thrown error
      if (error?.message) {
        throw new Error(`OpenAI error: ${error.message}`)
      }
      throw new Error('Failed to generate content')
    }
  }

  // Transcribe audio using Whisper
  async transcribeAudio(audioBuffer: Buffer, options: {
    language?: 'en' | 'tw' | 'ga' | 'ew' | 'ha'
    responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  } = {}): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured')
    }
    try {
      const {
        language = 'en',
        responseFormat = 'text'
      } = options

      // Convert language code to Whisper format
      const whisperLanguage = this.getWhisperLanguageCode(language)

      const response = await this.client!.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' }),
        model: 'whisper-1',
        language: whisperLanguage,
        response_format: responseFormat
      })

      return typeof response === 'string' ? response : response.text
    } catch (error) {
      logger.error('OpenAI transcription error:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  // Generate image using DALL-E
  async generateImage(prompt: string, options: {
    size?: '256x256' | '512x512' | '1024x1024'
    quality?: 'standard' | 'hd'
    style?: 'vivid' | 'natural'
  } = {}): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured')
    }
    try {
      const {
        size = '512x512',
        quality = 'standard',
        style = 'natural'
      } = options

      // Add Ghanaian context to image prompts
      const enhancedPrompt = `Create an image for Ghanaian business context: ${prompt}. 
      Include elements that reflect Ghanaian culture, colors, and business environment when appropriate.`

      const response = await this.client!.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        size: size,
        quality: quality,
        style: style,
        n: 1
      })

      return response.data?.[0]?.url || ''
    } catch (error) {
      logger.error('OpenAI image generation error:', error)
      throw new Error('Failed to generate image')
    }
  }

  // Private helper methods
  private getLanguageContext(language: string): string {
    const contexts = {
      en: 'Respond in English with Ghanaian business context and terminology.',
      tw: 'Respond in Twi (Akan) language. Use appropriate Twi business terms and cultural references.',
      ga: 'Respond in Ga language. Use appropriate Ga business terms and cultural references.',
      ew: 'Respond in Ewe language. Use appropriate Ewe business terms and cultural references.',
      ha: 'Respond in Hausa language. Use appropriate Hausa business terms and cultural references.'
    }
    return contexts[language as keyof typeof contexts] || contexts.en
  }

  private getToneContext(tone: string): string {
    const contexts = {
      professional: 'Use a professional, business-appropriate tone suitable for corporate communications.',
      casual: 'Use a casual, friendly tone suitable for social media and informal communications.',
      friendly: 'Use a warm, approachable tone that builds trust and connection.',
      formal: 'Use a formal, respectful tone suitable for official documents and formal communications.'
    }
    return contexts[tone as keyof typeof contexts] || contexts.professional
  }

  private getWhisperLanguageCode(language: string): string {
    const codes = {
      en: 'en',
      tw: 'en', // Twi is not directly supported, use English
      ga: 'en', // Ga is not directly supported, use English
      ew: 'en', // Ewe is not directly supported, use English
      ha: 'ha'  // Hausa is supported
    }
    return codes[language as keyof typeof codes] || 'en'
  }
}

export const openaiService = new OpenAIService()
