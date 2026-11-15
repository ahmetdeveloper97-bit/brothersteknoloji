export interface FaqCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface FaqItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  /** Soru listesinde öne çıkarılan, en çok merak edilenler */
  featured: boolean;
  keywords: string[];
}

export interface FaqGroup {
  category: FaqCategory;
  items: FaqItem[];
}