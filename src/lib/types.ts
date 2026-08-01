export type AdminRole = "admin" | "editor";
export type MediaType = "image" | "instagram" | "youtube";

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  history: string;
  vision: string;
  mission: string[];
  instagramUrl: string;
  youtubeUrl: string;
  email: string;
  whatsapp: string;
  memberFormUrl: string;
  loanFormUrl: string;
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  startAt: Date;
  endAt: Date | null;
  location: string;
  registrationUrl: string;
  coverImageUrl: string;
  status: "draft" | "published";
  featured: boolean;
}

export interface Division {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coordinator: string;
  iconKey: string;
  sortOrder: number;
  active: boolean;
}

export interface BoardMember {
  id: number;
  name: string;
  role: string;
  division: string;
  period: string;
  photoUrl: string;
  sortOrder: number;
  active: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  activity: string;
  mediaType: MediaType;
  mediaUrl: string;
  eventDate: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
}
