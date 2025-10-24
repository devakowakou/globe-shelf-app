export interface Bookshelf {
  id: string;
  title: string;
  formsCount: number;
}

export interface Book {
  id: string;
  title: string;
  authors: { name: string }[];
  coverUrl?: string;
  price?: {
    amount: number;
    currency: string;
  };
  averageRating?: number;
}
