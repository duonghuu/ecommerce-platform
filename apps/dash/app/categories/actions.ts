'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const parentId = formData.get('parentId') as string;
  const status = formData.get('status') as string;
  const file = formData.get('file') as File;

  let iconUrl = 'https://via.placeholder.com/150'; // Default icon

  if (file && file.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    const uploadRes = await fetch(`${BACKEND_URL}/admin/upload`, {
      method: 'POST',
      body: uploadForm,
    });

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      iconUrl = `${BACKEND_URL}${uploadData.data.url}`;
    }
  }
  const payload = {
    name,
    slug: slug || undefined,
    parentId: parentId || undefined,
    isActive: status === 'ACTIVE',
    iconUrl,
    displayOrder: 0,
    isFeatured: false,
  };
  const res = await fetch(`${BACKEND_URL}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || 'Failed to create category' };
  }

  revalidatePath('/categories');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const parentId = formData.get('parentId') as string;
  const status = formData.get('status') as string;
  const file = formData.get('file') as File;

  let iconUrl = '';

  if (file && file.size > 0) {
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    const uploadRes = await fetch(`${BACKEND_URL}/admin/upload`, {
      method: 'POST',
      body: uploadForm,
    });

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      iconUrl = `${BACKEND_URL}${uploadData.data.url}`;
    }
  }

  const payload: any = {
    name,
    slug: slug || undefined,
    parentId: parentId || undefined,
    isActive: status === 'ACTIVE',
  };

  if (iconUrl) {
    payload.iconUrl = iconUrl;
  }

  const res = await fetch(`${BACKEND_URL}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || 'Failed to update category' };
  }

  revalidatePath('/categories');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${BACKEND_URL}/admin/categories/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || 'Failed to delete category' };
  }

  revalidatePath('/categories');
  return { success: true };
}
