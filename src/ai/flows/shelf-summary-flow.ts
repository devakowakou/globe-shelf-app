'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const ShelfSummaryInputSchema = z.object({
  shelfTitle: z.string().describe('The title of the bookshelf.'),
  bookTitles: z.array(z.string()).describe('A list of book titles from the shelf.'),
});

export type ShelfSummaryInput = z.infer<typeof ShelfSummaryInputSchema>;

export async function generateShelfSummary(input: ShelfSummaryInput): Promise<string> {
  if (!input.shelfTitle || input.bookTitles.length === 0) {
    return 'Explore this collection of books.';
  }

  const result = await shelfSummaryFlow(input);
  return result;
}

const shelfSummaryFlow = ai.defineFlow(
  {
    name: 'shelfSummaryFlow',
    inputSchema: ShelfSummaryInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are a creative writer. Write a short, engaging, one-sentence summary (max 25 words) for a bookshelf.
        Bookshelf Title: "${input.shelfTitle}"
        Some books on the shelf: ${input.bookTitles.join(', ')}
        
        Generate a compelling summary that captures the essence of the collection. Do not just list the books.
      `,
      config: {
        maxOutputTokens: 50,
        temperature: 0.7,
      },
    });

    return output || `Discover a collection of books titled "${input.shelfTitle}".`;
  }
);
