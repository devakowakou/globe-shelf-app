
import type { Book, Bookshelf } from "./definitions";

const API_ROOT = "https://api.glose.com";
const USER_ID = "5a8411b53ed02c04187ff02a";

/**
 * Fonction helper pour faire des appels à l'API Glose
 */
async function apiFetch(url: string) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', 
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${url}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`❌ Failed to fetch: ${url}`, error);
    throw error;
  }
}

/**
 * Récupère la liste des étagères avec pagination
 * Utilise directement les paramètres limit et offset de l'API
 */
export async function fetchBookshelves(params: { limit: number; offset: number }): Promise<{ shelves: Bookshelf[]; total: number }> {
  const url = `${API_ROOT}/users/${USER_ID}/shelves?limit=${params.limit}&offset=${params.offset}`;
  const data = await apiFetch(url);
  const allShelvesUrl = `${API_ROOT}/users/${USER_ID}/shelves`;
  const allShelves = await apiFetch(allShelvesUrl);
  const total = allShelves.length;
  
  const shelvesWithCounts = await Promise.all(data.map(async (shelf: any) => {
    try {
      const formsUrl = `${API_ROOT}/shelves/${shelf.id}/forms?limit=1`;
      const formsData = await apiFetch(formsUrl);
      
      const allFormsUrl = `${API_ROOT}/shelves/${shelf.id}/forms`;
      const allForms = await apiFetch(allFormsUrl);
      const formsCount = allForms.length;
      
      return {
        id: shelf.id,
        title: shelf.title,
        formsCount
      };
    } catch (e) {
      console.error(`Error fetching forms count for shelf ${shelf.id}:`, e);
      return {
        id: shelf.id,
        title: shelf.title,
        formsCount: 0
      };
    }
  }));

  return { shelves: shelvesWithCounts, total };
}

/**
 * Récupère les détails d'une étagère spécifique
 */
export async function fetchShelfDetails(shelfId: string): Promise<Bookshelf | undefined> {
  try {
    const allShelves = await apiFetch(`${API_ROOT}/users/${USER_ID}/shelves`);
    const shelfData = allShelves.find((s: any) => s.id === shelfId);
    if (!shelfData) return undefined;
    const formsUrl = `${API_ROOT}/shelves/${shelfId}/forms`;
    const forms = await apiFetch(formsUrl);
    
    return {
      id: shelfData.id,
      title: shelfData.title,
      formsCount: forms.length
    };
  } catch (e) {
    console.error(`Error fetching shelf details for ${shelfId}:`, e);
    return undefined;
  }
}

/**
 * Récupère les livres d'une étagère avec pagination
 * Utilise l'API correctement: /shelves/:shelfId/forms puis /forms/:formId
 */
export async function fetchBooksForShelf(params: {
  shelfId: string;
  limit: number;
  offset: number;
}): Promise<{ books: Book[]; total: number }> {
  try {
    const formsUrl = `${API_ROOT}/shelves/${params.shelfId}/forms?limit=${params.limit}&offset=${params.offset}`;
    const formIds = await apiFetch(formsUrl);
    const allFormsUrl = `${API_ROOT}/shelves/${params.shelfId}/forms`;
    const allFormIds = await apiFetch(allFormsUrl);
    const total = allFormIds.length;

    if (formIds.length === 0) {
      return { books: [], total };
    }
    
    const booksData = await Promise.all(
      formIds.map(async (formId: string) => {
        try {
          const formUrl = `${API_ROOT}/forms/${formId}`;
          return await apiFetch(formUrl);
        } catch (e) {
          console.error(`Error fetching form ${formId}:`, e);
          return null;
        }
      })
    );

    const books: Book[] = booksData
      .filter((form): form is NonNullable<typeof form> => form !== null)
      .map((form: any) => ({
        id: form.id,
        title: form.title || 'Unknown Title',
        authors: form.authors || [],
        coverUrl: form.image || form.cover?.url || form.medias?.[0]?.cover?.url,
        price: form.price?.amount > 0 ? form.price : undefined,
        averageRating: form.statistics?.rating?.average,
      }));

    return { books, total };
  } catch (e) {
    console.error(`Error fetching books for shelf ${params.shelfId}:`, e);
    throw e;
  }
}

/**
 * Recherche de livres dans une étagère (recherche locale sur toutes les pages)
 */
export async function searchBooksInShelf(params: {
  shelfId: string;
  query: string;
}): Promise<{ books: Book[]; total: number }> {
  try {
    const allFormsUrl = `${API_ROOT}/shelves/${params.shelfId}/forms`;
    const formIds = await apiFetch(allFormsUrl);
    
    if (formIds.length === 0) {
      return { books: [], total: 0 };
    }

    const booksData = await Promise.all(
      formIds.map(async (formId: string) => {
        try {
          const formUrl = `${API_ROOT}/forms/${formId}`;
          return await apiFetch(formUrl);
        } catch (e) {
          console.error(`Error fetching form ${formId}:`, e);
          return null;
        }
      })
    );

    const allBooks: Book[] = booksData
      .filter((form): form is NonNullable<typeof form> => form !== null)
      .map((form: any) => ({
        id: form.id,
        title: form.title || 'Unknown Title',
        authors: form.authors || [],
        coverUrl: form.image || form.cover?.url || form.medias?.[0]?.cover?.url,
        price: form.price?.amount > 0 ? form.price : undefined,
        averageRating: form.statistics?.rating?.average,
      }));

    const query = params.query.toLowerCase();
    const filteredBooks = allBooks.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.authors.some(author => author.name.toLowerCase().includes(query))
    );

    return { books: filteredBooks, total: filteredBooks.length };
  } catch (e) {
    console.error(`Error searching books in shelf ${params.shelfId}:`, e);
    throw e;
  }
}
