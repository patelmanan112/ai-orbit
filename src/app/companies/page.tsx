'use client';

import { useState, useEffect } from 'react';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import type { AiCompany } from '@prisma/client';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<AiCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      try {
        const res = await fetch(`/api/companies?search=${search}&category=${category}&page=${page}&limit=12`);
        const data = await res.json();
        setCompanies(data.companies || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    }
    
    const debounce = setTimeout(() => {
      fetchCompanies();
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [search, category, page]);


  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            AI Companies
          </h1>
          <p className="mx-auto md:mx-0 max-w-2xl text-lg text-gray-400">
            Discover companies shaping the future of artificial intelligence.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search AI companies..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
            >
              <option value="" className="bg-[#050505] text-white">All Categories</option>
              <option value="Generative AI" className="bg-[#050505] text-white">Generative AI</option>
              <option value="Foundation Models" className="bg-[#050505] text-white">Foundation Models</option>
              <option value="AI Research" className="bg-[#050505] text-white">AI Research</option>
              <option value="Robotics" className="bg-[#050505] text-white">Robotics</option>
            </select>
            
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setView('grid')}
                className={`rounded-md p-1.5 transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`rounded-md p-1.5 transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* List/Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-24 text-center">
            <div className="mb-4 rounded-full bg-white/5 p-4">
              <Search className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">No AI companies found</h3>
            <p className="text-gray-400 max-w-sm mb-6">
              We could not find any companies matching your current search and filters.
            </p>
            <button
              onClick={() => setSearch('')}
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className={view === 'grid' 
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'flex flex-col gap-4'
            }>
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} view={view} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-400 px-4">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
