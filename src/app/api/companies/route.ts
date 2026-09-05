import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const industry = searchParams.get('industry') || '';
  const technology = searchParams.get('technology') || '';
  const location = searchParams.get('location') || '';
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  const skip = (page - 1) * limit;

  try {
    const where: Prisma.AiCompanyWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
        { industry: { contains: search } },
        { categories: { contains: search } },
        { technologies: { contains: search } },
      ];
    }

    if (category) {
      where.categories = { contains: category };
    }
    if (industry) {
      where.industry = { contains: industry };
    }
    if (technology) {
      where.technologies = { contains: technology };
    }
    if (location) {
      where.location = { contains: location };
    }

    let orderBy: Prisma.AiCompanyOrderByWithRelationInput | Prisma.AiCompanyOrderByWithRelationInput[] = {};

    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'a-z':
        orderBy = { name: 'asc' };
        break;
      case 'z-a':
        orderBy = { name: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [
          { featured: 'desc' },
          { name: 'asc' },
        ];
        break;
    }

    const [companies, total] = await Promise.all([
      prisma.aiCompany.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.aiCompany.count({ where }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // basic validation
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const company = await prisma.aiCompany.create({
      data: body,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating company:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as {code: string}).code === 'P2002') {
      return NextResponse.json(
        { error: 'A company with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
