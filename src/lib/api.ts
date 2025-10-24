
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
  
  const shelvesWithCounts = await Promise.all(allShelves.map(async (shelf) => {
    try {
      const data = await apiFetch(`${API_ROOT}/shelves/${shelf.id}?expand=forms`);
      const formsCount = data.forms?.length ?? 0;
      return { ...shelf, formsCount };
    } catch (e) {
      // If fetching details fails for one shelf, we still want to show the shelf with 0 books.
      return { ...shelf, formsCount: 0 };
    }
  }));

  const total = shelvesWithCounts.length;
  const shelves = shelvesWithCounts.slice(params.offset, params.offset + params.limit);
  return { shelves, total };
}

export async function fetchShelfDetails(shelfId: string): Promise<Bookshelf | undefined> {
    const shelfData = await apiFetch(`${API_ROOT}/shelves/${shelfId}?expand=forms`);
    if (!shelfData) return undefined;

    return {
        ...shelfData,
        formsCount: shelfData.forms?.length ?? 0,
    };
}


export async function fetchBooksForShelf(params: {
  shelfId: string;
  limit: number;
  offset: number;
}): Promise<{ books: Book[]; total: number }> {
  // Fetch the shelf data directly with its forms expanded
  const shelfData = await apiFetch(`${API_ROOT}/shelves/${params.shelfId}?expand=forms`);

  const allForms = shelfData.forms || [];
  const total = allForms.length;

  // Manual pagination on the forms array
  const paginatedForms = allForms.slice(params.offset, params.offset + params.limit);

  if (paginatedForms.length === 0) {
    return { books: [], total };
  }
  
  const books: Book[] = paginatedForms.map((form: any) => ({
    id: form.id,
    title: form.title,
    authors: form.authors || [],
    coverUrl: form.cover?.url || (form.medias?.[0]?.cover?.url ?? undefined),
    price: form.price?.amount > 0 ? form.price : undefined,
    averageRating: form.statistics?.rating?.average,
  }));

  return { books, total };
}
