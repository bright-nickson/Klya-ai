"use client"

import React, { useState } from 'react'

export default function TextGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token.trim()) headers['Authorization'] = `Bearer ${token.trim()}`

      const res = await fetch('http://localhost:3001/api/ai/content', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: prompt.trim(), contentType: 'marketing', topic: prompt.trim() }),
      })

      const text = await res.text()
      // try parse json
      try {
        const data = JSON.parse(text)
        if (!res.ok) throw new Error(JSON.stringify(data))
        const generated = data.data?.content ?? data.content ?? data.text ?? data.result ?? data
        setResult(typeof generated === 'string' ? generated : JSON.stringify(generated, null, 2))
      } catch (err: any) {
        if (!res.ok) throw new Error(text || `Request failed with status ${res.status}`)
        setResult(text)
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">✨ AfriGrowth AI — Smart Content Generator</h1>

        <label className="block mb-2 text-sm font-medium text-gray-700">Prompt</label>
        <textarea
          className="w-full h-40 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your marketing idea or product description..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Optional JWT (for protected API)</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste JWT here if required"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <div className="flex items-center gap-4 mt-4">
          <button
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>

          {loading && (
            <div className="text-sm text-gray-500">Please wait — AI is crafting your content.</div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Result</h2>
          <div className="min-h-[120px] p-4 border rounded-md bg-gray-50 whitespace-pre-wrap text-gray-800">
            {error && <div className="text-red-600">Error: {error}</div>}
            {!error && !result && !loading && <div className="text-gray-400">No content generated yet.</div>}
            {!error && result && <div>{result}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
