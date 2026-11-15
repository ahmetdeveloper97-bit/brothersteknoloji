export type SitePageStatus = "draft" | "published";

export interface SitePageSection {
  id: string;
  heading: string;
  body: string;
  image: string;
  bullets: string[];
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  sections: SitePageSection[];
  seoTitle: string;
  seoDescription: string;
  status: SitePageStatus;
  showInFooter: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SitePageSummary {
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  showInFooter: boolean;
  sectionCount: number;
  updatedAt: string;
}

/** Kaydetme sırasında gönderilen alanlar (yeni sayfada id boş olur). */
export type SitePageInput = Omit<SitePage, "createdAt" | "updatedAt">;

export interface SitePageResult {
  ok: boolean;
  code?: string;
  message?: string;
  page?: SitePage;
}