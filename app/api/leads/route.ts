import { NextResponse } from 'next/server';
import { leadsDB } from '@/lib/mockDb';
import { Lead } from '@/types';

export async function GET() {
  // Sort by submitted date descending
  const sortedLeads = [...leadsDB].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  return NextResponse.json(sortedLeads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic server-side validation
    if (!body.firstName || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newLead: Lead = {
      id: Math.random().toString(36).substring(7),
      ...body,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };

    leadsDB.push(newLead);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}