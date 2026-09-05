import Link from 'next/link';
import { ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import type { AiCompany } from '@prisma/client';

interface CompanyCardProps {
  company: AiCompany;
  view: 'grid' | 'list';
}

import { CompanyLogo } from './CompanyLogo';

export function CompanyCard({ company, view }: CompanyCardProps) {
  const isList = view === 'list';
  const mainCategory = company.categories.split(',')[0];

  return (
    <div className={`group relative block overflow-hidden rounded-xl border border-white/10 bg-black/50 p-6 transition-all hover:border-white/20 hover:bg-white/[0.02] ${isList ? 'flex items-center gap-6' : ''}`}>
      {/* Invisible link that covers the entire card for accessible navigation without nesting a tags */}
      <Link href={`/companies/${company.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {company.name} details</span>
      </Link>

      <div className={`relative z-10 flex items-start justify-between ${isList ? 'flex-shrink-0' : 'mb-4'} pointer-events-none`}>
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 p-2">
          <CompanyLogo url={company.logo} name={company.name} />
        </div>
      </div>
      
      <div className={`relative z-10 ${isList ? 'flex-1' : ''} pointer-events-none`}>
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden pointer-events-auto">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">{company.name}</h3>
            {company.website && (
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} 
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                title="Visit Website"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {isList && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70 whitespace-nowrap">{mainCategory}</span>}
        </div>
        <p className={`text-sm text-gray-400 ${isList ? 'mb-2' : 'mb-4 line-clamp-2'}`}>{company.shortDescription}</p>
        
        {!isList && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70">{mainCategory}</span>
          </div>
        )}
        
        <div className={`flex items-center justify-between text-xs text-gray-500 ${isList ? 'w-full' : ''}`}>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{company.location}</span>
          </div>
          <span className="flex items-center gap-1 text-blue-400 opacity-0 transition-opacity group-hover:opacity-100 font-medium">
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
