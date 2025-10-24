
import type { Book, Bookshelf } from "./definitions";

const API_ROOT = "https://api.glose.com";
const USER_ID = "5a8411b53ed02c04187ff02a";

async function apiFetch(url: string) {
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Glose-Shelf-Explorer/1.0'
    },
    cache: 'no-store' 
  });
  if (!res.ok) {
    throw new Error(`API call to ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchBookshelves(params: { limit: number; offset: number }): Promise<{ shelves: Bookshelf[]; total: number }> {
  const allShelves: Bookshelf[] = await apiFetch(`${API_ROOT}/users/${USER_ID}/shelves`);
  
  // Manually add formsCount since the /shelves endpoint doesn't provide it directly
  const shelvesWithCounts = await Promise.all(allShelves.map(async (shelf) => {
    try {
      const forms: string[] = await apiFetch(`${API_ROOT}/shelves/${shelf.id}/forms?limit=1000`);
      return { ...shelf, formsCount: forms.length };
    } catch (e) {
      // If a shelf is empty or fails, assume 0 books.
      return { ...shelf, formsCount: 0 };
    }
  }));

  const total = shelvesWithCounts.length;
  const shelves = shelvesWithCounts.slice(params.offset, params.offset + params.limit);
  return { shelves, total };
}

export async function fetchShelfDetails(shelfId: string): Promise<Bookshelf | undefined> {
    const allShelves: Bookshelf[] = await apiFetch(`${API_ROOT}/users/${USER_ID}/shelves`);
    const shelf = allShelves.find((shelf) => shelf.id === shelfId);
    if (!shelf) return undefined;

    try {
        const forms: string[] = await apiFetch(`${API_ROOT}/shelves/${shelf.id}/forms?limit=1000`);
        return { ...shelf, formsCount: forms.length };
    } catch (e) {
        return { ...shelf, formsCount: 0 };
    }
}

async function fetchBookDetails(formId: string): Promise<Book> {
  const form = await apiFetch(`${API_ROOT}/forms/${formId}`);
  return {
    id: form.id,
    title: form.title,
    authors: form.authors || [],
    coverUrl: form.cover?.url || (form.medias?.length > 0 ? form.medias[0].cover.url : undefined),
    price: form.price?.amount > 0 ? form.price : undefined,
    averageRating: form.statistics?.rating?.average,
  };
}

export async function fetchBooksForShelf(params: {
  shelfId: string;
  limit: number;
  offset: number;
}): Promise<{ books: Book[]; total: number }> {
  const allFormIds: string[] = await apiFetch(`${API_ROOT}/shelves/${params.shelfId}/forms?limit=1000`);
  const total = allFormIds.length;

  const paginatedIds = allFormIds.slice(params.offset, params.offset + params.limit);

  if (paginatedIds.length === 0) {
    return { books: [], total };
  }

  const bookPromises = paginatedIds.map((id: string) => fetchBookDetails(id));
  const books = await Promise.all(bookPromises);

  return { books, total };
}
