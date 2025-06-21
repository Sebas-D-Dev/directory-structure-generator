import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google AI client with your API key from environment variables.
// It's generally safe and more performant to initialize the client outside the handler.
// This allows for connection reuse between serverless function invocations.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Handles POST requests to generate content using the Gemini API.
 * @param {Request} request The incoming request object, expecting a JSON body with a 'prompt' property.
 * @returns {Response} A JSON response containing the generated text or an error.
 */
export async function POST(request: Request) {
  // 1. Check for API key
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured.' },
      { status: 500 }
    );
  }

  try {
    // 2. Get the prompt from the request body.
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // 3. Select the Gemini model.
    // 'gemini-1.5-flash' is a great, fast model for general tasks.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 4. Generate the content.
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Send the generated text back to the client.
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content.' },
      { status: 500 }
    );
  }
}
