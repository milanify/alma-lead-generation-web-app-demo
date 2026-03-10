import { NextResponse } from 'next/server';
import { leadsDB } from '@/lib/mockDb';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const leadIndex = leadsDB.findIndex(l => l.id === id);
  if (leadIndex === -1) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  leadsDB[leadIndex] = { ...leadsDB[leadIndex], ...body };
  return NextResponse.json(leadsDB[leadIndex]);
}