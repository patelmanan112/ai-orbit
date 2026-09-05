import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { ArrowLeft, ExternalLink, MapPin, Building2, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CompanyLogo } from '@/components/companies/CompanyLogo';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.aiCompany.findUnique({
    where: { slug },
  });

  if (!company) {
    return {
      title: 'Company Not Found | AI Orbit',
    };
  }

  return {
    title: `${company.name} | AI Orbit`,
    description: company.shortDescription,
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  
  const company = await prisma.aiCompany.findUnique({
    where: { slug },
  });

  if (!company) {
    notFound();
  }

  const categories = company.categories.split(',').filter(Boolean);
  const technologies = company.technologies.split(',').filter(Boolean);
  const industries = company.industry.split(',').filter(Boolean);

  // Find related companies by sharing main category or technology (simple logic for now)
  const relatedCompanies = await prisma.aiCompany.findMany({
    where: {
      AND: [
        { id: { not: company.id } },
        {
          OR: [
            { categories: { contains: categories[0] || '' } },
            { industry: { contains: industries[0] || '' } }
          ]
        }
      ]
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <div className="border-b border-white/10 bg-white/[0.01]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/companies" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
              <CompanyLogo url={company.logo} name={company.name} fallbackClasses="text-4xl font-bold text-white/50" />
            </div>

            <div className="flex-1">
              <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
                  <p className="text-xl text-gray-400">{company.shortDescription}</p>
                </div>
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200 transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {company.companyType}
                </div>
                {company.foundedYear && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Founded {company.foundedYear}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  {company.stage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">About</h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p className="whitespace-pre-wrap leading-relaxed">{company.description}</p>
              </div>
            </section>

            {/* AI Focus & Technologies */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">AI Focus & Technologies</h2>
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-white">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <span key={cat} className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-white">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map(tech => (
                    <span key={tech} className="rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Industries */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Industries</h2>
              <div className="flex flex-wrap gap-2">
                {industries.map(ind => (
                  <span key={ind} className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300">
                    {ind}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Social Links */}
            {(company.website || company.twitter || company.linkedin || company.github) && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Links</h2>
                <div className="flex flex-col gap-3 text-sm">
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                      Website
                    </a>
                  )}
                  {company.twitter && (
                    <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                      Twitter
                    </a>
                  )}
                  {company.linkedin && (
                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                      LinkedIn
                    </a>
                  )}
                  {company.github && (
                    <a href={company.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Related Companies */}
            {relatedCompanies.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Related AI Companies</h2>
                <div className="flex flex-col gap-3">
                  {relatedCompanies.map(related => (
                    <Link key={related.id} href={`/companies/${related.slug}`} className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:border-white/10 hover:bg-white/5 transition-all">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/10 p-1.5">
                        <CompanyLogo url={related.logo} name={related.name} fallbackClasses="text-sm font-bold text-white/50" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">{related.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{related.categories.split(',')[0]}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
