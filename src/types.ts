export interface BucketItem {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  images: string[]; // List of base64 compressed data URLs
  dateCompleted?: string; // Automatically saved timestamp
  category?: string; // Optional fun category
  stickerType?: string; // Optional cute sticker type
  angle?: number; // Visual slant angle (-3 to 3 deg) for scrapbook aesthetic
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  color: string;
  stickerClass: string;
}

export interface SummerQuote {
  quote: string;
  author: string;
}
