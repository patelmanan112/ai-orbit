import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // We can allow fetching by id or slug. Let's try slug first, then id
    let company = await prisma.aiCompany.findUnique({
      where: { slug: id },
    });

    if (!company) {
      company = await prisma.aiCompany.findUnique({
        where: { id },
      });
    }

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const company = await prisma.aiCompany.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(company);
  } catch (error: unknown) {
    console.error('Error updating company:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as {code: string}).code === 'P2025') {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.aiCompany.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('Error deleting company:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as {code: string}).code === 'P2025') {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
