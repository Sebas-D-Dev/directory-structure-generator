// route.ts
import { GoogleGenerativeAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Google AI client with your API key from environment variables.
// It's generally safe and more performant to initialize the client outside the handler.
// This allows for connection reuse between serverless function invocations.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Handles POST requests to generate content using the Gemini API and streams the response.
 * @param {Request} request The incoming request object, expecting a JSON body with a 'prompt' property.
 * @returns {Response} A streaming response with the generated text or a JSON error.
 */
export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured.' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContentStream(prompt);

    // Create a ReadableStream to send the response as it's generated.
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    // Return the stream as the response.
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content.' },
      { status: 500 }
    );
  }
}
