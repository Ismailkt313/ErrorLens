import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
})

export const analyseErrorWithAI = async (error: string, code: string) => {
  const prompt = `
You are a senior software engineer.

Analyze the error and return STRICT JSON in this format:

{
  "explanation": "simple explanation",
  "rootCause": "exact reason",
  "fixes": ["fix1", "fix2", "fix3"]
}

if not code provided ask for code in explanation

Do not return anything outside JSON.

Error:
${error}

Code:
${code}
`

  const response = await client.chat.completions.create({
    model: "openrouter/auto",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3
  })
console.log(response)
const text = response.choices[0].message.content || ""
console.log(text)
let cleanedText = text

cleanedText = cleanedText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

let parsed

try {
  parsed = JSON.parse(cleanedText)
} catch {
  parsed = {
    explanation: cleanedText,
    rootCause: "Could not extract root cause",
    fixes: ["Could not extract fixes"]
  }
}
  let score = 30

  if (parsed.explanation) {
    score += 15
    if (parsed.explanation.length > 40) score += 5
  }

  if (parsed.rootCause) {
    score += 15
    if (parsed.rootCause.length > 20) score += 5
  }

  if (parsed.fixes && Array.isArray(parsed.fixes)) {
    score += Math.min(parsed.fixes.length * 5, 15)
  }

  if (code && code.trim().length > 0) {
    score += 15
  }

  const confidence = Math.min(95, score)

if(!error){
  return {
    explanation: "Error message is required",
    rootCause: "Error message is required",
    fixes: ["Error message is required"],
    confidence: 0
  }
}

return {
  explanation: parsed.explanation,
  rootCause: parsed.rootCause,
  fixes: parsed.fixes,
  confidence
}   
}