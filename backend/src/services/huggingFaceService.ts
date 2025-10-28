import { HfInference } from '@huggingface/inference'
import { logger } from '../utils/logger'

class HuggingFaceService {
  private client: HfInference | null = null

  constructor() {
    if (process.env.HUGGINGFACE_API_KEY) {
      this.client = new HfInference(process.env.HUGGINGFACE_API_KEY)
    }
  }

  // Text classification for sentiment analysis
  async analyzeSentiment(text: string, language: 'en' | 'tw' | 'ga' | 'ew' | 'ha' = 'en'): Promise<{
    label: string
    score: number
  }> {
    if (!this.client) {
      throw new Error('Hugging Face API key not configured')
    }
    try {
      // Use a multilingual sentiment analysis model
      const model = 'cardiffnlp/twitter-xlm-roberta-base-sentiment'
      
      const response = await this.client!.textClassification({
        model: model,
        inputs: text
      })

      // Find the highest scoring sentiment
      const result = response[0]
      return {
        label: result.label,
        score: result.score
      }
    } catch (error) {
      logger.error('HuggingFace sentiment analysis error:', error)
      throw new Error('Failed to analyze sentiment')
    }
  }

  // Text summarization
  async summarizeText(text: string, maxLength: number = 150): Promise<string> {
    if (!this.client) {
      throw new Error('Hugging Face API key not configured')
    }
    try {
      const model = 'facebook/bart-large-cnn'
      
      const response = await this.client!.summarization({
        model: model,
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: 30
        }
      })

      return response.summary_text
    } catch (error) {
      logger.error('HuggingFace summarization error:', error)
      throw new Error('Failed to summarize text')
    }
  }

  // Language detection
  async detectLanguage(text: string): Promise<{
    language: string
    confidence: number
  }> {
    try {
      const model = 'papluca/xlm-roberta-base-language-detection'
      
      const response = await this.client!.textClassification({
        model: model,
        inputs: text
      })

      const result = response[0]
      return {
        language: result.label,
        confidence: result.score
      }
    } catch (error) {
      logger.error('HuggingFace language detection error:', error)
      throw new Error('Failed to detect language')
    }
  }

  // Text translation (for basic translations)
  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!this.client) {
      throw new Error('Hugging Face API key not configured')
    }
    try {
      // Use a multilingual translation model
      const model = 'Helsinki-NLP/opus-mt-en-af' // English to African languages
      
      const response = await this.client!.translation({
        model: model,
        inputs: text
      })

      // Handle both single result and array of results
      const result = Array.isArray(response) ? response[0] : response
      return (result as any).translation_text || (result as any).text || result
    } catch (error) {
      logger.error('HuggingFace translation error:', error)
      throw new Error('Failed to translate text')
    }
  }

  // Text generation for specific Ghanaian contexts
  async generateGhanaianContent(prompt: string, options: {
    maxLength?: number
    temperature?: number
    language?: 'en' | 'tw' | 'ga' | 'ew' | 'ha'
  } = {}): Promise<string> {
    if (!this.client) {
      throw new Error('Hugging Face API key not configured')
    }
    try {
      const {
        maxLength = 200,
        temperature = 0.7,
        language = 'en'
      } = options

      // Use a smaller, more focused model
      const model = 'ThomasSimonini/gpt2-small-finetuned-afriqa'
      
      // Enhance prompt with Ghanaian context
      const enhancedPrompt = this.enhancePromptForGhana(prompt, language)
      
      const response = await this.client!.textGeneration({
        model: model,
        inputs: enhancedPrompt,
        parameters: {
          max_new_tokens: maxLength,
          temperature: temperature,
          do_sample: true,
          return_full_text: false,
          top_k: 50,
          top_p: 0.9
        }
      })

      return response.generated_text
    } catch (error) {
      logger.error('HuggingFace text generation error:', error)
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Question answering for Ghanaian business context
  async answerQuestion(question: string, context: string): Promise<string> {
    if (!this.client) {
      throw new Error('Hugging Face API key not configured')
    }
    try {
      const model = 'deepset/roberta-base-squad2'
      
      const response = await this.client!.questionAnswering({
        model: model,
        inputs: {
          question: question,
          context: context
        }
      })

      return response.answer
    } catch (error) {
      logger.error('HuggingFace Q&A error:', error)
      throw new Error('Failed to answer question')
    }
  }

  // Named entity recognition for Ghanaian entities
  async extractEntities(text: string): Promise<Array<{
    entity: string
    label: string
    score: number
  }>> {
    if (!this.client) {
      throw new Error('Hugging Face API key not configured')
    }
    try {
      const model = 'dbmdz/bert-large-cased-finetuned-conll03-english'
      
      const response = await this.client!.tokenClassification({
        model: model,
        inputs: text
      })

      return response.map(item => ({
        entity: item.word,
        label: item.entity_group,
        score: item.score
      }))
    } catch (error) {
      logger.error('HuggingFace NER error:', error)
      throw new Error('Failed to extract entities')
    }
  }

  // Private helper methods
  private enhancePromptForGhana(prompt: string, language: string): string {
    const ghanaContext = {
      en: 'In the context of Ghanaian business and culture: ',
      tw: 'Wɔ Ghana adwumayɛ ne amammerɛ mu: ',
      ga: 'Le Ghana adwuma kɛ amanɔɔ mu: ',
      ew: 'Le Ghana dɔwɔwɔ kple dɔwɔwɔ me: ',
      ha: 'A cikin kasuwanci da al\'adu na Ghana: '
    }
    
    return `${ghanaContext[language as keyof typeof ghanaContext] || ghanaContext.en}${prompt}`
  }
}

export const huggingFaceService = new HuggingFaceService()
