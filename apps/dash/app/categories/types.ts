export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  parentCategory?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  iconUrl?: string;
  parentCategory?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
