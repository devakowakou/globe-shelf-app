
import type { Book, Bookshelf } from "./definitions";

// ✅ API publique Glose (pas de token, pas d'auth bizarre)
const API_ROOT = "https://api.glose.com";
const USER_ID = "5a8411b53ed02c04187ff02a";

/**
 * Fonction helper pour faire des appels à l'API Glose
 * ✅ Utilise UNIQUEMENT les endpoints publics documentés
 * ❌ Pas de Next-Router-State-Tree, pas de RSC, pas de JWT
 */
async function apiFetch(url: string) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Désactive le cache Next.js pour toujours avoir des données fraîches
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
  
  // L'API retourne un array, nous devons récupérer le total séparément
  const allShelvesUrl = `${API_ROOT}/users/${USER_ID}/shelves`;
  const allShelves = await apiFetch(allShelvesUrl);
  const total = allShelves.length;
  
  // Récupérer le nombre de livres pour chaque étagère de la page actuelle
  const shelvesWithCounts = await Promise.all(data.map(async (shelf: any) => {
    try {
      const formsUrl = `${API_ROOT}/shelves/${shelf.id}/forms?limit=1`;
      const formsData = await apiFetch(formsUrl);
      
      // Pour obtenir le total, on doit faire un appel sans limite
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
    // Récupérer les informations de l'étagère depuis la liste complète
    const allShelves = await apiFetch(`${API_ROOT}/users/${USER_ID}/shelves`);
    const shelfData = allShelves.find((s: any) => s.id === shelfId);
    
    if (!shelfData) return undefined;

    // Récupérer le nombre total de livres
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
    // 1. Récupérer les IDs des livres avec pagination
    const formsUrl = `${API_ROOT}/shelves/${params.shelfId}/forms?limit=${params.limit}&offset=${params.offset}`;
    const formIds = await apiFetch(formsUrl);
    
    // 2. Récupérer le total sans pagination
    const allFormsUrl = `${API_ROOT}/shelves/${params.shelfId}/forms`;
    const allFormIds = await apiFetch(allFormsUrl);
    const total = allFormIds.length;

    if (formIds.length === 0) {
      return { books: [], total };
    }
    
    // 3. Récupérer les détails de chaque livre en parallèle
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

    // 4. Transformer les données en format Book
    const books: Book[] = booksData
      .filter((form): form is NonNullable<typeof form> => form !== null)
      .map((form: any) => ({
        id: form.id,
        title: form.title || 'Unknown Title',
        authors: form.authors || [],
        coverUrl: form.cover?.url || form.medias?.[0]?.cover?.url,
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
    // Récupérer tous les IDs de livres de l'étagère
    const allFormsUrl = `${API_ROOT}/shelves/${params.shelfId}/forms`;
    const formIds = await apiFetch(allFormsUrl);
    
    if (formIds.length === 0) {
      return { books: [], total: 0 };
    }

    // Récupérer les détails de tous les livres
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

    // Transformer et filtrer
    const allBooks: Book[] = booksData
      .filter((form): form is NonNullable<typeof form> => form !== null)
      .map((form: any) => ({
        id: form.id,
        title: form.title || 'Unknown Title',
        authors: form.authors || [],
        coverUrl: form.cover?.url || form.medias?.[0]?.cover?.url,
        price: form.price?.amount > 0 ? form.price : undefined,
        averageRating: form.statistics?.rating?.average,
      }));

    // Filtrer par requête de recherche
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
