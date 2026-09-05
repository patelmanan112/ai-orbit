'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AiCompany } from '@prisma/client';

type FormProps = {
  initialData?: AiCompany;
  isEdit?: boolean;
};

export function CompanyForm({ initialData, isEdit }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    logo: initialData?.logo || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    industry: initialData?.industry || '',
    categories: initialData?.categories || '',
    technologies: initialData?.technologies || '',
    location: initialData?.location || '',
    companyType: initialData?.companyType || '',
    stage: initialData?.stage || '',
    foundedYear: initialData?.foundedYear ? String(initialData.foundedYear) : '',
    website: initialData?.website || '',
    twitter: initialData?.twitter || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    featured: initialData?.featured || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear, 10) : null
    };

    try {
      const url = isEdit ? `/api/companies/${initialData?.id}` : '/api/companies';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/admin/companies');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-sm text-white placeholder-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/10 rounded-xl p-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Company Name *</label>
          <input required name="name" value={formData.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Slug *</label>
          <input required name="slug" value={formData.slug} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Logo URL</label>
          <input name="logo" value={formData.logo} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Location *</label>
          <input required name="location" value={formData.location} onChange={handleChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-1">Short Description *</label>
          <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-1">Full Description *</label>
          <textarea required name="description" rows={5} value={formData.description} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Categories (comma separated) *</label>
          <input required name="categories" value={formData.categories} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Technologies (comma separated) *</label>
          <input required name="technologies" value={formData.technologies} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Industry *</label>
          <input required name="industry" value={formData.industry} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Founded Year</label>
          <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Company Type</label>
          <input name="companyType" value={formData.companyType} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Stage</label>
          <input name="stage" value={formData.stage} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
          <input name="website" value={formData.website} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Twitter</label>
          <input name="twitter" value={formData.twitter} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)} className="rounded border-gray-300 bg-white/5" />
        <label htmlFor="featured" className="text-sm text-gray-400">Featured Company</label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black hover:bg-gray-200 disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Company'}
        </button>
      </div>
    </form>
  );
}
