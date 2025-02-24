export interface User {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  name: string;
  author: string;
  year: number;
  userId?: number | null;
  score?: number;
  currentOwner?: string;
  stats: {
    totalBorrows: number;
    lastBorrowed: string | null;
    isAvailable: boolean;
  };
}

export interface BorrowHistory {
  name: string;
  userScore?: number;
}

export interface UserDetail {
  id: number;
  name: string;
  books: {
    present: {
      id: number;
      name: string;
      author: string;
      borrowedAt: string;
    }[];
    past: {
      id: number;
      name: string;
      author: string;
      borrowedAt: string;
      returnedAt: string;
      userScore: number;
    }[];
  };
} 