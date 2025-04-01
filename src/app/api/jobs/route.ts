import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const job = await prisma.jobApplication.create({
      data: body,
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating job application' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = await prisma.jobApplication.findMany({
      orderBy: {
        dateApplied: 'desc',
      },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching jobs' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const job = await prisma.jobApplication.update({
      where: { id },
      data,
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating job application' }, { status: 500 });
  }
} 