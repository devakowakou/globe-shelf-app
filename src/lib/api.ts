import type { Book, Bookshelf } from "./definitions";

const API_ROOT = "https://api.glose.com";
const USER_ID = "5a8411b53ed02c04187ff02a";

async function apiFetch(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API call to ${url} failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchBookshelves(params: { limit: number; offset: number }): Promise<{ shelves: Bookshelf[]; total: number }> {
  const allShelves: Bookshelf[] = await apiFetch(`${API_ROOT}/users/${USER_ID}/shelves`);
  const total = allShelves.length;
  const shelves = allShelves.slice(params.offset, params.offset + params.limit);
  return { shelves, total };
}

export async function fetchShelfDetails(shelfId: string): Promise<Bookshelf | undefined> {
  const allShelves: Bookshelf[] = await apiFetch(`${API_ROOT}/users/${USER_ID}/shelves`);
  return allShelves.find((shelf) => shelf.id === shelfId);
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
  // Correctly fetch the response which contains a 'forms' array of book IDs
  const shelfFormsResponse = await apiFetch(`${API_ROOT}/shelves/${params.shelfId}/forms?limit=1000`);
  const allFormIds: string[] = Array.isArray(shelfFormsResponse?.forms) ? shelfFormsResponse.forms : [];
  const total = allFormIds.length;

  const paginatedIds = allFormIds.slice(params.offset, params.offset + params.limit);

  if (paginatedIds.length === 0) {
    return { books: [], total };
  }

  // Fetch details for the paginated book IDs
  const bookPromises = paginatedIds.map((id: string) => fetchBookDetails(id));
  const books = await Promise.all(bookPromises);

  return { books, total };
}
